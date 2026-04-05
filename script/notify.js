import { sounds } from "./sounds.js";

const notification_types = {
	error: { sound: sounds.error.audio },
	info: { sound: sounds.attention.audio },
	default: { sound: sounds.click.audio },
};

const animation_map = {
	fade: {
		in: {
			class: "fade_on",
			sound: sounds.swoosh_fast.audio,
		},
		out: {
			class: "fade_off",
			sound: sounds.swoosh.audio,
		},
	},
	expand: {
		in: {
			class: "expand_on",
			sound: sounds.swoosh_fast.audio,
		},
		out: {
			class: "shrink_off",
			sound: sounds.swoosh.audio,
		},
	},
	pop: {
		in: {
			class: "pop_on",
			sound: sounds.pop_on.audio,
		},
		out: {
			class: "pop_off",
			sound: sounds.pop_off.audio,
		},
	},
};

const in_anim = animation_map.fade;
const out_anim = animation_map.pop;
const remove_time = 7000;

function notificationSounds(type) {
	in_anim.in.sound.play();
	setTimeout(() => {
		notification_types[type].sound.play();
	}, 500);

	const hist = document.querySelector("#notification-history");
	if (!hist.classList.contains("active")) {
		setTimeout(() => {
			out_anim.out.sound.play();
		}, remove_time);
	}
}

var notification_count = 0;

export function notify(message, type) {
	var notificationSection = document.getElementById("notifications");

	type = typeof type === "undefined" ? "default" : type;
	var notificationInner = document.createElement("div");
	notificationInner.className = "notification-inner";

	var notification = document.createElement("div");
	notification.className = "notification";
	notification.classList.add(in_anim.in.class);
	notification.classList.add(out_anim.out.class);

	var notificationHeader = document.createElement("div");
	notificationHeader.className = "notification-header";

	var notificationTitle = document.createElement("h4");
	notificationTitle.className = "notification-title";
	switch (type) {
		case "error":
			notification.classList.add("error");
			notificationTitle.innerHTML = "Error!";
			break;
		case "info":
			notification.classList.add("info");
			notificationTitle.innerHTML = "Erm, btw~";
			break;
		case "default":
			notification.classList.add("default");
			notificationTitle.innerHTML = "Hey, you!";
			break;
	}

	var notificationTime = document.createElement("span");
	notificationTime.className = "notification-time";
	const now = new Date();
	notificationTime.innerHTML = new Intl.DateTimeFormat("en-GB", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		fractionalSecondDigits: 2,
	}).format(now);

	var notificationBody = document.createElement("div");
	notificationBody.className = "notification-body";

	var notificationMessageContainer = document.createElement("div");
	notificationMessageContainer.className = "notification-message-container";

	var notificationMessage = document.createElement("p");
	notificationMessage.className = "notification-message";
	notificationMessage.innerHTML = message;

	notificationHeader.appendChild(notificationTitle);
	notificationHeader.appendChild(notificationTime);

	notificationMessageContainer.appendChild(notificationMessage);
	notificationBody.appendChild(notificationMessageContainer);

	notificationInner.appendChild(notificationHeader);
	notificationInner.appendChild(notificationBody);

	notification.appendChild(notificationInner);
	const hist = document.querySelector("#notification-history");
	if (hist.classList.contains("active")) {
		addNotificationToHistory(notification);
	} else {
		notificationSection.prepend(notification);
		setTimeout(() => {
			notification.classList.add("removing");
		}, remove_time);
		setTimeout(() => {
			addNotificationToHistory(notification);
			notification.classList.remove("removing");
		}, remove_time + 1000);
	}

	notificationSounds(type);
}

var showing = false;
function notificationCountDisplay() {
	const notificationCountButton = document.getElementById(
		"notification-count-button",
	);

	if (notification_count > 0) {
		showing = true;
	}

	if (
		notification_count === 0 ||
		document
			.querySelector("#notifications")
			.querySelectorAll(".notification:not(.history)").length > 0
	) {
		showing = false;
	}

	if (
		document.querySelector("#notification-history").classList.contains("active")
	) {
		showing = true;
	}

	if (
		document
			.querySelector("#notification-history")
			.classList.contains("active") &&
		notification_count === 0
	) {
		showing = true;
	}

	if (showing) {
		notificationCountButton.classList.add("active");
	} else {
		notificationCountButton.classList.remove("active");
	}

	setTimeout(() => {
		notificationCountDisplay();
	}, 1000);
}

function resizeCount() {
	const el = document.querySelector("#notification-count-container");
	if (!el.parentElement) return;
	el.style.setProperty("--count-font-size", "1.4rem");
	const { width: max_width, height: max_height } = el.getBoundingClientRect();
	const { width, height } = el.children[0].getBoundingClientRect();
	el.style.setProperty(
		"--count-font-size",
		`${Math.min(max_width / width, max_height / height) + 0.05}rem`,
	);
}

function addNotificationToHistory(notification) {
	var notificationHistory = document.getElementById("notification-history");
	var notificationCount = document.getElementById("notification-count");
	notification.classList.add("history");

	notificationHistory.prepend(notification);
	notification.addEventListener("click", () => {
		notification.classList.add("removing");
		out_anim.out.sound.play();
		setTimeout(() => {
			notification.remove();
			notification_count -= 1;
			notificationCount.textContent = notification_count;
			if (notification_count === 0) {
				document
					.querySelector("#notification-count")
					.classList.remove("active");
				document.querySelector("#notification-check").classList.add("active");
			}
		}, 1000);
	});

	notification_count += 1;
	notificationCount.textContent = notification_count;

	document.querySelector("#notification-count").classList.add("active");
	document.querySelector("#notification-check").classList.remove("active");
}

function notificationHistoryButton() {
	document.querySelector("#notifications").classList.toggle("active");
	document.querySelector("#notification-history").classList.toggle("active");
}

function notificationClearButton() {
	clearNotifications();
}

function clearNotifications() {
	document.querySelectorAll(".notification.history").forEach((notification) => {
		notification.remove();
	});
	notification_count = 0;
	// document
	// 	.querySelector("#notification-history-container")
	// 	.classList.remove("active");
	document.querySelector("#notification-count").classList.remove("active");
	document.querySelector("#notification-check").classList.add("active");
}

function createNotifications() {
	const notifications = document.createElement("div");
	notifications.id = "notifications";

	const historyContainer = document.createElement("div");
	historyContainer.id = "notification-history-container";

	const history = document.createElement("div");
	history.id = "notification-history";

	const buttonsContainer = document.createElement("div");
	buttonsContainer.id = "notification-buttons-container";

	// Clear button
	const clearButton = document.createElement("div");
	clearButton.id = "notification-clear-button";
	clearButton.className = "toolbar-button";

	clearButton.addEventListener("mouseover", (event) => {
		tooltip(event.currentTarget, "Clear All", "");
	});
	clearButton.addEventListener("click", () => {
		notificationClearButton();
	});

	const clearIcon = document.createElement("span");
	clearIcon.id = "notification-clear";
	clearIcon.className = "icon";
	clearIcon.textContent = "󰎟";

	clearButton.appendChild(clearIcon);

	// Count button
	const countButton = document.createElement("div");
	countButton.id = "notification-count-button";
	countButton.className = "toolbar-button";
	countButton.addEventListener("click", () => {
		notificationHistoryButton();
	});
	countButton.addEventListener("mouseover", (event) => {
		tooltip(event.currentTarget, "History Toggle", "");
	});

	const countContainer = document.createElement("div");
	countContainer.id = "notification-count-container";

	const count = document.createElement("span");
	count.id = "notification-count";
	count.className = "active";
	count.textContent = "0";

	countContainer.appendChild(count);

	const checkIcon = document.createElement("span");
	checkIcon.id = "notification-check";
	checkIcon.className = "icon";
	checkIcon.textContent = "";

	countButton.appendChild(countContainer);
	countButton.appendChild(checkIcon);

	// Assemble structure
	buttonsContainer.appendChild(clearButton);
	buttonsContainer.appendChild(countButton);

	historyContainer.appendChild(history);
	historyContainer.appendChild(buttonsContainer);

	notifications.appendChild(historyContainer);

	return notifications;
}

document.addEventListener("DOMContentLoaded", () => {
	const toolbar = document.querySelector("#toolbar");
	toolbar.appendChild(createNotifications());

	notificationCountDisplay();

	const countObserver = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.addedNodes.length > 0) {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === Node.TEXT_NODE) {
						resizeCount();
					}
				});
			}
		});
	});
	countObserver.observe(document.querySelector("#notification-count"), {
		childList: true,
		subtree: true,
	});
});
