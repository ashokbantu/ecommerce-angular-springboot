package com.ecommerce.payment.messaging;

import com.ecommerce.common.constants.AppConstants;
import com.ecommerce.payment.dto.PaymentEvent;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
public class PaymentEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public PaymentEventPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publish(PaymentEvent event) {
        rabbitTemplate.convertAndSend(AppConstants.RABBIT_EXCHANGE, AppConstants.PAYMENT_STATUS_ROUTING_KEY, event);
    }
}
