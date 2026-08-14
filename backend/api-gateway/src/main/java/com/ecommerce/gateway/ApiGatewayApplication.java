package com.ecommerce.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Edge service responsible for cross-cutting concerns such as authentication,
 * routing and request throttling.
 */
@SpringBootApplication(scanBasePackages = "com.ecommerce")
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }
}
