package com.springboot.TomaTask.util;

import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardRow;
import org.telegram.telegrambots.meta.generics.TelegramClient;

import com.springboot.TomaTask.model.Task;
import com.springboot.TomaTask.dto.TaskDTO;
import com.springboot.TomaTask.mapper.TaskMapper;
import com.springboot.TomaTask.service.TaskService;
import com.springboot.TomaTask.service.UserService;
import com.springboot.TomaTask.model.User;
import com.springboot.TomaTask.model.Task.Status;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

public class BotActions {

    private static final Logger logger = LoggerFactory.getLogger(BotActions.class);

    enum LoginState {
        AWAITING_EMAIL
    }

    // persist pending login/email/otp states across BotActions instances
    private static final ConcurrentHashMap<Long, String> loginState = new ConcurrentHashMap<>();
    // persist authenticated sessions across BotActions instances
    private static final ConcurrentHashMap<Long, User> sessionByChat = new ConcurrentHashMap<>();
    String requestText;
    long chatId;
    TelegramClient telegramClient;

    UserService userService;
    TaskService taskService;

    public BotActions(TelegramClient tc, TaskService ts, UserService us) {
        telegramClient = tc;
        taskService = ts;
        userService = us;
    }

    public void setRequestText(String cmd) {
        requestText = cmd;
    }

    public void setChatId(long chId) {
        chatId = chId;
    }

    public void setTelegramClient(TelegramClient tc) {
        telegramClient = tc;
    }

    public void setTaskService(TaskService tsvc) {
        taskService = tsvc;
    }

    public TaskService getTaskService() {
        return taskService;
    }

    public void setUserService(UserService usvc) {
        userService = usvc;
    }

    public UserService getUserService() {
        return userService;
    }

    public void fnLogin() {
        if ((requestText.equals(BotCommands.LOGIN_COMMAND.getCommand())
                || requestText.equals(BotLabels.LOGIN.getLabel())) && sessionByChat.get(chatId) != null) {
            BotHelper.sendMessageToTelegram(chatId, BotMessages.ALREADY_LOGGED_IN.getMessage(), telegramClient,
                    null);
            return;
        }

        String pending = loginState.get(chatId);
        logger.info("fnLogin called for chatId={} requestText='{}' pending='{}' sessionPresent={}", chatId,
                requestText, pending, sessionByChat.containsKey(chatId));
        if (pending != null) {
            if (LoginState.AWAITING_EMAIL.name().equals(pending)) {
                String email = requestText.trim();
                if (!email.contains("@") || !email.contains(".")) {
                    BotHelper.sendMessageToTelegram(chatId, BotMessages.INVALID_EMAIL.getMessage(), telegramClient,
                            null);
                    return;
                } else if (!userService.emailExists(email)) {
                    BotHelper.sendMessageToTelegram(chatId, BotMessages.EMAIL_NOT_FOUND.getMessage(), telegramClient,
                            null);
                    return;
                }

                loginState.put(chatId, email);

                // otpService.createAndSendOtp(email);
                BotHelper.sendMessageToTelegram(chatId, BotMessages.OTP_MISSING.getMessage(), telegramClient,
                        null);
                return;
            }

            String email = pending;
            String otp = requestText.trim();
            // boolean ok = otpService.validateOtp(email, otp);
            if ("142356".equals(otp)) {
                User u = userService.findByEmail(email);
                if (u == null) {
                    BotHelper.sendMessageToTelegram(chatId, BotMessages.LOGIN_ERROR.getMessage(), telegramClient,
                            null);
                    return;
                }
                loginState.remove(chatId);
                sessionByChat.put(chatId, u);
                logger.info("Created session for chat {} user={}", chatId, u.getEmail());
                BotHelper.sendMessageToTelegram(chatId, BotMessages.LOGIN_SUCCESS.getMessage(), telegramClient, null);
            } else {
                BotHelper.sendMessageToTelegram(chatId, BotMessages.INVALID_OTP.getMessage(),
                        telegramClient, null);
            }
            return;
        }

        if (!(requestText.equals(BotCommands.LOGIN_COMMAND.getCommand())
                || requestText.equals(BotLabels.LOGIN.getLabel()))) {
            BotHelper.sendMessageToTelegram(chatId, BotMessages.LOGIN_MISSING.getMessage(), telegramClient,
                    null);
            loginState.put(chatId, LoginState.AWAITING_EMAIL.name());
            return;
        }
    }

    public void fnLogout() {
        if (!(requestText.equals(BotCommands.LOGOUT_COMMAND.getCommand())
                || requestText.equals(BotLabels.LOGOUT.getLabel())))
            return;

        if (sessionByChat.get(chatId) == null) {
            BotHelper.sendMessageToTelegram(chatId, BotMessages.NOT_LOGGED_IN.getMessage(), telegramClient, null);
            return;
        }

        BotHelper.sendMessageToTelegram(chatId, BotMessages.LOGOUT_SUCCESS.getMessage(), telegramClient, null);
        sessionByChat.remove(chatId);
    }

    public void fnStart() {
        if (!(requestText.equals(BotCommands.START_COMMAND.getCommand())
                || requestText.equals(BotLabels.INTRODUCTION.getLabel())))
            return;

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
        if (!(requestText.indexOf(BotLabels.DONE.getLabel()) != -1))
            return;

        String done = requestText.substring(0, requestText.lastIndexOf(BotLabels.DASH.getLabel()));
        try {
            TaskDTO taskDto = taskService.getTaskById(done);
            taskDto.setStatus(Status.DONE);
            taskService.updateTask(done, taskDto);
            BotHelper.sendMessageToTelegram(chatId, BotMessages.ITEM_DONE.getMessage(), telegramClient);
        } catch (Exception e) {
            logger.error(e.getLocalizedMessage(), e);
        }
    }

    public void fnUndo() {
        if (requestText.indexOf(BotLabels.UNDO.getLabel()) == -1)
            return;

        String undo = requestText.substring(0,
                requestText.lastIndexOf(BotLabels.DASH.getLabel()));
        try {
            TaskDTO taskDto = taskService.getTaskById(undo);
            taskDto.setStatus(Status.DONE);
            taskService.updateTask(undo, taskDto);
            BotHelper.sendMessageToTelegram(chatId, BotMessages.ITEM_UNDONE.getMessage(), telegramClient);
        } catch (Exception e) {
            logger.error(e.getLocalizedMessage(), e);
        }
    }

    public void fnDelete() {
        if (requestText.indexOf(BotLabels.DELETE.getLabel()) == -1)
            return;

        String delete = requestText.substring(0,
                requestText.lastIndexOf(BotLabels.DASH.getLabel()));
        try {
            taskService.deleteTask(delete);
            BotHelper.sendMessageToTelegram(chatId, BotMessages.ITEM_DELETED.getMessage(), telegramClient);
        } catch (Exception e) {
            logger.error(e.getLocalizedMessage(), e);
        }
    }

    public void fnHide() {
        if (requestText.equals(BotCommands.HIDE_COMMAND.getCommand())
                || requestText.equals(BotLabels.HIDE_MAIN_SCREEN.getLabel())) {
            BotHelper.sendMessageToTelegram(chatId, BotMessages.BYE.getMessage(), telegramClient);
        } else
            return;
    }

    public void fnListAll() {
        if (!(requestText.equals(BotCommands.TODO_LIST.getCommand())
                || requestText.equals(BotLabels.LIST_ALL_ITEMS.getLabel())
                || requestText.equals(BotLabels.MY_TODO_LIST.getLabel())))
            return;
        logger.info("todoSvc: " + taskService);
        List<TaskDTO> allItems = taskService.getTasksByAssigneeId(sessionByChat.get(chatId).getID());
        ReplyKeyboardMarkup keyboardMarkup = ReplyKeyboardMarkup.builder()
                .resizeKeyboard(true)
                .oneTimeKeyboard(false)
                .selective(true)
                .build();

        List<KeyboardRow> keyboard = new ArrayList<>();

        // command back to main screen
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

        // Logout row
        KeyboardRow logoutRow = new KeyboardRow();
        logoutRow.add(BotLabels.LOGOUT.getLabel());
        keyboard.add(logoutRow);

        keyboardMarkup.setKeyboard(keyboard);

        BotHelper.sendMessageToTelegram(chatId, BotLabels.MY_TODO_LIST.getLabel(), telegramClient, keyboardMarkup);//
    }

    public void fnAddItem() {
        if (!(requestText.contains(BotCommands.ADD_ITEM.getCommand())
                || requestText.contains(BotLabels.ADD_NEW_ITEM.getLabel())))
            return;

        logger.info("Adding item by BotHelper");
        BotHelper.sendMessageToTelegram(chatId, BotMessages.TYPE_NEW_TODO_ITEM.getMessage(), telegramClient);
    }

    public void fnElse() {
        if (sessionByChat.get(chatId) == null)
            return;

        Task newItem = new Task();
        newItem.setName(requestText);
        newItem.setStatus(Status.IN_PROGRESS);
        newItem.setUser(sessionByChat.get(chatId));
        newItem.setTimeEstimate(2);
        taskService.createTask(TaskMapper.toDTO(newItem));

        BotHelper.sendMessageToTelegram(chatId, BotMessages.NEW_ITEM_ADDED.getMessage(), telegramClient, null);
    }

    // --- Predicate helpers so the controller can decide which fn to call ---
    public boolean hasPendingLogin() {
        return loginState.get(chatId) != null;
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
        return requestText != null && requestText.indexOf(BotLabels.DONE.getLabel()) != -1;
    }

    public boolean containsUndo() {
        return requestText != null && requestText.indexOf(BotLabels.UNDO.getLabel()) != -1;
    }

    public boolean containsDelete() {
        return requestText != null && requestText.indexOf(BotLabels.DELETE.getLabel()) != -1;
    }

    public boolean isHideCommand() {
        return requestText != null && (requestText.equals(BotCommands.HIDE_COMMAND.getCommand())
                || requestText.equals(BotLabels.HIDE_MAIN_SCREEN.getLabel()));
    }

    public boolean hasSession() {
        return sessionByChat.get(chatId) != null;
    }
}