package com.springboot.TomaTask.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;

import java.io.IOException;

/**
 * Configuration class to add security headers to HTTP responses.
 * Addresses OWASP ZAP findings including:
 * - Content Security Policy (CSP) header
 * - X-Content-Type-Options
 * - X-Frame-Options
 * - X-XSS-Protection
 * - Referrer-Policy
 */
@Configuration
@Order(Ordered.HIGHEST_PRECEDENCE)
public class SecurityHeadersConfig implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletResponse httpResponse = (HttpServletResponse) response;

        // Content Security Policy - prevents XSS and data injection attacks
        // Adjusted for React app with inline scripts and external resources
        httpResponse.setHeader("Content-Security-Policy",
                "default-src 'self'; " +
                "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                "font-src 'self' https://fonts.gstatic.com data:; " +
                "img-src 'self' data: https:; " +
                "connect-src 'self' https://api.github.com; " +
                "frame-ancestors 'none'; " +
                "base-uri 'self'; " +
                "form-action 'self'");

        // Prevent MIME type sniffing
        httpResponse.setHeader("X-Content-Type-Options", "nosniff");

        // Prevent clickjacking attacks
        httpResponse.setHeader("X-Frame-Options", "DENY");

        // Enable XSS protection in older browsers
        httpResponse.setHeader("X-XSS-Protection", "1; mode=block");

        // Control referrer information
        httpResponse.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

        // Enforce HTTPS (uncomment when deploying to production with HTTPS)
        // httpResponse.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");

        chain.doFilter(request, response);
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // Initialization logic if needed
    }

    @Override
    public void destroy() {
        // Cleanup logic if needed
    }
}
