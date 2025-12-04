package com.springboot.TomaTask.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Entity for storing OTP codes in the database.
 * This enables OTP validation to work correctly in a multi-replica cloud environment.
 */
@Entity
@Table(name = "bot_otp")
public class BotOtp {

    @Id
    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "otp_code", nullable = false, length = 10)
    private String otpCode;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    public BotOtp() {
    }

    public BotOtp(String email, String otpCode, LocalDateTime expiresAt) {
        this.email = email.toLowerCase();
        this.otpCode = otpCode;
        this.expiresAt = expiresAt;
    }

    // Getters and Setters

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email != null ? email.toLowerCase() : null;
    }

    public String getOtpCode() {
        return otpCode;
    }

    public void setOtpCode(String otpCode) {
        this.otpCode = otpCode;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    /**
     * Checks if this OTP has expired.
     */
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }

    /**
     * Validates the provided OTP code against this entry.
     */
    public boolean validateOtp(String otp) {
        if (otp == null || isExpired()) {
            return false;
        }
        return otpCode.equals(otp.trim());
    }
}
