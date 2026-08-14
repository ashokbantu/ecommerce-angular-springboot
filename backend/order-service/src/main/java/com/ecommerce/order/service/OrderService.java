package com.ecommerce.order.service;

import com.ecommerce.common.dto.ApiResponse;
import com.ecommerce.common.exception.BusinessException;
import com.ecommerce.common.exception.ResourceNotFoundException;
import com.ecommerce.order.client.InventoryClient;
import com.ecommerce.order.client.PaymentClient;
import com.ecommerce.order.dto.CartItemRequest;
import com.ecommerce.order.dto.InventoryResponse;
import com.ecommerce.order.dto.OrderEvent;
import com.ecommerce.order.dto.OrderRequest;
import com.ecommerce.order.dto.OrderResponse;
import com.ecommerce.order.dto.PaymentRequest;
import com.ecommerce.order.dto.PaymentResponse;
import com.ecommerce.order.entity.Order;
import com.ecommerce.order.entity.OrderItem;
import com.ecommerce.order.messaging.OrderEventPublisher;
import com.ecommerce.order.repository.OrderRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

/**
 * Order workflow demonstrates synchronous orchestration via Feign plus
 * asynchronous integration through RabbitMQ.
 */
@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final InventoryClient inventoryClient;
    private final PaymentClient paymentClient;
    private final OrderEventPublisher orderEventPublisher;

    public OrderService(OrderRepository orderRepository,
                        InventoryClient inventoryClient,
                        PaymentClient paymentClient,
                        OrderEventPublisher orderEventPublisher) {
        this.orderRepository = orderRepository;
        this.inventoryClient = inventoryClient;
        this.paymentClient = paymentClient;
        this.orderEventPublisher = orderEventPublisher;
    }

    @Transactional
    public OrderResponse createOrder(String userId, OrderRequest request) {
        request.getItems().forEach(this::validateCartItem);
        request.getItems().forEach(this::ensureInventoryAvailable);

        Order order = new Order();
        order.setUserId(userId);
        order.setShippingAddress(request.getShippingAddress());
        order.setStatus(Order.OrderStatus.CREATED);

        BigDecimal totalAmount = BigDecimal.ZERO;
        for (CartItemRequest itemRequest : request.getItems()) {
            OrderItem item = new OrderItem();
            item.setProductId(itemRequest.getProductId());
            item.setProductName(itemRequest.getProductName());
            item.setQuantity(itemRequest.getQuantity());
            item.setPrice(itemRequest.getPrice());
            order.addItem(item);
            totalAmount = totalAmount.add(itemRequest.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity())));
        }
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);
        orderEventPublisher.publishOrderCreated(toOrderEvent(savedOrder));

        PaymentResponse paymentResponse = processPayment(savedOrder);
        if ("SUCCESS".equalsIgnoreCase(paymentResponse.getStatus())) {
            savedOrder.setStatus(Order.OrderStatus.PAID);
            savedOrder = orderRepository.save(savedOrder);
        }

        return toResponse(savedOrder);
    }

    public List<OrderResponse> getOrdersForUser(String userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream().map(this::toResponse).toList();
    }

    public OrderResponse getOrder(Long orderId) {
        return toResponse(orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId)));
    }

    @CircuitBreaker(name = "inventoryService", fallbackMethod = "inventoryFallback")
    public void ensureInventoryAvailable(CartItemRequest itemRequest) {
        ApiResponse<InventoryResponse> response = inventoryClient.getInventory(itemRequest.getProductId());
        InventoryResponse inventory = response.getData();
        if (inventory == null || inventory.getAvailableQuantity() < itemRequest.getQuantity()) {
            throw new BusinessException("Insufficient stock for product id: " + itemRequest.getProductId(), HttpStatus.BAD_REQUEST);
        }
    }

    public void inventoryFallback(CartItemRequest itemRequest, Throwable throwable) {
        throw new BusinessException("Inventory service is temporarily unavailable", HttpStatus.SERVICE_UNAVAILABLE);
    }

    @CircuitBreaker(name = "paymentService", fallbackMethod = "paymentFallback")
    public PaymentResponse processPayment(Order order) {
        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setOrderId(order.getId());
        paymentRequest.setUserId(order.getUserId());
        paymentRequest.setAmount(order.getTotalAmount());
        ApiResponse<PaymentResponse> response = paymentClient.processPayment(paymentRequest);
        if (response.getData() == null) {
            throw new BusinessException("Payment response was empty", HttpStatus.BAD_GATEWAY);
        }
        return response.getData();
    }

    public PaymentResponse paymentFallback(Order order, Throwable throwable) {
        PaymentResponse response = new PaymentResponse();
        response.setOrderId(order.getId());
        response.setUserId(order.getUserId());
        response.setAmount(order.getTotalAmount());
        response.setStatus("FAILED");
        response.setTransactionReference("PAYMENT-FALLBACK");
        return response;
    }

    private void validateCartItem(CartItemRequest itemRequest) {
        if (itemRequest.getQuantity() <= 0) {
            throw new BusinessException("Item quantity must be positive", HttpStatus.BAD_REQUEST);
        }
    }

    private OrderEvent toOrderEvent(Order order) {
        OrderEvent event = new OrderEvent();
        event.setOrderId(order.getId());
        event.setUserId(order.getUserId());
        event.setTotalAmount(order.getTotalAmount());
        event.setStatus(order.getStatus().name());
        event.setItems(order.getItems().stream().map(item -> {
            OrderEvent.OrderEventItem eventItem = new OrderEvent.OrderEventItem();
            eventItem.setProductId(item.getProductId());
            eventItem.setQuantity(item.getQuantity());
            return eventItem;
        }).toList());
        return event;
    }

    private OrderResponse toResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setUserId(order.getUserId());
        response.setStatus(order.getStatus().name());
        response.setShippingAddress(order.getShippingAddress());
        response.setTotalAmount(order.getTotalAmount());
        response.setCreatedAt(order.getCreatedAt());
        response.setItems(order.getItems().stream().map(item -> {
            OrderResponse.OrderItemView view = new OrderResponse.OrderItemView();
            view.setProductId(item.getProductId());
            view.setProductName(item.getProductName());
            view.setQuantity(item.getQuantity());
            view.setPrice(item.getPrice());
            return view;
        }).toList());
        return response;
    }
}
