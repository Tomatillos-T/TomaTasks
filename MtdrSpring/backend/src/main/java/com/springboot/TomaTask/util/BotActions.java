package com.springboot.TomaTask.util;

import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardRow;
import org.telegram.telegrambots.meta.generics.TelegramClient;

import com.springboot.TomaTask.dto.TaskDTO;
import com.springboot.TomaTask.dto.SprintDTO;
import com.springboot.TomaTask.service.TaskService;
import com.springboot.TomaTask.service.UserService;
import com.springboot.TomaTask.service.SprintService;
import com.springboot.TomaTask.service.OtpService;
import com.springboot.TomaTask.service.BotSessionService;
import com.springboot.TomaTask.model.User;
import com.springboot.TomaTask.model.Task.Status;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Handles Telegram bot actions with database-backed session management.
 * All state is stored in the database via BotSessionService for cloud compatibility.
 */
public class BotActions {

    private static final Logger logger = LoggerFactory.getLogger(BotActions.class);

    public static final String LOGIN_STATE_AWAITING_EMAIL = "AWAITING_EMAIL";
    public static final String LOGIN_STATE_AWAITING_OTP = "AWAITING_OTP";
    public static final String TASK_STATE_AWAITING_SPRINT = "AWAITING_SPRINT_SELECTION";
    public static final String TASK_STATE_AWAITING_NAME = "AWAITING_TASK_NAME";

    private String requestText;
    private long chatId;
    private final TelegramClient telegramClient;
    private final TaskService taskService;
    private final UserService userService;
    private final SprintService sprintService;
    private final OtpService otpService;
    private final BotSessionService sessionService;

    public BotActions(TelegramClient tc, TaskService ts, UserService us, SprintService ss,
                      OtpService os, BotSessionService bss) {
        this.telegramClient = tc;
        this.taskService = ts;
        this.userService = us;
        this.sprintService = ss;
        this.otpService = os;
        this.sessionService = bss;
    }

    public void setRequestText(String cmd) {
        this.requestText = cmd;
    }

    public void setChatId(long chId) {
        this.chatId = chId;
    }

    /**
     * Handles the login flow including email entry and OTP validation.
     */
    public void fnLogin() {
        // Check if already logged in and trying to login again
        if ((requestText.equals(BotCommands.LOGIN_COMMAND.getCommand())
                || requestText.equals(BotLabels.LOGIN.getLabel())) && sessionService.isAuthenticated(chatId)) {
            BotHelper.sendMessageToTelegram(chatId, BotMessages.ALREADY_LOGGED_IN.getMessage(), telegramClient, null);
            return;
        }

        String loginState = sessionService.getLoginState(chatId);
        String pendingEmail = sessionService.getPendingEmail(chatId);
        logger.info("fnLogin called for chatId={} requestText='{}' loginState='{}' pendingEmail='{}'",
                chatId, requestText, loginState, pendingEmail);

        // Handle pending login states
        if (loginState != null) {
            if (LOGIN_STATE_AWAITING_EMAIL.equals(loginState)) {
                // User is entering their email
                String email = requestText.trim();
                if (!email.contains("@") || !email.contains(".")) {
                    BotHelper.sendMessageToTelegram(chatId, BotMessages.INVALID_EMAIL.getMessage(), telegramClient, null);
                    return;
                } else if (!userService.emailExists(email)) {
                    BotHelper.sendMessageToTelegram(chatId, BotMessages.EMAIL_NOT_FOUND.getMessage(), telegramClient, null);
                    return;
                }

                // Email is valid - transition to awaiting OTP
                sessionService.setLoginState(chatId, LOGIN_STATE_AWAITING_OTP, email);
                logger.info("Email validated for {}, awaiting OTP from web application", email);
                BotHelper.sendMessageToTelegram(chatId, BotMessages.OTP_PROMPT.getMessage(), telegramClient, null);
                return;
            }

            if (LOGIN_STATE_AWAITING_OTP.equals(loginState) && pendingEmail != null) {
                // User is entering OTP
                String otp = requestText.trim();

                if (otpService.validateOtp(pendingEmail, otp)) {
                    User user = userService.findByEmail(pendingEmail);
                    if (user == null) {
                        BotHelper.sendMessageToTelegram(chatId, BotMessages.LOGIN_ERROR.getMessage(), telegramClient, null);
                        sessionService.clearLoginState(chatId);
                        return;
                    }
                    sessionService.createAuthenticatedSession(chatId, user);
                    logger.info("Created session for chat {} user={}", chatId, user.getEmail());
                    BotHelper.sendMessageToTelegram(chatId, BotMessages.LOGIN_SUCCESS.getMessage(), telegramClient, null);
                } else {
                    BotHelper.sendMessageToTelegram(chatId, BotMessages.INVALID_OTP.getMessage(), telegramClient, null);
                }
                return;
            }
        }

        // No pending state - this is a fresh login request or redirect
        // Handle explicit /login command
        if (requestText.equals(BotCommands.LOGIN_COMMAND.getCommand())
                || requestText.equals(BotLabels.LOGIN.getLabel())) {
            sessionService.setLoginState(chatId, LOGIN_STATE_AWAITING_EMAIL, null);
            BotHelper.sendMessageToTelegram(chatId, BotMessages.LOGIN_PROMPT.getMessage(), telegramClient, null);
            return;
        }

        // Redirect from other commands when not logged in
        BotHelper.sendMessageToTelegram(chatId, BotMessages.LOGIN_MISSING.getMessage(), telegramClient, null);
        sessionService.setLoginState(chatId, LOGIN_STATE_AWAITING_EMAIL, null);
    }

    public void fnLogout() {
        if (!(requestText.equals(BotCommands.LOGOUT_COMMAND.getCommand())
                || requestText.equals(BotLabels.LOGOUT.getLabel())))
            return;

        if (!sessionService.isAuthenticated(chatId)) {
            BotHelper.sendMessageToTelegram(chatId, BotMessages.NOT_LOGGED_IN.getMessage(), telegramClient, null);
            return;
        }

        sessionService.logout(chatId);
        BotHelper.sendMessageToTelegram(chatId, BotMessages.LOGOUT_SUCCESS.getMessage(), telegramClient, null);
    }

    public void fnStart() {
        if (!(requestText.equals(BotCommands.START_COMMAND.getCommand())
                || requestText.equals(BotLabels.INTRODUCTION.getLabel())))
            return;

        // Clear any pending task creation state
        sessionService.clearTaskCreationState(chatId);

        BotHelper.sendMessageToTelegram(chatId, BotMessages.HELLO_MYTODO_BOT.getMessage(), telegramClient,
                ReplyKeyboardMarkup
                        .builder()
                        .keyboardRow(
                                new KeyboardRow(BotLabels.LIST_ALL_ITEMS.getLabel(),
                                        BotLabels.ADD_NEW_ITEM.getLabel()))
                        .keyboardRow(new KeyboardRow(BotLabels.INTRODUCTION.getLabel(),
                                BotLabels.HIDE_MAIN_SCREEN.getLabel()))
                        .build());
    }

    public void fnDone() {
        if (requestText.indexOf(BotLabels.DONE.getLabel()) == -1)
            return;

        String taskId = requestText.substring(0, requestText.lastIndexOf(BotLabels.DASH.getLabel()));
        try {
            TaskDTO taskDto = taskService.getTaskById(taskId);
            taskDto.setStatus(Status.DONE);
            taskService.updateTask(taskId, taskDto);
            BotHelper.sendMessageToTelegram(chatId, BotMessages.ITEM_DONE.getMessage(), telegramClient);
        } catch (RuntimeException e) {
            logger.error("Task not found: {}", taskId, e);
            BotHelper.sendMessageToTelegram(chatId, BotMessages.ERROR_TASK_NOT_FOUND.getMessage(), telegramClient);
        } catch (Exception e) {
            logger.error("Error marking task as done: {}", e.getLocalizedMessage(), e);
            BotHelper.sendMessageToTelegram(chatId, BotMessages.ERROR_TASK_UPDATE.getMessage(), telegramClient);
        }
    }

    public void fnUndo() {
        if (requestText.indexOf(BotLabels.UNDO.getLabel()) == -1)
            return;

        String taskId = requestText.substring(0, requestText.lastIndexOf(BotLabels.DASH.getLabel()));
        try {
            TaskDTO taskDto = taskService.getTaskById(taskId);
            taskDto.setStatus(Status.IN_PROGRESS);
            taskService.updateTask(taskId, taskDto);
            BotHelper.sendMessageToTelegram(chatId, BotMessages.ITEM_UNDONE.getMessage(), telegramClient);
        } catch (RuntimeException e) {
            logger.error("Task not found: {}", taskId, e);
            BotHelper.sendMessageToTelegram(chatId, BotMessages.ERROR_TASK_NOT_FOUND.getMessage(), telegramClient);
        } catch (Exception e) {
            logger.error("Error undoing task: {}", e.getLocalizedMessage(), e);
            BotHelper.sendMessageToTelegram(chatId, BotMessages.ERROR_TASK_UPDATE.getMessage(), telegramClient);
        }
    }

    public void fnDelete() {
        if (requestText.indexOf(BotLabels.DELETE.getLabel()) == -1)
            return;

        String taskId = requestText.substring(0, requestText.lastIndexOf(BotLabels.DASH.getLabel()));
        try {
            taskService.deleteTask(taskId);
            BotHelper.sendMessageToTelegram(chatId, BotMessages.ITEM_DELETED.getMessage(), telegramClient);
        } catch (Exception e) {
            logger.error("Error deleting task: {}", e.getLocalizedMessage(), e);
            BotHelper.sendMessageToTelegram(chatId, BotMessages.ERROR_TASK_DELETE.getMessage(), telegramClient);
        }
    }

    public void fnHide() {
        if (requestText.equals(BotCommands.HIDE_COMMAND.getCommand())
                || requestText.equals(BotLabels.HIDE_MAIN_SCREEN.getLabel())) {
            sessionService.clearTaskCreationState(chatId);
            BotHelper.sendMessageToTelegram(chatId, BotMessages.BYE.getMessage(), telegramClient);
        }
    }

    public void fnListAll() {
        if (!(requestText.equals(BotCommands.TODO_LIST.getCommand())
                || requestText.equals(BotLabels.LIST_ALL_ITEMS.getLabel())
                || requestText.equals(BotLabels.MY_TODO_LIST.getLabel())))
            return;

        sessionService.clearTaskCreationState(chatId);

        Optional<User> userOpt = sessionService.getAuthenticatedUser(chatId);
        if (userOpt.isEmpty()) {
            fnLogin();
            return;
        }

        User currentUser = userOpt.get();
        List<TaskDTO> allItems = taskService.getTasksByAssigneeId(currentUser.getId());
        ReplyKeyboardMarkup keyboardMarkup = ReplyKeyboardMarkup.builder()
                .resizeKeyboard(true)
                .oneTimeKeyboard(false)
                .selective(true)
                .build();

        List<KeyboardRow> keyboard = new ArrayList<>();

        KeyboardRow mainScreenRowTop = new KeyboardRow();
        mainScreenRowTop.add(BotLabels.INTRODUCTION.getLabel());
        keyboard.add(mainScreenRowTop);

        KeyboardRow firstRow = new KeyboardRow();
        firstRow.add(BotLabels.ADD_NEW_ITEM.getLabel());
        keyboard.add(firstRow);

        KeyboardRow TomaTaskTitleRow = new KeyboardRow();
        TomaTaskTitleRow.add(BotLabels.MY_TODO_LIST.getLabel());
        keyboard.add(TomaTaskTitleRow);

        List<TaskDTO> activeItems = allItems.stream().filter(item -> item.getStatus() != Status.DONE)
                .collect(Collectors.toList());

        for (TaskDTO item : activeItems) {
            KeyboardRow currentRow = new KeyboardRow();
            currentRow.add(item.getName());
            currentRow.add(item.getId() + BotLabels.DASH.getLabel() + BotLabels.DONE.getLabel());
            keyboard.add(currentRow);
        }

        List<TaskDTO> doneItems = allItems.stream().filter(item -> item.getStatus() == Status.DONE)
                .collect(Collectors.toList());

        for (TaskDTO item : doneItems) {
            KeyboardRow currentRow = new KeyboardRow();
            currentRow.add(item.getName());
            currentRow.add(item.getId() + BotLabels.DASH.getLabel() + BotLabels.UNDO.getLabel());
            currentRow.add(item.getId() + BotLabels.DASH.getLabel() + BotLabels.DELETE.getLabel());
            keyboard.add(currentRow);
        }

        KeyboardRow logoutRow = new KeyboardRow();
        logoutRow.add(BotLabels.LOGOUT.getLabel());
        keyboard.add(logoutRow);

        keyboardMarkup.setKeyboard(keyboard);

        BotHelper.sendMessageToTelegram(chatId, BotLabels.MY_TODO_LIST.getLabel(), telegramClient, keyboardMarkup);
    }

    /**
     * Initiates the add item flow with sprint selection.
     */
    public void fnAddItem() {
        if (!(requestText.contains(BotCommands.ADD_ITEM.getCommand())
                || requestText.contains(BotLabels.ADD_NEW_ITEM.getLabel())))
            return;

        logger.info("Starting add item flow for chat {}", chatId);

        if (!sessionService.isAuthenticated(chatId)) {
            fnLogin();
            return;
        }

        List<SprintDTO> sprints = new ArrayList<>();
        try {
            sprints = sprintService.getAllSprints();
        } catch (Exception e) {
            logger.warn("Could not fetch sprints: {}", e.getMessage());
        }

        if (sprints.isEmpty()) {
            BotHelper.sendMessageToTelegram(chatId, BotMessages.NO_SPRINTS_AVAILABLE.getMessage(), telegramClient, null);
            sessionService.setTaskCreationState(chatId, TASK_STATE_AWAITING_NAME, null);
            BotHelper.sendMessageToTelegram(chatId, BotMessages.TYPE_NEW_TODO_ITEM.getMessage(), telegramClient);
        } else {
            sessionService.setTaskCreationState(chatId, TASK_STATE_AWAITING_SPRINT, null);
            showSprintSelectionKeyboard(sprints);
        }
    }

    private void showSprintSelectionKeyboard(List<SprintDTO> sprints) {
        ReplyKeyboardMarkup keyboardMarkup = ReplyKeyboardMarkup.builder()
                .resizeKeyboard(true)
                .oneTimeKeyboard(true)
                .selective(true)
                .build();

        List<KeyboardRow> keyboard = new ArrayList<>();

        for (SprintDTO sprint : sprints) {
            KeyboardRow row = new KeyboardRow();
            row.add(BotLabels.SPRINT_PREFIX.getLabel() + sprint.getId() + BotLabels.DASH.getLabel()
                    + sprint.getDescription());
            keyboard.add(row);
        }

        KeyboardRow noSprintRow = new KeyboardRow();
        noSprintRow.add(BotLabels.NO_SPRINT.getLabel());
        keyboard.add(noSprintRow);

        KeyboardRow cancelRow = new KeyboardRow();
        cancelRow.add(BotLabels.CANCEL.getLabel());
        keyboard.add(cancelRow);

        keyboardMarkup.setKeyboard(keyboard);

        BotHelper.sendMessageToTelegram(chatId, BotMessages.SELECT_SPRINT.getMessage(), telegramClient, keyboardMarkup);
    }

    /**
     * Handles sprint selection during task creation.
     */
    public void fnSprintSelection() {
        String taskState = sessionService.getTaskCreationState(chatId);
        if (!TASK_STATE_AWAITING_SPRINT.equals(taskState))
            return;

        if (requestText.equals(BotLabels.CANCEL.getLabel())) {
            sessionService.clearTaskCreationState(chatId);
            fnStart();
            return;
        }

        if (requestText.equals(BotLabels.NO_SPRINT.getLabel())) {
            sessionService.setTaskCreationState(chatId, TASK_STATE_AWAITING_NAME, null);
            BotHelper.sendMessageToTelegram(chatId, BotMessages.SPRINT_SELECTED.getMessage(), telegramClient, null);
            return;
        }

        if (requestText.startsWith(BotLabels.SPRINT_PREFIX.getLabel())) {
            String afterPrefix = requestText.substring(BotLabels.SPRINT_PREFIX.getLabel().length());
            int dashIndex = afterPrefix.indexOf(BotLabels.DASH.getLabel());
            if (dashIndex > 0) {
                String sprintId = afterPrefix.substring(0, dashIndex);
                sessionService.setTaskCreationState(chatId, TASK_STATE_AWAITING_NAME, sprintId);
                BotHelper.sendMessageToTelegram(chatId, BotMessages.SPRINT_SELECTED.getMessage(), telegramClient, null);
                return;
            }
        }

        // Invalid selection - show keyboard again
        try {
            List<SprintDTO> sprints = sprintService.getAllSprints();
            showSprintSelectionKeyboard(sprints);
        } catch (Exception e) {
            logger.error("Error fetching sprints: {}", e.getMessage());
            sessionService.setTaskCreationState(chatId, TASK_STATE_AWAITING_NAME, null);
            BotHelper.sendMessageToTelegram(chatId, BotMessages.TYPE_NEW_TODO_ITEM.getMessage(), telegramClient);
        }
    }

    /**
     * Creates a new task with the selected sprint (or no sprint).
     */
    public void fnElse() {
        Optional<User> userOpt = sessionService.getAuthenticatedUser(chatId);
        if (userOpt.isEmpty())
            return;

        User currentUser = userOpt.get();
        String taskState = sessionService.getTaskCreationState(chatId);

        if (!TASK_STATE_AWAITING_NAME.equals(taskState)) {
            sessionService.setTaskCreationState(chatId, TASK_STATE_AWAITING_NAME, null);
        }

        try {
            TaskDTO newTaskDto = new TaskDTO();
            newTaskDto.setName(requestText);
            newTaskDto.setStatus(Status.IN_PROGRESS);
            newTaskDto.setAssigneeId(currentUser.getId());
            newTaskDto.setTimeEstimate(2);

            String selectedSprintId = sessionService.getSelectedSprintId(chatId);
            if (selectedSprintId != null) {
                newTaskDto.setSprintId(selectedSprintId);
            }

            taskService.createTask(newTaskDto);
            sessionService.clearTaskCreationState(chatId);

            BotHelper.sendMessageToTelegram(chatId, BotMessages.NEW_ITEM_ADDED.getMessage(), telegramClient, null);
        } catch (Exception e) {
            logger.error("Error creating task: {}", e.getLocalizedMessage(), e);
            BotHelper.sendMessageToTelegram(chatId, BotMessages.ERROR_TASK_CREATE.getMessage(), telegramClient, null);
        }
    }

    // --- Predicate helpers for controller dispatch ---

    public boolean hasPendingLogin() {
        return sessionService.hasPendingLogin(chatId);
    }

    public boolean isLoginCommand() {
        return requestText != null && (requestText.equals(BotCommands.LOGIN_COMMAND.getCommand())
                || requestText.equals(BotLabels.LOGIN.getLabel()));
    }

    public boolean isLogoutCommand() {
        return requestText != null && (requestText.equals(BotCommands.LOGOUT_COMMAND.getCommand())
                || requestText.equals(BotLabels.LOGOUT.getLabel()));
    }

    public boolean isStartCommand() {
        return requestText != null && (requestText.equals(BotCommands.START_COMMAND.getCommand())
                || requestText.equals(BotLabels.INTRODUCTION.getLabel()));
    }

    public boolean isListCommand() {
        return requestText != null && (requestText.equals(BotCommands.TODO_LIST.getCommand())
                || requestText.equals(BotLabels.LIST_ALL_ITEMS.getLabel())
                || requestText.equals(BotLabels.MY_TODO_LIST.getLabel()));
    }

    public boolean isAddCommand() {
        return requestText != null && (requestText.contains(BotCommands.ADD_ITEM.getCommand())
                || requestText.contains(BotLabels.ADD_NEW_ITEM.getLabel()));
    }

    public boolean containsDone() {
        return requestText != null && requestText.contains(BotLabels.DONE.getLabel());
    }

    public boolean containsUndo() {
        return requestText != null && requestText.contains(BotLabels.UNDO.getLabel());
    }

    public boolean containsDelete() {
        return requestText != null && requestText.contains(BotLabels.DELETE.getLabel());
    }

    public boolean isHideCommand() {
        return requestText != null && (requestText.equals(BotCommands.HIDE_COMMAND.getCommand())
                || requestText.equals(BotLabels.HIDE_MAIN_SCREEN.getLabel()));
    }

    public boolean hasSession() {
        return sessionService.isAuthenticated(chatId);
    }

    public boolean isAwaitingSprintSelection() {
        return TASK_STATE_AWAITING_SPRINT.equals(sessionService.getTaskCreationState(chatId));
    }
}
