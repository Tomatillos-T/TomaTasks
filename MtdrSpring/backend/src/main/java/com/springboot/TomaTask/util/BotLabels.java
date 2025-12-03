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
	NO_SPRINT("Sin Sprint"),
	CANCEL("Cancelar"),

	// Task Status labels
	STATUS_PREFIX("STATUS:"),
	STATUS_TODO("📋 Por Hacer"),
	STATUS_IN_PROGRESS("🔄 En Progreso"),
	STATUS_PENDING("⏸️ Pendiente"),
	STATUS_TESTING("🧪 En Pruebas"),

	// Task Priority labels
	PRIORITY_PREFIX("PRIORITY:"),
	PRIORITY_LOW("🟢 Baja"),
	PRIORITY_MODERATE("🟡 Moderada"),
	PRIORITY_HIGH("🟠 Alta"),
	PRIORITY_URGENT("🔴 Urgente"),

	// Task Estimation labels (T-shirt sizes)
	ESTIMATION_PREFIX("ESTIMATION:"),
	ESTIMATION_XS("XS - Extra Pequeño"),
	ESTIMATION_S("S - Pequeño"),
	ESTIMATION_M("M - Mediano"),
	ESTIMATION_L("L - Grande"),
	ESTIMATION_XL("XL - Extra Grande"),
	ESTIMATION_XXL("XXL - Muy Grande");

	private String label;

	BotLabels(String enumLabel) {
		this.label = enumLabel;
	}

	public String getLabel() {
		return label;
	}

}
