package com.springboot.TomaTask.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import org.telegram.telegrambots.longpolling.starter.AfterBotRegistration;
import org.telegram.telegrambots.longpolling.BotSession;
import org.telegram.telegrambots.longpolling.interfaces.LongPollingUpdateConsumer;
import org.telegram.telegrambots.longpolling.starter.SpringLongPollingBot;
import org.telegram.telegrambots.longpolling.util.LongPollingSingleThreadUpdateConsumer;
import org.telegram.telegrambots.meta.api.objects.Update;

import org.telegram.telegrambots.meta.generics.TelegramClient;
import org.telegram.telegrambots.client.okhttp.OkHttpTelegramClient;

import com.springboot.TomaTask.service.TaskService;
import com.springboot.TomaTask.service.UserService;

import com.springboot.TomaTask.util.BotActions;
import com.springboot.TomaTask.config.BotProps;

@Component
public class TaskBotController implements SpringLongPollingBot, LongPollingSingleThreadUpdateConsumer {

	private static final Logger logger = LoggerFactory.getLogger(TaskBotController.class);
	private TaskService taskService;
	private final UserService userService;
	private final TelegramClient telegramClient;

	private final BotProps botProps;

	@Value("${telegram.bot.token}")
	private String telegramBotToken;

	@Override
	public String getBotToken() {
		if (telegramBotToken != null && !telegramBotToken.trim().isEmpty()) {
			return telegramBotToken;
		} else {
			return botProps.getToken();
		}
	}

	public TaskBotController(BotProps bp, TaskService tsvc, UserService usvc) {
		this.botProps = bp;
		telegramClient = new OkHttpTelegramClient(getBotToken());
		taskService = tsvc;
		this.userService = usvc;
	}

	@Override
	public LongPollingUpdateConsumer getUpdatesConsumer() {
		return this;
	}

	@Override
	public void consume(Update update) {

		if (!update.hasMessage() || !update.getMessage().hasText())
			return;

		String messageTextFromTelegram = update.getMessage().getText();
		long chatId = update.getMessage().getChatId();

		logger.info("consume(): received message from chat {}: '{}'", chatId, messageTextFromTelegram);

		BotActions actions = new BotActions(telegramClient, taskService, userService);
		actions.setRequestText(messageTextFromTelegram);
		actions.setChatId(chatId);
		if (actions.getTaskService() == null) {
			logger.info("todosvc error");
			actions.setTaskService(taskService);
		}

		if (actions.getUserService() == null) {
			logger.info("usersvc error");
			actions.setUserService(userService);
		}

		actions.fnStart();
		actions.fnDone();
		actions.fnUndo();
		actions.fnDelete();
		actions.fnHide();
		actions.fnListAll();
		actions.fnAddItem();
		actions.fnLogin();
		actions.fnLogout();
		actions.fnElse();
	}

	@AfterBotRegistration
	public void afterRegistration(BotSession botSession) {
		System.out.println("Registered bot running state is: " + botSession.isRunning());
	}

}
