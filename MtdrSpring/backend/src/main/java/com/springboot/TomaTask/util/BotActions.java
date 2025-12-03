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

    // Task creation flow states (in order)
    public static final String TASK_STATE_AWAITING_NAME = "AWAITING_TASK_NAME";
    public static final String TASK_STATE_AWAITING_STATUS = "AWAITING_STATUS";
    public static final String TASK_STATE_AWAITING_PRIORITY = "AWAITING_PRIORITY";
    public static final String TASK_STATE_AWAITING_ESTIMATION = "AWAITING_ESTIMATION";
    public static final String TASK_STATE_AWAITING_SPRINT = "AWAITING_SPRINT";

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
                // Check if user wants to restart login flow
                if (requestText.equals(BotCommands.LOGIN_COMMAND.getCommand())
                        || requestText.equals(BotLabels.LOGIN.getLabel())) {
                    // User typed /login - restart the login flow
                    sessionService.clearLoginState(chatId);
                    sessionService.setLoginState(chatId, LOGIN_STATE_AWAITING_EMAIL, null);
                    BotHelper.sendMessageToTelegram(chatId, BotMessages.LOGIN_PROMPT.getMessage(), telegramClient, null);
                    return;
                }

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

        // Redirect from other commands when not logged in - show login prompt with button
        BotHelper.sendMessageToTelegram(chatId, BotMessages.NOT_LOGGED_IN.getMessage(), telegramClient,
                ReplyKeyboardMarkup
                        .builder()
                        .keyboardRow(new KeyboardRow(BotLabels.LOGIN.getLabel()))
                        .keyboardRow(new KeyboardRow(BotLabels.INTRODUCTION.getLabel()))
                        .build());
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

        // Clear any pending states (login and task creation)
        sessionService.clearLoginState(chatId);
        sessionService.clearTaskCreationState(chatId);

        // Show different options based on authentication status
        if (sessionService.isAuthenticated(chatId)) {
            // Authenticated user - show full menu
            BotHelper.sendMessageToTelegram(chatId, BotMessages.HELLO_MYTODO_BOT.getMessage(), telegramClient,
                    ReplyKeyboardMarkup
                            .builder()
                            .keyboardRow(
                                    new KeyboardRow(BotLabels.LIST_ALL_ITEMS.getLabel(),
                                            BotLabels.ADD_NEW_ITEM.getLabel()))
                            .keyboardRow(new KeyboardRow(BotLabels.INTRODUCTION.getLabel(),
                                    BotLabels.HIDE_MAIN_SCREEN.getLabel()))
                            .build());
        } else {
            // Not authenticated - show welcome with login option
            // Do NOT auto-set awaiting email state - let user explicitly click Login
            BotHelper.sendMessageToTelegram(chatId, BotMessages.HELLO_MYTODO_BOT.getMessage(), telegramClient,
                    ReplyKeyboardMarkup
                            .builder()
                            .keyboardRow(new KeyboardRow(BotLabels.LOGIN.getLabel()))
                            .keyboardRow(new KeyboardRow(BotLabels.INTRODUCTION.getLabel()))
                            .build());
        }
    }

    /**
     * Resolves a task index (from keyboard button) to the actual task ID using the stored mapping.
     */
    private String resolveTaskIdFromIndex(String indexStr) {
        String mapping = sessionService.getTaskIndexMapping(chatId);
        if (mapping == null || mapping.isEmpty()) {
            return null;
        }
        // Parse JSON mapping: {"1":"uuid1","2":"uuid2",...}
        String searchKey = "\"" + indexStr + "\":\"";
        int keyStart = mapping.indexOf(searchKey);
        if (keyStart == -1) {
            return null;
        }
        int valueStart = keyStart + searchKey.length();
        int valueEnd = mapping.indexOf("\"", valueStart);
        if (valueEnd == -1) {
            return null;
        }
        return mapping.substring(valueStart, valueEnd);
    }

    public void fnDone() {
        if (requestText.indexOf(BotLabels.DONE.getLabel()) == -1)
            return;

        String indexStr = requestText.substring(0, requestText.lastIndexOf(BotLabels.DASH.getLabel()));
        String taskId = resolveTaskIdFromIndex(indexStr);

        if (taskId == null) {
            logger.error("Could not resolve task index: {}", indexStr);
            BotHelper.sendMessageToTelegram(chatId, BotMessages.ERROR_TASK_NOT_FOUND.getMessage(), telegramClient);
            return;
        }

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

        String indexStr = requestText.substring(0, requestText.lastIndexOf(BotLabels.DASH.getLabel()));
        String taskId = resolveTaskIdFromIndex(indexStr);

        if (taskId == null) {
            logger.error("Could not resolve task index: {}", indexStr);
            BotHelper.sendMessageToTelegram(chatId, BotMessages.ERROR_TASK_NOT_FOUND.getMessage(), telegramClient);
            return;
        }

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

        String indexStr = requestText.substring(0, requestText.lastIndexOf(BotLabels.DASH.getLabel()));
        String taskId = resolveTaskIdFromIndex(indexStr);

        if (taskId == null) {
            logger.error("Could not resolve task index: {}", indexStr);
            BotHelper.sendMessageToTelegram(chatId, BotMessages.ERROR_TASK_NOT_FOUND.getMessage(), telegramClient);
            return;
        }

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

        List<TaskDTO> doneItems = allItems.stream().filter(item -> item.getStatus() == Status.DONE)
                .collect(Collectors.toList());

        // Build index-to-taskId mapping
        Map<Integer, String> indexToTaskId = new HashMap<>();
        int index = 1;

        for (TaskDTO item : activeItems) {
            indexToTaskId.put(index, item.getId());
            KeyboardRow currentRow = new KeyboardRow();
            currentRow.add(item.getName());
            currentRow.add(index + BotLabels.DASH.getLabel() + BotLabels.DONE.getLabel());
            keyboard.add(currentRow);
            index++;
        }

        for (TaskDTO item : doneItems) {
            indexToTaskId.put(index, item.getId());
            KeyboardRow currentRow = new KeyboardRow();
            currentRow.add(item.getName());
            currentRow.add(index + BotLabels.DASH.getLabel() + BotLabels.UNDO.getLabel());
            currentRow.add(index + BotLabels.DASH.getLabel() + BotLabels.DELETE.getLabel());
            keyboard.add(currentRow);
            index++;
        }

        // Store the mapping as JSON in the session
        StringBuilder mappingJson = new StringBuilder("{");
        boolean first = true;
        for (Map.Entry<Integer, String> entry : indexToTaskId.entrySet()) {
            if (!first) mappingJson.append(",");
            mappingJson.append("\"").append(entry.getKey()).append("\":\"").append(entry.getValue()).append("\"");
            first = false;
        }
        mappingJson.append("}");
        sessionService.setTaskIndexMapping(chatId, mappingJson.toString());

        KeyboardRow logoutRow = new KeyboardRow();
        logoutRow.add(BotLabels.LOGOUT.getLabel());
        keyboard.add(logoutRow);

        keyboardMarkup.setKeyboard(keyboard);

        BotHelper.sendMessageToTelegram(chatId, BotLabels.MY_TODO_LIST.getLabel(), telegramClient, keyboardMarkup);
    }

    /**
     * Initiates the add item flow - starts with asking for task name.
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

        // Clear any previous task creation state and start fresh
        sessionService.clearTaskCreationState(chatId);
        sessionService.setTaskCreationState(chatId, TASK_STATE_AWAITING_NAME);
        BotHelper.sendMessageToTelegram(chatId, BotMessages.ENTER_TASK_NAME.getMessage(), telegramClient);
    }

    /**
     * Handles task name input.
     */
    public void fnTaskNameInput() {
        String taskState = sessionService.getTaskCreationState(chatId);
        if (!TASK_STATE_AWAITING_NAME.equals(taskState))
            return;

        if (requestText.equals(BotLabels.CANCEL.getLabel())) {
            sessionService.clearTaskCreationState(chatId);
            BotHelper.sendMessageToTelegram(chatId, BotMessages.TASK_CREATION_CANCELLED.getMessage(), telegramClient);
            return;
        }

        // Save task name and move to status selection
        sessionService.setPendingTaskName(chatId, requestText);
        sessionService.setTaskCreationState(chatId, TASK_STATE_AWAITING_STATUS);
        showStatusKeyboard();
    }

    private void showStatusKeyboard() {
        ReplyKeyboardMarkup keyboardMarkup = ReplyKeyboardMarkup.builder()
                .resizeKeyboard(true)
                .oneTimeKeyboard(true)
                .selective(true)
                .build();

        List<KeyboardRow> keyboard = new ArrayList<>();

        KeyboardRow row1 = new KeyboardRow();
        row1.add(BotLabels.STATUS_TODO.getLabel());
        row1.add(BotLabels.STATUS_IN_PROGRESS.getLabel());
        keyboard.add(row1);

        KeyboardRow row2 = new KeyboardRow();
        row2.add(BotLabels.STATUS_PENDING.getLabel());
        row2.add(BotLabels.STATUS_TESTING.getLabel());
        keyboard.add(row2);

        KeyboardRow cancelRow = new KeyboardRow();
        cancelRow.add(BotLabels.CANCEL.getLabel());
        keyboard.add(cancelRow);

        keyboardMarkup.setKeyboard(keyboard);
        BotHelper.sendMessageToTelegram(chatId, BotMessages.SELECT_STATUS.getMessage(), telegramClient, keyboardMarkup);
    }

    /**
     * Handles status selection.
     */
    public void fnStatusSelection() {
        String taskState = sessionService.getTaskCreationState(chatId);
        if (!TASK_STATE_AWAITING_STATUS.equals(taskState))
            return;

        if (requestText.equals(BotLabels.CANCEL.getLabel())) {
            sessionService.clearTaskCreationState(chatId);
            BotHelper.sendMessageToTelegram(chatId, BotMessages.TASK_CREATION_CANCELLED.getMessage(), telegramClient);
            return;
        }

        // Map label to Status enum
        String status = null;
        if (requestText.equals(BotLabels.STATUS_TODO.getLabel())) {
            status = "TODO";
        } else if (requestText.equals(BotLabels.STATUS_IN_PROGRESS.getLabel())) {
            status = "IN_PROGRESS";
        } else if (requestText.equals(BotLabels.STATUS_PENDING.getLabel())) {
            status = "PENDING";
        } else if (requestText.equals(BotLabels.STATUS_TESTING.getLabel())) {
            status = "TESTING";
        }

        if (status == null) {
            // Invalid selection - show keyboard again
            showStatusKeyboard();
            return;
        }

        sessionService.setSelectedStatus(chatId, status);
        sessionService.setTaskCreationState(chatId, TASK_STATE_AWAITING_PRIORITY);
        showPriorityKeyboard();
    }

    private void showPriorityKeyboard() {
        ReplyKeyboardMarkup keyboardMarkup = ReplyKeyboardMarkup.builder()
                .resizeKeyboard(true)
                .oneTimeKeyboard(true)
                .selective(true)
                .build();

        List<KeyboardRow> keyboard = new ArrayList<>();

        KeyboardRow row1 = new KeyboardRow();
        row1.add(BotLabels.PRIORITY_LOW.getLabel());
        row1.add(BotLabels.PRIORITY_MODERATE.getLabel());
        keyboard.add(row1);

        KeyboardRow row2 = new KeyboardRow();
        row2.add(BotLabels.PRIORITY_HIGH.getLabel());
        row2.add(BotLabels.PRIORITY_URGENT.getLabel());
        keyboard.add(row2);

        KeyboardRow cancelRow = new KeyboardRow();
        cancelRow.add(BotLabels.CANCEL.getLabel());
        keyboard.add(cancelRow);

        keyboardMarkup.setKeyboard(keyboard);
        BotHelper.sendMessageToTelegram(chatId, BotMessages.SELECT_PRIORITY.getMessage(), telegramClient, keyboardMarkup);
    }

    /**
     * Handles priority selection.
     */
    public void fnPrioritySelection() {
        String taskState = sessionService.getTaskCreationState(chatId);
        if (!TASK_STATE_AWAITING_PRIORITY.equals(taskState))
            return;

        if (requestText.equals(BotLabels.CANCEL.getLabel())) {
            sessionService.clearTaskCreationState(chatId);
            BotHelper.sendMessageToTelegram(chatId, BotMessages.TASK_CREATION_CANCELLED.getMessage(), telegramClient);
            return;
        }

        // Map label to Priority enum
        String priority = null;
        if (requestText.equals(BotLabels.PRIORITY_LOW.getLabel())) {
            priority = "LOW";
        } else if (requestText.equals(BotLabels.PRIORITY_MODERATE.getLabel())) {
            priority = "MODERATE";
        } else if (requestText.equals(BotLabels.PRIORITY_HIGH.getLabel())) {
            priority = "HIGH";
        } else if (requestText.equals(BotLabels.PRIORITY_URGENT.getLabel())) {
            priority = "URGENT";
        }

        if (priority == null) {
            // Invalid selection - show keyboard again
            showPriorityKeyboard();
            return;
        }

        sessionService.setSelectedPriority(chatId, priority);
        sessionService.setTaskCreationState(chatId, TASK_STATE_AWAITING_ESTIMATION);
        showEstimationKeyboard();
    }

    private void showEstimationKeyboard() {
        ReplyKeyboardMarkup keyboardMarkup = ReplyKeyboardMarkup.builder()
                .resizeKeyboard(true)
                .oneTimeKeyboard(true)
                .selective(true)
                .build();

        List<KeyboardRow> keyboard = new ArrayList<>();

        KeyboardRow row1 = new KeyboardRow();
        row1.add(BotLabels.ESTIMATION_XS.getLabel());
        row1.add(BotLabels.ESTIMATION_S.getLabel());
        row1.add(BotLabels.ESTIMATION_M.getLabel());
        keyboard.add(row1);

        KeyboardRow row2 = new KeyboardRow();
        row2.add(BotLabels.ESTIMATION_L.getLabel());
        row2.add(BotLabels.ESTIMATION_XL.getLabel());
        row2.add(BotLabels.ESTIMATION_XXL.getLabel());
        keyboard.add(row2);

        KeyboardRow cancelRow = new KeyboardRow();
        cancelRow.add(BotLabels.CANCEL.getLabel());
        keyboard.add(cancelRow);

        keyboardMarkup.setKeyboard(keyboard);
        BotHelper.sendMessageToTelegram(chatId, BotMessages.SELECT_ESTIMATION.getMessage(), telegramClient, keyboardMarkup);
    }

    /**
     * Handles estimation selection.
     */
    public void fnEstimationSelection() {
        String taskState = sessionService.getTaskCreationState(chatId);
        if (!TASK_STATE_AWAITING_ESTIMATION.equals(taskState))
            return;

        if (requestText.equals(BotLabels.CANCEL.getLabel())) {
            sessionService.clearTaskCreationState(chatId);
            BotHelper.sendMessageToTelegram(chatId, BotMessages.TASK_CREATION_CANCELLED.getMessage(), telegramClient);
            return;
        }

        // Map label to Estimation enum
        String estimation = null;
        if (requestText.equals(BotLabels.ESTIMATION_XS.getLabel())) {
            estimation = "XS";
        } else if (requestText.equals(BotLabels.ESTIMATION_S.getLabel())) {
            estimation = "S";
        } else if (requestText.equals(BotLabels.ESTIMATION_M.getLabel())) {
            estimation = "M";
        } else if (requestText.equals(BotLabels.ESTIMATION_L.getLabel())) {
            estimation = "L";
        } else if (requestText.equals(BotLabels.ESTIMATION_XL.getLabel())) {
            estimation = "XL";
        } else if (requestText.equals(BotLabels.ESTIMATION_XXL.getLabel())) {
            estimation = "XXL";
        }

        if (estimation == null) {
            // Invalid selection - show keyboard again
            showEstimationKeyboard();
            return;
        }

        sessionService.setSelectedEstimation(chatId, estimation);
        sessionService.setTaskCreationState(chatId, TASK_STATE_AWAITING_SPRINT);

        // Show only ongoing sprints
        List<SprintDTO> ongoingSprints = getOngoingSprints();
        if (ongoingSprints.isEmpty()) {
            BotHelper.sendMessageToTelegram(chatId, BotMessages.NO_SPRINTS_AVAILABLE.getMessage(), telegramClient);
            // Create task without sprint
            createTask(null);
        } else {
            showSprintSelectionKeyboard(ongoingSprints);
        }
    }

    private List<SprintDTO> getOngoingSprints() {
        try {
            List<SprintDTO> allSprints = sprintService.getAllSprints();
            // Filter only "ongoing" or "in progress" sprints
            return allSprints.stream()
                    .filter(s -> s.getStatus() != null &&
                            (s.getStatus().equalsIgnoreCase("ongoing") ||
                             s.getStatus().equalsIgnoreCase("in_progress") ||
                             s.getStatus().equalsIgnoreCase("active") ||
                             s.getStatus().equalsIgnoreCase("in progress")))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.warn("Could not fetch sprints: {}", e.getMessage());
            return new ArrayList<>();
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
            BotHelper.sendMessageToTelegram(chatId, BotMessages.TASK_CREATION_CANCELLED.getMessage(), telegramClient);
            return;
        }

        if (requestText.equals(BotLabels.NO_SPRINT.getLabel())) {
            createTask(null);
            return;
        }

        if (requestText.startsWith(BotLabels.SPRINT_PREFIX.getLabel())) {
            String afterPrefix = requestText.substring(BotLabels.SPRINT_PREFIX.getLabel().length());
            int dashIndex = afterPrefix.indexOf(BotLabels.DASH.getLabel());
            if (dashIndex > 0) {
                String sprintId = afterPrefix.substring(0, dashIndex);
                createTask(sprintId);
                return;
            }
        }

        // Invalid selection - show keyboard again
        List<SprintDTO> ongoingSprints = getOngoingSprints();
        if (ongoingSprints.isEmpty()) {
            createTask(null);
        } else {
            showSprintSelectionKeyboard(ongoingSprints);
        }
    }

    /**
     * Creates the task with all collected data.
     */
    private void createTask(String sprintId) {
        Optional<User> userOpt = sessionService.getAuthenticatedUser(chatId);
        if (userOpt.isEmpty()) {
            sessionService.clearTaskCreationState(chatId);
            fnLogin();
            return;
        }

        User currentUser = userOpt.get();

        try {
            TaskDTO newTaskDto = new TaskDTO();
            newTaskDto.setName(sessionService.getPendingTaskName(chatId));
            newTaskDto.setAssigneeId(currentUser.getId());

            // Set status
            String statusStr = sessionService.getSelectedStatus(chatId);
            if (statusStr != null) {
                newTaskDto.setStatus(Status.valueOf(statusStr));
            } else {
                newTaskDto.setStatus(Status.TODO);
            }

            // Set priority
            String priorityStr = sessionService.getSelectedPriority(chatId);
            if (priorityStr != null) {
                newTaskDto.setPriority(com.springboot.TomaTask.model.Task.Priority.valueOf(priorityStr));
            }

            // Set estimation
            String estimationStr = sessionService.getSelectedEstimation(chatId);
            if (estimationStr != null) {
                newTaskDto.setEstimation(com.springboot.TomaTask.model.Task.Estimation.valueOf(estimationStr));
            }

            // Set sprint if provided
            if (sprintId != null) {
                newTaskDto.setSprintId(sprintId);
            }

            taskService.createTask(newTaskDto);
            sessionService.clearTaskCreationState(chatId);

            // Use the overload without keyboard parameter to remove the keyboard
            BotHelper.sendMessageToTelegram(chatId, BotMessages.NEW_ITEM_ADDED.getMessage(), telegramClient);
        } catch (Exception e) {
            logger.error("Error creating task: {}", e.getLocalizedMessage(), e);
            sessionService.clearTaskCreationState(chatId);
            // Use the overload without keyboard parameter to remove the keyboard
            BotHelper.sendMessageToTelegram(chatId, BotMessages.ERROR_TASK_CREATE.getMessage(), telegramClient);
        }
    }

    /**
     * Handles any other text input when authenticated (fallback).
     */
    public void fnElse() {
        // This should no longer be used for task creation
        // Task creation now goes through the explicit flow
        BotHelper.sendMessageToTelegram(chatId, BotMessages.TYPE_NEW_TODO_ITEM.getMessage(), telegramClient, null);
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

    public boolean isAwaitingTaskName() {
        return TASK_STATE_AWAITING_NAME.equals(sessionService.getTaskCreationState(chatId));
    }

    public boolean isAwaitingStatus() {
        return TASK_STATE_AWAITING_STATUS.equals(sessionService.getTaskCreationState(chatId));
    }

    public boolean isAwaitingPriority() {
        return TASK_STATE_AWAITING_PRIORITY.equals(sessionService.getTaskCreationState(chatId));
    }

    public boolean isAwaitingEstimation() {
        return TASK_STATE_AWAITING_ESTIMATION.equals(sessionService.getTaskCreationState(chatId));
    }

    public boolean isAwaitingSprintSelection() {
        return TASK_STATE_AWAITING_SPRINT.equals(sessionService.getTaskCreationState(chatId));
    }

    public boolean isInTaskCreationFlow() {
        String state = sessionService.getTaskCreationState(chatId);
        return state != null && (
                TASK_STATE_AWAITING_NAME.equals(state) ||
                TASK_STATE_AWAITING_STATUS.equals(state) ||
                TASK_STATE_AWAITING_PRIORITY.equals(state) ||
                TASK_STATE_AWAITING_ESTIMATION.equals(state) ||
                TASK_STATE_AWAITING_SPRINT.equals(state)
        );
    }
}
