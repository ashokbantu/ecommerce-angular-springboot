package com.ecommerce.order.repository;

import com.ecommerce.order.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserId(String userId);
    void deleteByUserIdAndId(String userId, Long id);
    void deleteByUserId(String userId);
}
