package com.ecommerce.order.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Event published after order creation so inventory and notification services
 * can react asynchronously.
 */
public class OrderEvent {

    private Long orderId;
    private String userId;
    private BigDecimal totalAmount;
    private String status;
    private List<OrderEventItem> items = new ArrayList<>();

    public static class OrderEventItem {
        private Long productId;
        private Integer quantity;

        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<OrderEventItem> getItems() {
        return items;
    }

    public void setItems(List<OrderEventItem> items) {
        this.items = items;
    }
}
