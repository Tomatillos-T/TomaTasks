package com.springboot.TomaTask;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.springboot.TomaTask.config.BotProps;

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
@EnableConfigurationProperties(BotProps.class)
public class TomaTaskApplication {

  public static void main(String[] args) {
      SpringApplication.run(TomaTaskApplication.class, args);
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
