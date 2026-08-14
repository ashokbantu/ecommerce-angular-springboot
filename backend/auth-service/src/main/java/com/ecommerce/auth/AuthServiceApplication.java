package com.ecommerce.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Identity service that handles user registration, login, token refresh and the
 * current-user endpoint used by the frontend.
 */
@SpringBootApplication(scanBasePackages = "com.ecommerce")
public class AuthServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApplication.class, args);
    }
}
