package com.springboot.TomaTask.util;

public enum BotMessages {

	HELLO_MYTODO_BOT(
			"Welcome I'm your TomaTask assistant!\nType a new todo item below and press the send button (blue arrow), or select an option below:"),
	INVALID_EMAIL("The email you entered is not valid. Please enter a valid business email."),
	EMAIL_NOT_FOUND(
			"The email you entered is not registered in our system. Please contact your manager."),
	LOGIN_MISSING(
			"Hello! I'm Tomatin Bot! But you can call me Oralif.\nTo use this bot, you must first login. Please insert your business email."),
	LOGIN_PROMPT("Please enter your business email to login:"),
	OTP_PROMPT("Please enter your 6-digit verification code from the web application:"),
	INVALID_OTP("The OTP code you entered is not valid or has expired. Please try again or type /login to request a new code."),
	ALREADY_LOGGED_IN(
			"You are already logged in! Select /todolist to view your todo items, or /start to go to the main screen."),
	LOGIN_ERROR("An error occurred during login. Please try again later."),
	LOGIN_SUCCESS("Login successful! Select /todolist to view your todo items, or /start to go to the main screen."),
	LOGOUT_SUCCESS("You have been logged out. Select /start or /login to login again."),
	NOT_LOGGED_IN(
			"You are not logged in. Please select /start or /login to login first."),
	ITEM_DONE("Item done! Select /todolist to return to the list of todo items, or /start to go to the main screen."),
	ITEM_UNDONE(
			"Item undone! Select /todolist to return to the list of todo items, or /start to go to the main screen."),
	ITEM_DELETED(
			"Item deleted! Select /todolist to return to the list of todo items, or /start to go to the main screen."),
	TYPE_NEW_TODO_ITEM("Type a new todo item below and press the send button (blue arrow) on the right-hand side."),
	NEW_ITEM_ADDED(
			"New item added! Select /todolist to return to the list of todo items, or /start to go to the main screen."),
	BYE("Bye! Select /start to resume!"),
	// Error messages for operations
	ERROR_TASK_NOT_FOUND("Could not find the task. It may have been deleted. Select /todolist to refresh."),
	ERROR_TASK_UPDATE("An error occurred while updating the task. Please try again."),
	ERROR_TASK_DELETE("An error occurred while deleting the task. Please try again."),
	ERROR_TASK_CREATE("An error occurred while creating the task. Please try again."),
	// Task creation flow messages
	ENTER_TASK_NAME("📝 Escribe el nombre de la tarea:"),
	SELECT_STATUS("📊 Selecciona el estado de la tarea:"),
	SELECT_PRIORITY("⚡ Selecciona la prioridad de la tarea:"),
	SELECT_ESTIMATION("📐 Selecciona la estimación de la tarea:"),
	SELECT_SPRINT("🏃 Selecciona el sprint para tu tarea (solo sprints activos):"),
	NO_SPRINTS_AVAILABLE("⚠️ No hay sprints activos disponibles. La tarea se creará sin sprint asignado."),
	TASK_NAME_SAVED("✅ Nombre guardado. Ahora selecciona el estado:"),
	STATUS_SELECTED("✅ Estado seleccionado. Ahora selecciona la prioridad:"),
	PRIORITY_SELECTED("✅ Prioridad seleccionada. Ahora selecciona la estimación:"),
	ESTIMATION_SELECTED("✅ Estimación seleccionada. Ahora selecciona el sprint:"),
	SPRINT_SELECTED("✅ Sprint seleccionado. Creando tarea..."),
	TASK_CREATION_CANCELLED("❌ Creación de tarea cancelada.");

	private String message;

	BotMessages(String enumMessage) {
		this.message = enumMessage;
	}

	public String getMessage() {
		return message;
	}

}
