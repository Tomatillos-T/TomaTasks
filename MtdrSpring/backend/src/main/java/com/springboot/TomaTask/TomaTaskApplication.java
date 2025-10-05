package com.springboot.TomaTask;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.springboot.TomaTask.config.BotProps;

@SpringBootApplication
@EnableConfigurationProperties(BotProps.class)
public class TomaTaskApplication {

    public static void main(String[] args) {
        SpringApplication.run(TomaTaskApplication.class, args);
    }

}
