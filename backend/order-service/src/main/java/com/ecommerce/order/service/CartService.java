package com.ecommerce.order.service;

import com.ecommerce.order.dto.CartItemRequest;
import com.ecommerce.order.entity.CartItem;
import com.ecommerce.order.repository.CartItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;

    public CartService(CartItemRepository cartItemRepository) {
        this.cartItemRepository = cartItemRepository;
    }

    @Transactional
    public CartItem addItem(String userId, CartItemRequest request) {
        CartItem cartItem = new CartItem();
        cartItem.setUserId(userId);
        cartItem.setProductId(request.getProductId());
        cartItem.setProductName(request.getProductName());
        cartItem.setQuantity(request.getQuantity());
        cartItem.setPrice(request.getPrice());
        return cartItemRepository.save(cartItem);
    }

    public List<CartItem> getItems(String userId) {
        return cartItemRepository.findByUserId(userId);
    }

    @Transactional
    public void removeItem(String userId, Long cartItemId) {
        cartItemRepository.deleteByUserIdAndId(userId, cartItemId);
    }

    @Transactional
    public void clearCart(String userId) {
        cartItemRepository.deleteByUserId(userId);
    }
}
