package com.springboot.TomaTask.util;

public enum BotCommands {

	START_COMMAND("/start"),
	LOGIN_COMMAND("/login"),
	LOGOUT_COMMAND("/logout"),
	HIDE_COMMAND("/hide"), 
	TODO_LIST("/todolist"),
	ADD_ITEM("/additem");

	private String command;

	BotCommands(String enumCommand) {
		this.command = enumCommand;
	}

	public String getCommand() {
		return command;
	}
}
