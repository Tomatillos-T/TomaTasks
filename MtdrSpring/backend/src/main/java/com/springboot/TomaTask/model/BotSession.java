package com.springboot.TomaTask.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Entity for storing Telegram bot session state in the database.
 * This enables the bot to work correctly in a multi-replica cloud environment.
 */
@Entity
@Table(name = "bot_session")
public class BotSession {

    @Id
    @Column(name = "chat_id", nullable = false, unique = true)
    private Long chatId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    /**
     * Login state: "AWAITING_EMAIL", "AWAITING_OTP", or null (not in login flow).
     * When AWAITING_OTP, the pendingEmail field contains the email being validated.
     */
    @Column(name = "login_state", length = 50)
    private String loginState;

    /**
     * Email address being validated during login flow.
     */
    @Column(name = "pending_email", length = 255)
    private String pendingEmail;

    /**
     * Task creation state: "AWAITING_SPRINT_SELECTION", "AWAITING_TASK_NAME", or null.
     */
    @Column(name = "task_creation_state", length = 50)
    private String taskCreationState;

    /**
     * Selected sprint ID during task creation flow.
     */
    @Column(name = "selected_sprint_id", length = 36)
    private String selectedSprintId;

    /**
     * Pending task name during task creation flow.
     */
    @Column(name = "pending_task_name", length = 255)
    private String pendingTaskName;

    /**
     * Selected task status during task creation flow.
     */
    @Column(name = "selected_status", length = 20)
    private String selectedStatus;

    /**
     * Selected task priority during task creation flow.
     */
    @Column(name = "selected_priority", length = 20)
    private String selectedPriority;

    /**
     * Selected task estimation during task creation flow.
     */
    @Column(name = "selected_estimation", length = 10)
    private String selectedEstimation;

    /**
     * JSON mapping of task index (1, 2, 3...) to task ID for the current todo list view.
     * This allows displaying user-friendly indices instead of UUIDs in the keyboard.
     */
    @Column(name = "task_index_mapping", length = 4000)
    private String taskIndexMapping;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * Session expiry time. Sessions older than this should be considered invalid.
     */
    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    public BotSession() {
    }

    public BotSession(Long chatId) {
        this.chatId = chatId;
    }

    // Getters and Setters

    public Long getChatId() {
        return chatId;
    }

    public void setChatId(Long chatId) {
        this.chatId = chatId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getLoginState() {
        return loginState;
    }

    public void setLoginState(String loginState) {
        this.loginState = loginState;
    }

    public String getPendingEmail() {
        return pendingEmail;
    }

    public void setPendingEmail(String pendingEmail) {
        this.pendingEmail = pendingEmail;
    }

    public String getTaskCreationState() {
        return taskCreationState;
    }

    public void setTaskCreationState(String taskCreationState) {
        this.taskCreationState = taskCreationState;
    }

    public String getSelectedSprintId() {
        return selectedSprintId;
    }

    public void setSelectedSprintId(String selectedSprintId) {
        this.selectedSprintId = selectedSprintId;
    }

    public String getPendingTaskName() {
        return pendingTaskName;
    }

    public void setPendingTaskName(String pendingTaskName) {
        this.pendingTaskName = pendingTaskName;
    }

    public String getSelectedStatus() {
        return selectedStatus;
    }

    public void setSelectedStatus(String selectedStatus) {
        this.selectedStatus = selectedStatus;
    }

    public String getSelectedPriority() {
        return selectedPriority;
    }

    public void setSelectedPriority(String selectedPriority) {
        this.selectedPriority = selectedPriority;
    }

    public String getSelectedEstimation() {
        return selectedEstimation;
    }

    public void setSelectedEstimation(String selectedEstimation) {
        this.selectedEstimation = selectedEstimation;
    }

    public String getTaskIndexMapping() {
        return taskIndexMapping;
    }

    public void setTaskIndexMapping(String taskIndexMapping) {
        this.taskIndexMapping = taskIndexMapping;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    /**
     * Checks if this session is authenticated (has a user).
     */
    public boolean isAuthenticated() {
        return user != null;
    }

    /**
     * Checks if this session has expired.
     */
    public boolean isExpired() {
        return expiresAt != null && LocalDateTime.now().isAfter(expiresAt);
    }

    /**
     * Clears all login-related state.
     */
    public void clearLoginState() {
        this.loginState = null;
        this.pendingEmail = null;
    }

    /**
     * Clears all task creation state.
     */
    public void clearTaskCreationState() {
        this.taskCreationState = null;
        this.selectedSprintId = null;
        this.pendingTaskName = null;
        this.selectedStatus = null;
        this.selectedPriority = null;
        this.selectedEstimation = null;
        // Note: taskIndexMapping is NOT cleared here as it's used for todo list operations
    }

    /**
     * Clears all state (logout).
     */
    public void clearAll() {
        this.user = null;
        this.loginState = null;
        this.pendingEmail = null;
        this.taskCreationState = null;
        this.selectedSprintId = null;
        this.pendingTaskName = null;
        this.selectedStatus = null;
        this.selectedPriority = null;
        this.selectedEstimation = null;
        this.taskIndexMapping = null;
    }
}
