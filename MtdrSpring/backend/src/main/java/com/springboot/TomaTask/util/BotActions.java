package com.springboot.TomaTask.util;

import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardRow;
import org.telegram.telegrambots.meta.generics.TelegramClient;

import com.springboot.TomaTask.model.ToDoItem;
import com.springboot.TomaTask.service.ToDoItemService;
import com.springboot.TomaTask.service.UserService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.ArrayList;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import java.time.OffsetDateTime;
import com.springboot.TomaTask.model.User;

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
    boolean exit;

    UserService userService;
    ToDoItemService todoService;

    public BotActions(TelegramClient tc, ToDoItemService ts, UserService us) {
        telegramClient = tc;
        todoService = ts;
        userService = us;
        exit = false;
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

    public void setTodoService(ToDoItemService tsvc) {
        todoService = tsvc;
    }

    public ToDoItemService getTodoService() {
        return todoService;
    }

    public void setUserService(UserService usvc) {
        userService = usvc;
    }

    public UserService getUserService() {
        return userService;
    }

    private boolean ensureLoggedIn() {
        // check if there's an existing session for this chat
        User s = sessionByChat.get(chatId);
        if (s != null) {
            logger.info("Found existing session for chat {}: user={}", chatId, s.getEmail());
            return true;
        }

        // otherwise try to process a login flow from the incoming message
        fnLogin();
        s = sessionByChat.get(chatId);
        if (s != null) {
            logger.info("Session created after fnLogin for chat {}: user={}", chatId, s.getEmail());
            return true;
        }
        return false;
    }

    private void runIfLoggedIn(Runnable action) {
        if (!ensureLoggedIn())
            return;
        action.run();
    }

    public void fnLogin() {
        if (exit)
            return;

        String pending = loginState.get(chatId);
        logger.info("fnLogin called for chatId={} requestText='{}' pending='{}' sessionPresent={}", chatId,
                requestText, pending, sessionByChat.containsKey(chatId));
        if (pending != null) {
            if (LoginState.AWAITING_EMAIL.name().equals(pending)) {
                String email = requestText.trim();
                if (!email.contains("@") || !email.contains(".")) {
                    BotHelper.sendMessageToTelegram(chatId, BotMessages.INVALID_EMAIL.getMessage(), telegramClient,
                            null);
                    exit = true;
                    return;
                } else if (!userService.emailExsist(email)) {
                    BotHelper.sendMessageToTelegram(chatId, BotMessages.EMAIL_NOT_FOUND.getMessage(), telegramClient,
                            null);
                    exit = true;
                    return;
                }

                loginState.put(chatId, email);

                // otpService.createAndSendOtp(email);
                BotHelper.sendMessageToTelegram(chatId, BotMessages.OTP_MISSING.getMessage(), telegramClient,
                        null);
                exit = true;
                return;
            }

            // Otherwise pending holds the email itself and the current requestText should
            // be the OTP
            String email = pending;
            String otp = requestText.trim();
            // boolean ok = otpService.validateOtp(email, otp);
            if ("142356".equals(otp)) {
                User u = userService.findByEmail(email);
                if (u == null) {
                    BotHelper.sendMessageToTelegram(chatId, BotMessages.LOGIN_ERROR.getMessage(), telegramClient,
                            null);
                    exit = true;
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
            exit = true;
            return;
        }

        if (sessionByChat.get(chatId) != null) {
            BotHelper.sendMessageToTelegram(chatId, BotMessages.ALREADY_LOGGED_IN.getMessage(), telegramClient,
                    null);
            exit = true;
            return;
        }

        // No pending state: if the incoming message is the login command or we need to
        // prompt for login,
        // ask the user for their business email and set the awaiting state.
        if (!(requestText.equals(BotCommands.LOGIN_COMMAND.getCommand())
                || requestText.equals(BotLabels.LOGIN.getLabel()))) {
            BotHelper.sendMessageToTelegram(chatId, BotMessages.LOGIN_MISSING.getMessage(), telegramClient,
                    null);
            loginState.put(chatId, LoginState.AWAITING_EMAIL.name());
            exit = true;
            return;
        }
    }

    public void fnStart() {
        if (!(requestText.equals(BotCommands.START_COMMAND.getCommand())
                || requestText.equals(BotLabels.INTRODUCTION.getLabel())) || exit)
            return;

        runIfLoggedIn(() -> {
            BotHelper.sendMessageToTelegram(chatId, BotMessages.HELLO_MYTODO_BOT.getMessage(), telegramClient,
                    ReplyKeyboardMarkup
                            .builder()
                            .keyboardRow(
                                    new KeyboardRow(BotLabels.LIST_ALL_ITEMS.getLabel(),
                                            BotLabels.ADD_NEW_ITEM.getLabel()))
                            .keyboardRow(new KeyboardRow(BotLabels.INTRODUCTION.getLabel(),
                                    BotLabels.HIDE_MAIN_SCREEN.getLabel()))
                            .build());
            exit = true;
        });
    }

    public void fnDone() {
        if (!(requestText.indexOf(BotLabels.DONE.getLabel()) != -1) || exit)
            return;

        runIfLoggedIn(() -> {
            String done = requestText.substring(0, requestText.indexOf(BotLabels.DASH.getLabel()));
            Integer id = Integer.valueOf(done);
            try {
                ToDoItem item = todoService.getToDoItemById(id);
                item.setDone(true);
                todoService.updateToDoItem(id, item);
                BotHelper.sendMessageToTelegram(chatId, BotMessages.ITEM_DONE.getMessage(), telegramClient);
            } catch (Exception e) {
                logger.error(e.getLocalizedMessage(), e);
            }
            exit = true;
        });
    }

    public void fnUndo() {
        if (requestText.indexOf(BotLabels.UNDO.getLabel()) == -1 || exit)
            return;

        runIfLoggedIn(() -> {
            String undo = requestText.substring(0,
                    requestText.indexOf(BotLabels.DASH.getLabel()));
            Integer id = Integer.valueOf(undo);
            try {
                ToDoItem item = todoService.getToDoItemById(id);
                item.setDone(false);
                todoService.updateToDoItem(id, item);
                BotHelper.sendMessageToTelegram(chatId, BotMessages.ITEM_UNDONE.getMessage(), telegramClient);
            } catch (Exception e) {
                logger.error(e.getLocalizedMessage(), e);
            }
            exit = true;
        });
    }

    public void fnDelete() {
        if (requestText.indexOf(BotLabels.DELETE.getLabel()) == -1 || exit)
            return;

        runIfLoggedIn(() -> {
            String delete = requestText.substring(0,
                    requestText.indexOf(BotLabels.DASH.getLabel()));
            Integer id = Integer.valueOf(delete);
            try {
                todoService.deleteToDoItem(id);
                BotHelper.sendMessageToTelegram(chatId, BotMessages.ITEM_DELETED.getMessage(), telegramClient);
            } catch (Exception e) {
                logger.error(e.getLocalizedMessage(), e);
            }
            exit = true;
        });
    }

    public void fnHide() {
        if (requestText.equals(BotCommands.HIDE_COMMAND.getCommand())
                || requestText.equals(BotLabels.HIDE_MAIN_SCREEN.getLabel()) && !exit) {
            BotHelper.sendMessageToTelegram(chatId, BotMessages.BYE.getMessage(), telegramClient);
            loginState.remove(chatId);
            sessionByChat.remove(chatId);
        } else
            return;
        exit = true;
    }

    public void fnListAll() {
        if (!(requestText.equals(BotCommands.TODO_LIST.getCommand())
                || requestText.equals(BotLabels.LIST_ALL_ITEMS.getLabel())
                || requestText.equals(BotLabels.MY_TODO_LIST.getLabel())) || exit)
            return;
        runIfLoggedIn(() -> {
            logger.info("todoSvc: " + todoService);
            List<ToDoItem> allItems = todoService.findAll();
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

            List<ToDoItem> activeItems = allItems.stream().filter(item -> item.isDone() == false)
                    .collect(Collectors.toList());

            for (ToDoItem item : activeItems) {
                KeyboardRow currentRow = new KeyboardRow();
                currentRow.add(item.getDescription());
                currentRow.add(item.getID() + BotLabels.DASH.getLabel() + BotLabels.DONE.getLabel());
                keyboard.add(currentRow);
            }

            List<ToDoItem> doneItems = allItems.stream().filter(item -> item.isDone() == true)
                    .collect(Collectors.toList());

            for (ToDoItem item : doneItems) {
                KeyboardRow currentRow = new KeyboardRow();
                currentRow.add(item.getDescription());
                currentRow.add(item.getID() + BotLabels.DASH.getLabel() + BotLabels.UNDO.getLabel());
                currentRow.add(item.getID() + BotLabels.DASH.getLabel() + BotLabels.DELETE.getLabel());
                keyboard.add(currentRow);
            }

            // command back to main screen
            KeyboardRow mainScreenRowBottom = new KeyboardRow();
            mainScreenRowBottom.add(BotLabels.LOGOUT.getLabel());
            keyboard.add(mainScreenRowBottom);

            keyboardMarkup.setKeyboard(keyboard);

            BotHelper.sendMessageToTelegram(chatId, BotLabels.MY_TODO_LIST.getLabel(), telegramClient, keyboardMarkup);//
            exit = true;
        });
    }

    public void fnAddItem() {
        if (!(requestText.contains(BotCommands.ADD_ITEM.getCommand())
                || requestText.contains(BotLabels.ADD_NEW_ITEM.getLabel())) || exit)
            return;

        runIfLoggedIn(() -> {
            logger.info("Adding item by BotHelper");
            BotHelper.sendMessageToTelegram(chatId, BotMessages.TYPE_NEW_TODO_ITEM.getMessage(), telegramClient);
            exit = true;
        });
    }

    public void fnElse() {
        if (exit || sessionByChat.get(chatId) == null)
            return;
        runIfLoggedIn(() -> {
            ToDoItem newItem = new ToDoItem();
            newItem.setDescription(requestText);
            newItem.setCreation_ts(OffsetDateTime.now());
            newItem.setDone(false);
            todoService.addToDoItem(newItem);

            BotHelper.sendMessageToTelegram(chatId, BotMessages.NEW_ITEM_ADDED.getMessage(), telegramClient, null);
            exit = true;
        });
    }
}