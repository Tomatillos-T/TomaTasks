package com.springboot.TomaTask.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import org.telegram.telegrambots.longpolling.starter.AfterBotRegistration;
import org.telegram.telegrambots.longpolling.BotSession;
import org.telegram.telegrambots.longpolling.interfaces.LongPollingUpdateConsumer;
import org.telegram.telegrambots.longpolling.starter.SpringLongPollingBot;
import org.telegram.telegrambots.longpolling.util.LongPollingSingleThreadUpdateConsumer;
import org.telegram.telegrambots.meta.api.objects.Update;

import org.telegram.telegrambots.meta.generics.TelegramClient;

import com.springboot.TomaTask.service.TaskService;
import com.springboot.TomaTask.service.UserService;
import com.springboot.TomaTask.service.SprintService;
import com.springboot.TomaTask.service.OtpService;
import com.springboot.TomaTask.service.BotSessionService;

import com.springboot.TomaTask.util.BotActions;
import com.springboot.TomaTask.config.BotProps;

@Component
@Profile("!test")
public class TaskBotController implements SpringLongPollingBot, LongPollingSingleThreadUpdateConsumer {

	private static final Logger logger = LoggerFactory.getLogger(TaskBotController.class);

	private final TaskService taskService;
	private final UserService userService;
	private final SprintService sprintService;
	private final OtpService otpService;
	private final BotSessionService botSessionService;
	private final TelegramClient telegramClient;
	private final BotProps botProps;

	public TaskBotController(
			BotProps botProps,
			TaskService taskService,
			UserService userService,
			SprintService sprintService,
			OtpService otpService,
			BotSessionService botSessionService,
			TelegramClient telegramClient) {
		this.botProps = botProps;
		this.taskService = taskService;
		this.userService = userService;
		this.sprintService = sprintService;
		this.otpService = otpService;
		this.botSessionService = botSessionService;
		this.telegramClient = telegramClient;
	}

	@Override
	public String getBotToken() {
		return botProps.getToken();
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

		BotActions actions = new BotActions(telegramClient, taskService, userService, sprintService, otpService, botSessionService);
		actions.setRequestText(messageTextFromTelegram);
		actions.setChatId(chatId);

		// Controller-driven dispatch using BotActions predicates
		// Priority: if a login pending state exists, let fnLogin handle the message
		if (actions.hasPendingLogin() || actions.isLoginCommand()) {
			actions.fnLogin();
			return;
		}

		// Logout handled first if explicit
		if (actions.isLogoutCommand()) {
			actions.fnLogout();
			return;
		}

		// Start / introduction
		if (actions.isStartCommand()) {
			if (actions.hasSession()) {
				actions.fnStart();
			} else {
				actions.fnLogin();
			}
			return;
		}

		// Handle sprint selection during task creation
		if (actions.isAwaitingSprintSelection()) {
			actions.fnSprintSelection();
			return;
		}

		// List items
		if (actions.isListCommand()) {
			if (actions.hasSession()) {
				actions.fnListAll();
			} else {
				actions.fnLogin();
			}
			return;
		}

		// Add item flow
		if (actions.isAddCommand()) {
			if (actions.hasSession()) {
				actions.fnAddItem();
			} else {
				actions.fnLogin();
			}
			return;
		}

		// Done / Undo / Delete commands (contain the action label)
		if (actions.containsDone()) {
			if (actions.hasSession()) {
				actions.fnDone();
			} else {
				actions.fnLogin();
			}
			return;
		}

		if (actions.containsUndo()) {
			if (actions.hasSession()) {
				actions.fnUndo();
			} else {
				actions.fnLogin();
			}
			return;
		}

		if (actions.containsDelete()) {
			if (actions.hasSession()) {
				actions.fnDelete();
			} else {
				actions.fnLogin();
			}
			return;
		}

		// Hide
		if (actions.isHideCommand()) {
			actions.fnHide();
			return;
		}

		// If user has a session, fallback to fnElse to create a new item; otherwise
		// prompt login
		if (actions.hasSession()) {
			actions.fnElse();
			return;
		} else {
			// No session and no other command matched -> prompt login
			actions.fnLogin();
			return;
		}
	}

	@AfterBotRegistration
	public void afterRegistration(BotSession botSession) {
		System.out.println("Registered bot running state is: " + botSession.isRunning());
	}

}
