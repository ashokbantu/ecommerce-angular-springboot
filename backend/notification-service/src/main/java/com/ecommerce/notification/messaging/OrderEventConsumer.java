package com.ecommerce.notification.messaging;

import com.ecommerce.common.constants.AppConstants;
import com.ecommerce.notification.service.NotificationService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class OrderEventConsumer {

    private final NotificationService notificationService;

    public OrderEventConsumer(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @RabbitListener(queues = AppConstants.ORDER_CREATED_QUEUE)
    public void consume(Map<String, Object> payload) {
        notificationService.notifyOrder(payload);
    }
}
