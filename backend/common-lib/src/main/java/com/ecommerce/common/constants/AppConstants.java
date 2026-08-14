package com.ecommerce.common.constants;

/**
 * Central place for string constants used across services.
 * Keeping them in one shared library reduces accidental typos and makes
 * infrastructure conventions easy to understand for learners.
 */
public final class AppConstants {

    public static final String AUTH_HEADER = "Authorization";
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String CLAIM_ROLES = "roles";
    public static final String CLAIM_USER_ID = "userId";
    public static final String HEADER_AUTHENTICATED_USER = "X-Authenticated-Username";
    public static final String HEADER_AUTHENTICATED_USER_ID = "X-Authenticated-UserId";
    public static final String HEADER_AUTHENTICATED_ROLES = "X-Authenticated-Roles";

    public static final String RABBIT_EXCHANGE = "ecommerce.exchange";
    public static final String ORDER_CREATED_QUEUE = "order.created.queue";
    public static final String ORDER_CREATED_ROUTING_KEY = "order.created";
    public static final String PAYMENT_STATUS_QUEUE = "payment.status.queue";
    public static final String PAYMENT_STATUS_ROUTING_KEY = "payment.status";

    private AppConstants() {
    }
}
