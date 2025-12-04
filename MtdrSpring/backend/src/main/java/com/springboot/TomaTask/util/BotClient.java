package com.springboot.TomaTask.util;

import org.telegram.telegrambots.meta.generics.TelegramClient;
import org.telegram.telegrambots.client.okhttp.OkHttpTelegramClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import com.springboot.TomaTask.config.BotProps;

/**
 * Configuration class that provides the TelegramClient bean for dependency injection.
 * This ensures a single TelegramClient instance is used throughout the application.
 */
@Configuration
@Profile("!test")
public class BotClient {

    @Bean
    public TelegramClient telegramClient(BotProps botProps) {
        return new OkHttpTelegramClient(botProps.getToken());
    }
}
