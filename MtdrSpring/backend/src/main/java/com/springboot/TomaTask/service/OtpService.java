package com.springboot.TomaTask.service;

import com.springboot.TomaTask.model.BotOtp;
import com.springboot.TomaTask.repository.BotOtpRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Service for generating and validating One-Time Passwords (OTP).
 * OTPs are stored in the database to support multi-replica cloud deployments.
 */
@Service
public class OtpService {

    private static final Logger logger = LoggerFactory.getLogger(OtpService.class);
    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 5;

    private final BotOtpRepository otpRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    public OtpService(BotOtpRepository otpRepository) {
        this.otpRepository = otpRepository;
    }

    /**
     * Generates a new OTP for the given email.
     * If an OTP already exists for this email, it will be replaced.
     *
     * @param email the user's email address
     * @return the generated OTP code
     */
    @Transactional
    public String createOtp(String email) {
        String normalizedEmail = email.toLowerCase();
        String otp = generateOtp();
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES);

        // Delete any existing OTP for this email
        otpRepository.deleteByEmailIgnoreCase(normalizedEmail);

        // Create new OTP
        BotOtp botOtp = new BotOtp(normalizedEmail, otp, expiresAt);
        otpRepository.save(botOtp);

        logger.info("Generated OTP for email: {} (expires at: {})", email, expiresAt);
        return otp;
    }

    /**
     * Validates the OTP for the given email.
     * A valid OTP is consumed (one-time use).
     *
     * @param email the user's email address
     * @param otp   the OTP code to validate
     * @return true if valid, false otherwise
     */
    @Transactional
    public boolean validateOtp(String email, String otp) {
        if (email == null || otp == null) {
            return false;
        }

        String normalizedEmail = email.toLowerCase();
        Optional<BotOtp> botOtpOpt = otpRepository.findByEmailIgnoreCase(normalizedEmail);

        if (botOtpOpt.isEmpty()) {
            logger.warn("No OTP found for email: {}", email);
            return false;
        }

        BotOtp botOtp = botOtpOpt.get();

        if (botOtp.isExpired()) {
            logger.warn("OTP expired for email: {}", email);
            otpRepository.delete(botOtp);
            return false;
        }

        if (!botOtp.validateOtp(otp)) {
            logger.warn("Invalid OTP attempt for email: {}", email);
            return false;
        }

        // OTP is valid - consume it
        otpRepository.delete(botOtp);
        logger.info("OTP validated successfully for email: {}", email);
        return true;
    }

    /**
     * Gets the current valid OTP for the given email, if one exists.
     *
     * @param email the user's email address
     * @return Optional containing OTP info if a valid OTP exists
     */
    @Transactional(readOnly = true)
    public Optional<BotOtp> getValidOtp(String email) {
        if (email == null) {
            return Optional.empty();
        }

        String normalizedEmail = email.toLowerCase();
        Optional<BotOtp> botOtpOpt = otpRepository.findByEmailIgnoreCase(normalizedEmail);

        if (botOtpOpt.isEmpty()) {
            return Optional.empty();
        }

        BotOtp botOtp = botOtpOpt.get();
        if (botOtp.isExpired()) {
            return Optional.empty();
        }

        return Optional.of(botOtp);
    }

    /**
     * Clears the OTP for a given email.
     *
     * @param email the user's email address
     */
    @Transactional
    public void clearOtp(String email) {
        if (email != null) {
            otpRepository.deleteByEmailIgnoreCase(email.toLowerCase());
        }
    }

    /**
     * Scheduled task to clean up expired OTPs.
     * Runs every 10 minutes.
     */
    @Scheduled(fixedRate = 600000) // Every 10 minutes
    @Transactional
    public void cleanupExpiredOtps() {
        int deleted = otpRepository.deleteExpiredOtps(LocalDateTime.now());
        if (deleted > 0) {
            logger.info("Cleaned up {} expired OTPs", deleted);
        }
    }

    private String generateOtp() {
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(secureRandom.nextInt(10));
        }
        return otp.toString();
    }
}
