package com.springboot.TomaTask.util;

import org.telegram.telegrambots.meta.generics.TelegramClient;
import org.telegram.telegrambots.client.okhttp.OkHttpTelegramClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.springboot.TomaTask.config.BotProps;


@Configuration
public class BotClient {

    @Bean
    public TelegramClient telegramClient(BotProps botProps) {
        return new OkHttpTelegramClient(botProps.getToken());
    }
}