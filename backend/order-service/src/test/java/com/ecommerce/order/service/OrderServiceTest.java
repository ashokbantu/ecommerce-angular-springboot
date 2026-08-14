package com.ecommerce.order.service;

import com.ecommerce.common.dto.ApiResponse;
import com.ecommerce.order.client.InventoryClient;
import com.ecommerce.order.client.PaymentClient;
import com.ecommerce.order.dto.CartItemRequest;
import com.ecommerce.order.dto.InventoryResponse;
import com.ecommerce.order.dto.OrderRequest;
import com.ecommerce.order.dto.OrderResponse;
import com.ecommerce.order.dto.PaymentResponse;
import com.ecommerce.order.entity.Order;
import com.ecommerce.order.messaging.OrderEventPublisher;
import com.ecommerce.order.repository.OrderRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;
    @Mock
    private InventoryClient inventoryClient;
    @Mock
    private PaymentClient paymentClient;
    @Mock
    private OrderEventPublisher orderEventPublisher;

    @InjectMocks
    private OrderService orderService;

    @Test
    void shouldCreatePaidOrder() {
        OrderRequest request = new OrderRequest();
        request.setShippingAddress("123 Main Street");
        CartItemRequest item = new CartItemRequest();
        item.setProductId(10L);
        item.setProductName("Keyboard");
        item.setQuantity(2);
        item.setPrice(BigDecimal.valueOf(50));
        request.setItems(java.util.List.of(item));

        InventoryResponse inventoryResponse = new InventoryResponse();
        inventoryResponse.setProductId(10L);
        inventoryResponse.setAvailableQuantity(10);
        when(inventoryClient.getInventory(10L)).thenReturn(ApiResponse.success(inventoryResponse));

        PaymentResponse paymentResponse = new PaymentResponse();
        paymentResponse.setStatus("SUCCESS");
        when(paymentClient.processPayment(any())).thenReturn(ApiResponse.success(paymentResponse));

        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order order = invocation.getArgument(0);
            if (order.getId() == null) {
                order.setId(1L);
            }
            return order;
        });

        OrderResponse response = orderService.createOrder("customer@example.com", request);

        verify(orderEventPublisher).publishOrderCreated(any());
        assertEquals("PAID", response.getStatus());
        assertEquals(BigDecimal.valueOf(100), response.getTotalAmount());
    }
}
