package com.ecommerce.gateway.filter;

import com.ecommerce.common.constants.AppConstants;
import com.ecommerce.common.jwt.JwtUtil;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * Gateway-level JWT verification ensures unauthenticated requests are rejected
 * before they ever touch a downstream service.
 */
@Component
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {

    private static final List<String> PUBLIC_PATHS = List.of(
            "/api/auth/register",
            "/api/auth/login",
            "/api/auth/refresh",
            "/v3/api-docs",
            "/swagger-ui",
            "/actuator"
    );

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getPath().value();
        if (isPublicPath(path)) {
            return chain.filter(exchange);
        }

        String header = exchange.getRequest().getHeaders().getFirst(AppConstants.AUTH_HEADER);
        if (header == null || !header.startsWith(AppConstants.TOKEN_PREFIX)) {
            return writeUnauthorized(exchange.getResponse(), "Missing bearer token");
        }

        String token = header.substring(AppConstants.TOKEN_PREFIX.length());
        if (!jwtUtil.validateToken(token)) {
            return writeUnauthorized(exchange.getResponse(), "Invalid or expired JWT token");
        }

        ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                .header(AppConstants.HEADER_AUTHENTICATED_USER, jwtUtil.extractUsername(token))
                .header(AppConstants.HEADER_AUTHENTICATED_USER_ID, String.valueOf(jwtUtil.extractUserId(token)))
                .header(AppConstants.HEADER_AUTHENTICATED_ROLES, String.join(",", jwtUtil.extractRoles(token)))
                .build();
        return chain.filter(exchange.mutate().request(mutatedRequest).build());
    }

    @Override
    public int getOrder() {
        return -100;
    }

    private boolean isPublicPath(String path) {
        return PUBLIC_PATHS.stream().anyMatch(path::startsWith);
    }

    private Mono<Void> writeUnauthorized(ServerHttpResponse response, String message) {
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
        byte[] bytes = ("{\"success\":false,\"message\":\"" + message + "\"}")
                .getBytes(StandardCharsets.UTF_8);
        return response.writeWith(Mono.just(response.bufferFactory().wrap(bytes)));
    }
}
