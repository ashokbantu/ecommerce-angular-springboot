package com.ecommerce.notification.messaging;

import com.ecommerce.common.constants.AppConstants;
import com.ecommerce.notification.service.NotificationService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class PaymentEventConsumer {

    private final NotificationService notificationService;

    public PaymentEventConsumer(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @RabbitListener(queues = AppConstants.PAYMENT_STATUS_QUEUE)
    public void consume(Map<String, Object> payload) {
        notificationService.notifyPayment(payload);
    }
}
