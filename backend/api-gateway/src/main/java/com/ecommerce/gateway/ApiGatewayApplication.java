package com.ecommerce.gateway;

import com.ecommerce.common.exception.GlobalExceptionHandler;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;

/**
 * Edge service responsible for cross-cutting concerns such as authentication,
 * routing and request throttling.
 *
 * NOTE: api-gateway runs on WebFlux (spring.main.web-application-type=reactive).
 * common-lib's GlobalExceptionHandler is a servlet/MVC-style @RestControllerAdvice
 * (uses HttpServletRequest) and cannot be instantiated in a reactive-only
 * context. It is excluded here; the gateway uses its own reactive
 * GlobalErrorHandler (implements ErrorWebExceptionHandler) instead.
 */
@SpringBootApplication
@ComponentScan(basePackages = "com.ecommerce",
        excludeFilters = @ComponentScan.Filter(
                type = FilterType.ASSIGNABLE_TYPE,
                classes = GlobalExceptionHandler.class))
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }
}
