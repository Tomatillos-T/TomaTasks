package com.springboot.TomaTask.util;

public enum BotLabels {

	LOGIN("Login"),
	LOGOUT("Logout"),
	INTRODUCTION("Botomato Introduction"),
	HIDE_MAIN_SCREEN("Hide Main Screen"),
	LIST_ALL_ITEMS("List All Items"),
	ADD_NEW_ITEM("Add New Item"),
	DONE("DONE"),
	UNDO("UNDO"),
	DELETE("DELETE"),
	MY_TODO_LIST("MY TODO LIST"),
	DASH("-"),
	SPRINT_PREFIX("SPRINT:"),
	NO_SPRINT("No Sprint"),
	CANCEL("Cancel");

	private String label;

	BotLabels(String enumLabel) {
		this.label = enumLabel;
	}

	public String getLabel() {
		return label;
	}

}
