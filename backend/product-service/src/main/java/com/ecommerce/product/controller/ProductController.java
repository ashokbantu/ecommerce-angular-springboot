package com.ecommerce.product.controller;

import com.ecommerce.common.dto.ApiResponse;
import com.ecommerce.common.dto.PageResponse;
import com.ecommerce.product.dto.CategoryDto;
import com.ecommerce.product.dto.ProductRequest;
import com.ecommerce.product.dto.ProductResponse;
import com.ecommerce.product.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Product endpoints expose CRUD plus lightweight filtering and pagination.
 */
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
    public ApiResponse<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request, Authentication authentication) {
        return ApiResponse.success("Product created successfully", productService.createProduct(request, authentication.getName()));
    }

    @PutMapping("/{productId}")
    @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
    public ApiResponse<ProductResponse> updateProduct(@PathVariable Long productId,
                                                      @Valid @RequestBody ProductRequest request,
                                                      Authentication authentication) {
        return ApiResponse.success("Product updated successfully", productService.updateProduct(productId, request, authentication.getName()));
    }

    @DeleteMapping("/{productId}")
    @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
    public ApiResponse<Void> deleteProduct(@PathVariable Long productId) {
        productService.deleteProduct(productId);
        return ApiResponse.success("Product deleted successfully", null);
    }

    @GetMapping("/{productId}")
    @PreAuthorize("permitAll()")
    public ApiResponse<ProductResponse> getProduct(@PathVariable Long productId) {
        return ApiResponse.success("Product fetched successfully", productService.getProduct(productId));
    }

    @GetMapping
    @PreAuthorize("permitAll()")
    public ApiResponse<PageResponse<ProductResponse>> searchProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.success("Products fetched successfully", productService.searchProducts(keyword, categoryId, page, size));
    }

    @PostMapping("/categories")
    @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
    public ApiResponse<CategoryDto> createCategory(@Valid @RequestBody CategoryDto request) {
        return ApiResponse.success("Category created successfully", productService.createCategory(request));
    }

    @GetMapping("/categories")
    @PreAuthorize("permitAll()")
    public ApiResponse<java.util.List<CategoryDto>> listCategories() {
        return ApiResponse.success("Categories fetched successfully", productService.getCategories());
    }
}
