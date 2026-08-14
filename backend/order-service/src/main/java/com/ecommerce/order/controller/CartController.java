package com.ecommerce.order.controller;

import com.ecommerce.common.dto.ApiResponse;
import com.ecommerce.order.dto.CartItemRequest;
import com.ecommerce.order.entity.CartItem;
import com.ecommerce.order.service.CartService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ApiResponse<CartItem> addItem(@Valid @RequestBody CartItemRequest request, Authentication authentication) {
        return ApiResponse.success("Cart item added successfully", cartService.addItem(authentication.getName(), request));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ApiResponse<List<CartItem>> getItems(Authentication authentication) {
        return ApiResponse.success("Cart items fetched successfully", cartService.getItems(authentication.getName()));
    }

    @DeleteMapping("/{cartItemId}")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ApiResponse<Void> removeItem(@PathVariable Long cartItemId, Authentication authentication) {
        cartService.removeItem(authentication.getName(), cartItemId);
        return ApiResponse.success("Cart item removed successfully", null);
    }

    @DeleteMapping
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ApiResponse<Void> clear(Authentication authentication) {
        cartService.clearCart(authentication.getName());
        return ApiResponse.success("Cart cleared successfully", null);
    }
}
