package com.springboot.TomaTask.util;

public enum BotMessages {

	HELLO_MYTODO_BOT(
			"Welcome I'm your TomaTask assistant!\nType a new todo item below and press the send button (blue arrow), or select an option below:"),
	INVALID_EMAIL("The email you entered is not valid. Please enter a valid business email."),
	EMAIL_NOT_FOUND(
			"The email you entered is not registered in our system. Please contact your manager."),
	LOGIN_MISSING(
			"Hello! I'm Tomatin Bot! But you can call me Oralif.\nTo use this bot, you must first login. Please insert your business email."),
	OTP_MISSING("Enter your OTP code to complete the login process."),
	INVALID_OTP("The OTP code you entered is not valid. Please try again."),
	ALREADY_LOGGED_IN(
			"You are already logged in! Select /todolist to view your todo items, or /start to go to the main screen."),
	LOGIN_ERROR("An error occurred during login. Please try again later."),
	LOGIN_SUCCESS("Login successful! Select /todolist to view your todo items, or /start to go to the main screen."),
	LOGOUT_SUCCESS("You have been logged out. Select /start or /login to login again."),
	NOT_LOGGED_IN(
			"You are not logged in. Please select /start or /login to login first."),
	BOT_REGISTERED_STARTED("Bot registered and started successfully!"),
	ITEM_DONE("Item done! Select /todolist to return to the list of todo items, or /start to go to the main screen."),
	ITEM_UNDONE(
			"Item undone! Select /todolist to return to the list of todo items, or /start to go to the main screen."),
	ITEM_DELETED(
			"Item deleted! Select /todolist to return to the list of todo items, or /start to go to the main screen."),
	TYPE_NEW_TODO_ITEM("Type a new todo item below and press the send button (blue arrow) on the right-hand side."),
	NEW_ITEM_ADDED(
			"New item added! Select /todolist to return to the list of todo items, or /start to go to the main screen."),
	BYE("Bye! Select /start to resume!");

	private String message;

	BotMessages(String enumMessage) {
		this.message = enumMessage;
	}

	public String getMessage() {
		return message;
	}

}
