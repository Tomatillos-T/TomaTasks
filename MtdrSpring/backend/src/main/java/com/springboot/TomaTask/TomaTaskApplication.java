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

import com.springboot.TomaTask.model.User;
import com.springboot.TomaTask.service.UserService;

import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@SpringBootApplication
@ConfigurationPropertiesScan
@Controller
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

  @Bean
  public CommandLineRunner initBot() {
      return args -> {
          try {
              TelegramBotsApi telegramBotsApi = new TelegramBotsApi(DefaultBotSession.class);
              telegramBotsApi.registerBot(new ToDoItemBotController(telegramBotToken, botName, toDoItemService));
              logger.info(BotMessages.BOT_REGISTERED_STARTED.getMessage());
          } catch (TelegramApiException e) {
              logger.error("Failed to register Telegram bot: {}", e.getMessage(), e);
          }
      };
  }

  /**
  * Redirect any non-API routes to root (for frontend SPA handling).
  */
	@GetMapping("/**/{path:[^\\.]*}")
	public String redirectApi() {
		return "forward:/";
	}

	@RequestMapping(value = "/{_:^api$}/**")
	public String send404() {
		throw new ResponseStatusException(HttpStatus.NOT_FOUND);
	}
}