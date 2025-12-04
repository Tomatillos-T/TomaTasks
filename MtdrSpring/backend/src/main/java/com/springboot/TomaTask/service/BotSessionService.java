package com.springboot.TomaTask.service;

import com.springboot.TomaTask.model.BotSession;
import com.springboot.TomaTask.model.User;
import com.springboot.TomaTask.repository.BotSessionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Service for managing Telegram bot sessions in the database.
 * Provides thread-safe, cloud-compatible session management.
 */
@Service
public class BotSessionService {

    private static final Logger logger = LoggerFactory.getLogger(BotSessionService.class);
    private static final int SESSION_EXPIRY_HOURS = 24;

    private final BotSessionRepository sessionRepository;

    public BotSessionService(BotSessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    /**
     * Gets or creates a session for the given chat ID.
     */
    @Transactional
    public BotSession getOrCreateSession(Long chatId) {
        return sessionRepository.findByChatId(chatId)
                .orElseGet(() -> {
                    BotSession session = new BotSession(chatId);
                    return sessionRepository.save(session);
                });
    }

    /**
     * Gets the session for the given chat ID, if it exists.
     */
    @Transactional(readOnly = true)
    public Optional<BotSession> getSession(Long chatId) {
        return sessionRepository.findByChatId(chatId);
    }

    /**
     * Checks if a chat has an authenticated session.
     */
    @Transactional(readOnly = true)
    public boolean isAuthenticated(Long chatId) {
        Optional<BotSession> session = sessionRepository.findByChatId(chatId);
        return session.map(s -> s.getUser() != null && !s.isExpired()).orElse(false);
    }

    /**
     * Gets the authenticated user for a chat, if any.
     */
    @Transactional(readOnly = true)
    public Optional<User> getAuthenticatedUser(Long chatId) {
        return sessionRepository.findByChatId(chatId)
                .filter(s -> !s.isExpired())
                .map(BotSession::getUser);
    }

    /**
     * Sets the login state for a chat (starting login flow).
     */
    @Transactional
    public void setLoginState(Long chatId, String loginState, String pendingEmail) {
        BotSession session = getOrCreateSession(chatId);
        session.setLoginState(loginState);
        session.setPendingEmail(pendingEmail);
        sessionRepository.save(session);
        logger.debug("Set login state for chat {}: state={}, email={}", chatId, loginState, pendingEmail);
    }

    /**
     * Gets the current login state for a chat.
     */
    @Transactional(readOnly = true)
    public String getLoginState(Long chatId) {
        return sessionRepository.findByChatId(chatId)
                .map(BotSession::getLoginState)
                .orElse(null);
    }

    /**
     * Gets the pending email for a chat (during login flow).
     */
    @Transactional(readOnly = true)
    public String getPendingEmail(Long chatId) {
        return sessionRepository.findByChatId(chatId)
                .map(BotSession::getPendingEmail)
                .orElse(null);
    }

    /**
     * Checks if a chat has a pending login state.
     */
    @Transactional(readOnly = true)
    public boolean hasPendingLogin(Long chatId) {
        return sessionRepository.findByChatId(chatId)
                .map(s -> s.getLoginState() != null)
                .orElse(false);
    }

    /**
     * Completes the login flow and creates an authenticated session.
     */
    @Transactional
    public void createAuthenticatedSession(Long chatId, User user) {
        BotSession session = getOrCreateSession(chatId);
        session.setUser(user);
        session.clearLoginState();
        session.setExpiresAt(LocalDateTime.now().plusHours(SESSION_EXPIRY_HOURS));
        sessionRepository.save(session);
        logger.info("Created authenticated session for chat {} user={}", chatId, user.getEmail());
    }

    /**
     * Clears the login state (on login failure or cancellation).
     */
    @Transactional
    public void clearLoginState(Long chatId) {
        sessionRepository.findByChatId(chatId).ifPresent(session -> {
            session.clearLoginState();
            sessionRepository.save(session);
        });
    }

    /**
     * Logs out a chat (clears all session data).
     */
    @Transactional
    public void logout(Long chatId) {
        sessionRepository.findByChatId(chatId).ifPresent(session -> {
            session.clearAll();
            sessionRepository.save(session);
            logger.info("Logged out chat {}", chatId);
        });
    }

    /**
     * Sets the task creation state for a chat.
     */
    @Transactional
    public void setTaskCreationState(Long chatId, String state) {
        BotSession session = getOrCreateSession(chatId);
        session.setTaskCreationState(state);
        sessionRepository.save(session);
    }

    /**
     * Gets the task creation state for a chat.
     */
    @Transactional(readOnly = true)
    public String getTaskCreationState(Long chatId) {
        return sessionRepository.findByChatId(chatId)
                .map(BotSession::getTaskCreationState)
                .orElse(null);
    }

    /**
     * Sets the pending task name.
     */
    @Transactional
    public void setPendingTaskName(Long chatId, String taskName) {
        BotSession session = getOrCreateSession(chatId);
        session.setPendingTaskName(taskName);
        sessionRepository.save(session);
    }

    /**
     * Gets the pending task name.
     */
    @Transactional(readOnly = true)
    public String getPendingTaskName(Long chatId) {
        return sessionRepository.findByChatId(chatId)
                .map(BotSession::getPendingTaskName)
                .orElse(null);
    }

    /**
     * Sets the selected status.
     */
    @Transactional
    public void setSelectedStatus(Long chatId, String status) {
        BotSession session = getOrCreateSession(chatId);
        session.setSelectedStatus(status);
        sessionRepository.save(session);
    }

    /**
     * Gets the selected status.
     */
    @Transactional(readOnly = true)
    public String getSelectedStatus(Long chatId) {
        return sessionRepository.findByChatId(chatId)
                .map(BotSession::getSelectedStatus)
                .orElse(null);
    }

    /**
     * Sets the selected priority.
     */
    @Transactional
    public void setSelectedPriority(Long chatId, String priority) {
        BotSession session = getOrCreateSession(chatId);
        session.setSelectedPriority(priority);
        sessionRepository.save(session);
    }

    /**
     * Gets the selected priority.
     */
    @Transactional(readOnly = true)
    public String getSelectedPriority(Long chatId) {
        return sessionRepository.findByChatId(chatId)
                .map(BotSession::getSelectedPriority)
                .orElse(null);
    }

    /**
     * Sets the selected estimation.
     */
    @Transactional
    public void setSelectedEstimation(Long chatId, String estimation) {
        BotSession session = getOrCreateSession(chatId);
        session.setSelectedEstimation(estimation);
        sessionRepository.save(session);
    }

    /**
     * Gets the selected estimation.
     */
    @Transactional(readOnly = true)
    public String getSelectedEstimation(Long chatId) {
        return sessionRepository.findByChatId(chatId)
                .map(BotSession::getSelectedEstimation)
                .orElse(null);
    }

    /**
     * Sets the selected sprint ID.
     */
    @Transactional
    public void setSelectedSprintId(Long chatId, String sprintId) {
        BotSession session = getOrCreateSession(chatId);
        session.setSelectedSprintId(sprintId);
        sessionRepository.save(session);
    }

    /**
     * Gets the selected sprint ID for a chat.
     */
    @Transactional(readOnly = true)
    public String getSelectedSprintId(Long chatId) {
        return sessionRepository.findByChatId(chatId)
                .map(BotSession::getSelectedSprintId)
                .orElse(null);
    }

    /**
     * Clears the task creation state for a chat.
     */
    @Transactional
    public void clearTaskCreationState(Long chatId) {
        sessionRepository.findByChatId(chatId).ifPresent(session -> {
            session.clearTaskCreationState();
            sessionRepository.save(session);
        });
    }

    /**
     * Sets the task index mapping for a chat.
     * The mapping is a JSON string like: {"1":"uuid1","2":"uuid2",...}
     */
    @Transactional
    public void setTaskIndexMapping(Long chatId, String mapping) {
        BotSession session = getOrCreateSession(chatId);
        session.setTaskIndexMapping(mapping);
        sessionRepository.save(session);
    }

    /**
     * Gets the task index mapping for a chat.
     */
    @Transactional(readOnly = true)
    public String getTaskIndexMapping(Long chatId) {
        return sessionRepository.findByChatId(chatId)
                .map(BotSession::getTaskIndexMapping)
                .orElse(null);
    }

    /**
     * Scheduled task to clean up expired sessions.
     * Runs every hour.
     */
    @Scheduled(fixedRate = 3600000) // Every hour
    @Transactional
    public void cleanupExpiredSessions() {
        int deleted = sessionRepository.deleteExpiredSessions(LocalDateTime.now());
        if (deleted > 0) {
            logger.info("Cleaned up {} expired bot sessions", deleted);
        }
    }
}
