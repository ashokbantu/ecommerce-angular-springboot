package com.ecommerce.order.messaging;

import com.ecommerce.common.constants.AppConstants;
import com.ecommerce.order.dto.OrderEvent;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

/**
 * Dedicated publisher keeps the messaging concern separate from the business
 * workflow, which is useful once events become more complex.
 */
@Component
public class OrderEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public OrderEventPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publishOrderCreated(OrderEvent event) {
        rabbitTemplate.convertAndSend(AppConstants.RABBIT_EXCHANGE, AppConstants.ORDER_CREATED_ROUTING_KEY, event);
    }
}
