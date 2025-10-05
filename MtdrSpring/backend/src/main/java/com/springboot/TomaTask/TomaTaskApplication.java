package com.springboot.TomaTask;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import org.telegram.telegrambots.updatesreceivers.DefaultBotSession;

import com.springboot.TomaTask.controller.ToDoItemBotController;
import com.springboot.TomaTask.service.ToDoItemService;
import com.springboot.TomaTask.util.BotMessages;

@SpringBootApplication
public class TomaTaskApplication implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(TomaTaskApplication.class);

    private final ToDoItemService toDoItemService;
    private final String telegramBotToken;
    private final String botName;

    public TomaTaskApplication(
            ToDoItemService toDoItemService,
            @Value("${telegram.bot.token}") String telegramBotToken,
            @Value("${telegram.bot.name}") String botName) {
        this.toDoItemService = toDoItemService;
        this.telegramBotToken = telegramBotToken;
        this.botName = botName;
    }

    public static void main(String[] args) {
        SpringApplication.run(TomaTaskApplication.class, args);
    }

    @Override
    public void run(String... args) {
        try {
            TelegramBotsApi telegramBotsApi = new TelegramBotsApi(DefaultBotSession.class);
            telegramBotsApi.registerBot(new ToDoItemBotController(telegramBotToken, botName, toDoItemService));
            logger.info(BotMessages.BOT_REGISTERED_STARTED.getMessage());
        } catch (TelegramApiException e) {
            logger.error("Failed to register Telegram bot: {}", e.getMessage(), e);
        }
    }
}
