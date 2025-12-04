package com.springboot.TomaTask.repository;

import com.springboot.TomaTask.model.BotOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface BotOtpRepository extends JpaRepository<BotOtp, String> {

    /**
     * Find OTP by email (case-insensitive).
     */
    @Query("SELECT o FROM BotOtp o WHERE LOWER(o.email) = LOWER(:email)")
    Optional<BotOtp> findByEmailIgnoreCase(@Param("email") String email);

    /**
     * Delete OTP by email (case-insensitive).
     */
    @Modifying
    @Query("DELETE FROM BotOtp o WHERE LOWER(o.email) = LOWER(:email)")
    void deleteByEmailIgnoreCase(@Param("email") String email);

    /**
     * Delete expired OTPs.
     */
    @Modifying
    @Query("DELETE FROM BotOtp o WHERE o.expiresAt < :now")
    int deleteExpiredOtps(@Param("now") LocalDateTime now);
}
