package com.ecommerce.product.repository;

import com.ecommerce.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByActiveTrue(Pageable pageable);
    Page<Product> findByNameContainingIgnoreCaseAndActiveTrue(String keyword, Pageable pageable);
    Page<Product> findByCategory_IdAndActiveTrue(Long categoryId, Pageable pageable);
    Page<Product> findByCategory_IdAndNameContainingIgnoreCaseAndActiveTrue(Long categoryId, String keyword, Pageable pageable);
}
