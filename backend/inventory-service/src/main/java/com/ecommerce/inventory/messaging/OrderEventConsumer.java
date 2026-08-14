package com.ecommerce.inventory.messaging;

import com.ecommerce.common.constants.AppConstants;
import com.ecommerce.inventory.service.InventoryService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * Inventory reacts to order-created events asynchronously to keep the order API
 * responsive and loosely coupled.
 */
@Component
public class OrderEventConsumer {

    private final InventoryService inventoryService;

    public OrderEventConsumer(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @RabbitListener(queues = AppConstants.ORDER_CREATED_QUEUE)
    @SuppressWarnings("unchecked")
    public void consume(Map<String, Object> payload) {
        Object itemsObject = payload.get("items");
        if (itemsObject instanceof List<?> items) {
            for (Object itemObject : items) {
                Map<String, Object> item = (Map<String, Object>) itemObject;
                Long productId = Long.valueOf(String.valueOf(item.get("productId")));
                Integer quantity = Integer.valueOf(String.valueOf(item.get("quantity")));
                inventoryService.decrementStock(productId, quantity);
            }
        }
    }
}
