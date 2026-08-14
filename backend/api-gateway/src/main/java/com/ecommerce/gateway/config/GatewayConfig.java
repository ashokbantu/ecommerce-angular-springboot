package com.ecommerce.gateway.config;

import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Gateway routes and infrastructure policies live here so learners can see the
 * edge-service concerns in one place.
 */
@Configuration
public class GatewayConfig {

    private final Map<String, RateLimitWindow> requestCounters = new ConcurrentHashMap<>();

    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-service", r -> r.path("/api/auth/**").uri("lb://auth-service"))
                .route("product-service", r -> r.path("/api/products/**").uri("lb://product-service"))
                .route("order-service", r -> r.path("/api/orders/**", "/api/cart/**").uri("lb://order-service"))
                .route("inventory-service", r -> r.path("/api/inventory/**").uri("lb://inventory-service"))
                .route("payment-service", r -> r.path("/api/payments/**").uri("lb://payment-service"))
                .route("notification-service", r -> r.path("/api/notifications/**").uri("lb://notification-service"))
                .build();
    }

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("*"));
        configuration.setAllowedMethods(List.of(
                HttpMethod.GET.name(),
                HttpMethod.POST.name(),
                HttpMethod.PUT.name(),
                HttpMethod.DELETE.name(),
                HttpMethod.OPTIONS.name()
        ));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of(HttpHeaders.AUTHORIZATION));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return new CorsWebFilter(source);
    }

    @Bean
    public GlobalFilter rateLimitingFilter() {
        return (exchange, chain) -> {
            String clientIp = exchange.getRequest().getRemoteAddress() != null
                    ? exchange.getRequest().getRemoteAddress().getAddress().getHostAddress()
                    : "unknown";
            RateLimitWindow window = requestCounters.computeIfAbsent(clientIp, key -> new RateLimitWindow());
            synchronized (window) {
                long now = Instant.now().getEpochSecond();
                if (now - window.windowStart >= 60) {
                    window.windowStart = now;
                    window.counter.set(0);
                }
                if (window.counter.incrementAndGet() > 120) {
                    exchange.getResponse().setStatusCode(org.springframework.http.HttpStatus.TOO_MANY_REQUESTS);
                    return exchange.getResponse().setComplete();
                }
            }
            return chain.filter(exchange);
        };
    }

    private static class RateLimitWindow {
        private long windowStart = Instant.now().getEpochSecond();
        private final AtomicInteger counter = new AtomicInteger();
    }
}
