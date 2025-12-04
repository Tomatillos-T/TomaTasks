package com.springboot.TomaTask.repository;

import com.springboot.TomaTask.model.BotSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface BotSessionRepository extends JpaRepository<BotSession, Long> {

    /**
     * Find session by chat ID.
     */
    Optional<BotSession> findByChatId(Long chatId);

    /**
     * Delete expired sessions.
     */
    @Modifying
    @Query("DELETE FROM BotSession s WHERE s.expiresAt IS NOT NULL AND s.expiresAt < :now")
    int deleteExpiredSessions(@Param("now") LocalDateTime now);

    /**
     * Check if a session exists and is authenticated.
     */
    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END FROM BotSession s WHERE s.chatId = :chatId AND s.user IS NOT NULL")
    boolean isAuthenticated(@Param("chatId") Long chatId);
}
