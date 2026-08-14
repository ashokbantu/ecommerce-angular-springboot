package com.ecommerce.common.jwt;

import com.ecommerce.common.constants.AppConstants;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

/**
 * Shared JWT helper used by the gateway and downstream services.
 * The class both creates tokens in the auth-service and validates them anywhere
 * else in the system, which makes the security story easy to trace.
 */
@Component
public class JwtUtil {

    private final String secret;
    private final long accessTokenExpirationMs;
    private final long refreshTokenExpirationMs;

    public JwtUtil(@Value("${security.jwt.secret:TXlTdXBlclNlY3JldEtleUZvckVjb21tZXJjZUFwcGxpY2F0aW9uTXVzdEJlTG9uZ0Vub3VnaA==}") String secret,
                   @Value("${security.jwt.access-token-expiration-ms:3600000}") long accessTokenExpirationMs,
                   @Value("${security.jwt.refresh-token-expiration-ms:604800000}") long refreshTokenExpirationMs) {
        this.secret = secret;
        this.accessTokenExpirationMs = accessTokenExpirationMs;
        this.refreshTokenExpirationMs = refreshTokenExpirationMs;
    }

    public String generateAccessToken(String username, Long userId, List<String> roles) {
        return generateToken(username, Map.of(
                AppConstants.CLAIM_USER_ID, userId,
                AppConstants.CLAIM_ROLES, roles
        ), Duration.ofMillis(accessTokenExpirationMs));
    }

    public String generateRefreshToken(String username, Long userId) {
        return generateToken(username, Map.of(AppConstants.CLAIM_USER_ID, userId), Duration.ofMillis(refreshTokenExpirationMs));
    }

    public String generateToken(String subject, Map<String, Object> claims, Duration ttl) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + ttl.toMillis());
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(getSigningKey())
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            extractAllClaims(token);
            return true;
        } catch (Exception ignored) {
            return false;
        }
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Long extractUserId(String token) {
        Object value = extractAllClaims(token).get(AppConstants.CLAIM_USER_ID);
        if (value == null) {
            return null;
        }
        if (value instanceof Number number) {
            return number.longValue();
        }
        return Long.parseLong(String.valueOf(value));
    }

    public List<String> extractRoles(String token) {
        Object value = extractAllClaims(token).get(AppConstants.CLAIM_ROLES);
        if (value instanceof List<?> list) {
            List<String> roles = new ArrayList<>();
            for (Object item : list) {
                roles.add(String.valueOf(item));
            }
            return roles;
        }
        return List.of();
    }

    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        return resolver.apply(extractAllClaims(token));
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }
}
