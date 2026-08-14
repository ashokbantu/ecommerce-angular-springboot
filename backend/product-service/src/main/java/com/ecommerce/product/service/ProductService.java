package com.ecommerce.product.service;

import com.ecommerce.common.dto.PageResponse;
import com.ecommerce.common.exception.ResourceNotFoundException;
import com.ecommerce.product.dto.CategoryDto;
import com.ecommerce.product.dto.ProductRequest;
import com.ecommerce.product.dto.ProductResponse;
import com.ecommerce.product.entity.Category;
import com.ecommerce.product.entity.Product;
import com.ecommerce.product.repository.CategoryRepository;
import com.ecommerce.product.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Catalog business logic lives here so controllers only deal with HTTP concerns.
 */
@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request, String sellerEmail) {
        Category category = getCategory(request.getCategoryId());
        Product product = new Product();
        applyRequest(product, request, category, sellerEmail);
        return toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse updateProduct(Long productId, ProductRequest request, String sellerEmail) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
        Category category = getCategory(request.getCategoryId());
        applyRequest(product, request, category, sellerEmail);
        return toResponse(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
        productRepository.delete(product);
    }

    public ProductResponse getProduct(Long productId) {
        return toResponse(productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId)));
    }

    public PageResponse<ProductResponse> searchProducts(String keyword, Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productPage;
        if (categoryId != null && keyword != null && !keyword.isBlank()) {
            productPage = productRepository.findByCategory_IdAndNameContainingIgnoreCaseAndActiveTrue(categoryId, keyword, pageable);
        } else if (categoryId != null) {
            productPage = productRepository.findByCategory_IdAndActiveTrue(categoryId, pageable);
        } else if (keyword != null && !keyword.isBlank()) {
            productPage = productRepository.findByNameContainingIgnoreCaseAndActiveTrue(keyword, pageable);
        } else {
            productPage = productRepository.findByActiveTrue(pageable);
        }
        return PageResponse.from(productPage.map(this::toResponse));
    }

    @Transactional
    public CategoryDto createCategory(CategoryDto request) {
        Category category = new Category();
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        return toCategoryDto(categoryRepository.save(category));
    }

    public List<CategoryDto> getCategories() {
        return categoryRepository.findAll().stream().map(this::toCategoryDto).toList();
    }

    private Category getCategory(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));
    }

    private void applyRequest(Product product, ProductRequest request, Category category, String sellerEmail) {
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setActive(request.getActive() == null || request.getActive());
        product.setCategory(category);
        product.setSellerEmail(sellerEmail);
    }

    private ProductResponse toResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setStock(product.getStock());
        response.setActive(product.isActive());
        response.setSellerEmail(product.getSellerEmail());
        response.setCategory(toCategoryDto(product.getCategory()));
        response.setCreatedAt(product.getCreatedAt());
        response.setUpdatedAt(product.getUpdatedAt());
        return response;
    }

    private CategoryDto toCategoryDto(Category category) {
        CategoryDto dto = new CategoryDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        return dto;
    }
}
