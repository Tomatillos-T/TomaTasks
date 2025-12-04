package com.springboot.TomaTask.controller;

import com.springboot.TomaTask.model.BotOtp;
import com.springboot.TomaTask.service.OtpService;
import com.springboot.TomaTask.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Map;
import java.util.Optional;

/**
 * REST controller for Telegram Bot OTP operations.
 * Allows the web application to generate OTP codes for users to authenticate
 * with the Telegram bot.
 */
@RestController
@RequestMapping("/api/bot/otp")
public class BotOtpController {

    private final OtpService otpService;
    private final UserService userService;

    public BotOtpController(OtpService otpService, UserService userService) {
        this.otpService = otpService;
        this.userService = userService;
    }

    /**
     * Generates an OTP for the given email address.
     * The user can then enter this OTP in the Telegram bot to authenticate.
     *
     * @param email the user's email address
     * @return the generated OTP code
     */
    @PostMapping("/generate")
    public ResponseEntity<?> generateOtp(@RequestParam String email) {
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }

        if (!userService.emailExists(email)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Email not registered in the system"));
        }

        String otp = otpService.createOtp(email);
        return ResponseEntity.ok(Map.of(
                "otp", otp,
                "message", "Enter this code in the Telegram bot to complete login",
                "expiresInMinutes", 5
        ));
    }

    /**
     * Gets the current valid OTP for the given email address, if one exists.
     *
     * @param email the user's email address
     * @return the OTP info if a valid OTP exists
     */
    @GetMapping("/current")
    public ResponseEntity<?> getCurrentOtp(@RequestParam String email) {
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }

        Optional<BotOtp> otpOpt = otpService.getValidOtp(email);
        if (otpOpt.isEmpty()) {
            return ResponseEntity.ok(Map.of("hasOtp", false));
        }

        BotOtp botOtp = otpOpt.get();
        return ResponseEntity.ok(Map.of(
                "hasOtp", true,
                "otp", botOtp.getOtpCode(),
                "expiresAt", botOtp.getExpiresAt().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()
        ));
    }

    /**
     * Validates an OTP for the given email address.
     * This endpoint can be used by the bot webhook if needed.
     *
     * @param email the user's email address
     * @param otp   the OTP code to validate
     * @return success or failure response
     */
    @PostMapping("/validate")
    public ResponseEntity<?> validateOtp(@RequestParam String email, @RequestParam String otp) {
        if (email == null || email.isBlank() || otp == null || otp.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and OTP are required"));
        }

        boolean valid = otpService.validateOtp(email, otp);
        if (valid) {
            return ResponseEntity.ok(Map.of("valid", true, "message", "OTP validated successfully"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("valid", false, "error", "Invalid or expired OTP"));
        }
    }
}
