package com.ecommerce.payment.service;

import com.ecommerce.common.exception.ResourceNotFoundException;
import com.ecommerce.payment.dto.PaymentEvent;
import com.ecommerce.payment.dto.PaymentRequest;
import com.ecommerce.payment.dto.PaymentResponse;
import com.ecommerce.payment.entity.Payment;
import com.ecommerce.payment.messaging.PaymentEventPublisher;
import com.ecommerce.payment.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;
import java.util.UUID;

/**
 * Payment processing is mocked to keep the project infrastructure light while
 * still demonstrating state transitions and event publication.
 */
@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentEventPublisher paymentEventPublisher;
    private final Random random = new Random();

    public PaymentService(PaymentRepository paymentRepository, PaymentEventPublisher paymentEventPublisher) {
        this.paymentRepository = paymentRepository;
        this.paymentEventPublisher = paymentEventPublisher;
    }

    @Transactional
    public PaymentResponse processPayment(PaymentRequest request) {
        Payment payment = new Payment();
        payment.setOrderId(request.getOrderId());
        payment.setUserId(request.getUserId());
        payment.setAmount(request.getAmount());
        payment.setStatus(Payment.PaymentStatus.PENDING);
        payment.setTransactionReference("TXN-" + UUID.randomUUID());

        boolean success = random.nextInt(10) < 8;
        payment.setStatus(success ? Payment.PaymentStatus.SUCCESS : Payment.PaymentStatus.FAILED);
        Payment saved = paymentRepository.save(payment);
        PaymentResponse response = toResponse(saved);
        paymentEventPublisher.publish(toEvent(response));
        return response;
    }

    public PaymentResponse getByOrderId(Long orderId) {
        return paymentRepository.findByOrderId(orderId)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order id: " + orderId));
    }

    private PaymentResponse toResponse(Payment payment) {
        PaymentResponse response = new PaymentResponse();
        response.setOrderId(payment.getOrderId());
        response.setUserId(payment.getUserId());
        response.setAmount(payment.getAmount());
        response.setStatus(payment.getStatus().name());
        response.setTransactionReference(payment.getTransactionReference());
        return response;
    }

    private PaymentEvent toEvent(PaymentResponse response) {
        PaymentEvent event = new PaymentEvent();
        event.setOrderId(response.getOrderId());
        event.setUserId(response.getUserId());
        event.setAmount(response.getAmount());
        event.setStatus(response.getStatus());
        event.setTransactionReference(response.getTransactionReference());
        return event;
    }
}
