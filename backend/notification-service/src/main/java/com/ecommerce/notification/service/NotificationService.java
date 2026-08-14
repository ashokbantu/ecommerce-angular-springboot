package com.ecommerce.notification.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Real projects would email or text the customer; for this learning project we
 * log the outgoing notification to keep the infrastructure simple.
 */
@Service
public class NotificationService {

    private static final Logger LOGGER = LoggerFactory.getLogger(NotificationService.class);

    public void notifyOrder(Map<String, Object> payload) {
        LOGGER.info("Order notification dispatched: {}", payload);
    }

    public void notifyPayment(Map<String, Object> payload) {
        LOGGER.info("Payment notification dispatched: {}", payload);
    }
}
