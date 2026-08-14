package com.ecommerce.common.exception;

import org.springframework.http.HttpStatus;

/**
 * Base exception for expected business rule violations.
 * Carrying the HTTP status here keeps controller code focused on business flow.
 */
public class BusinessException extends RuntimeException {

    private final HttpStatus status;

    public BusinessException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
