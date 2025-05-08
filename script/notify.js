const sounds = {
	attention: {
		audio: new Audio("https://files.catbox.moe/qptxxi.wav"),
		volume: 0.5,
	},
	attention_long: {
		audio: new Audio("https://files.catbox.moe/0h2dp5.wav"),
		volume: 0.5,
	},
	error: {
		audio: new Audio("https://files.catbox.moe/gxj8nh.wav"),
		volume: 0.25,
	},
	pop_on: {
		audio: new Audio("https://files.catbox.moe/upts5m.wav"),
		volume: 0.1,
	},
	pop_off: {
		audio: new Audio("https://files.catbox.moe/r54p0a.wav"),
		volume: 0.1,
	},
	swoosh: {
		audio: new Audio("https://files.catbox.moe/o94ua7.wav"),
		volume: 0.5,
	},
	swoosh_fast: {
		audio: new Audio("https://files.catbox.moe/mdk4f8.wav"),
		volume: 0.5,
	},
	click: {
		audio: new Audio("https://files.catbox.moe/vvia1t.wav"),
		volume: 0.5,
	},
	click_double: {
		audio: new Audio("https://files.catbox.moe/5ncv72.wav"),
		volume: 0.5,
	},
}

for (const sound in sounds) {
	sounds[sound].audio.volume = sounds[sound].volume * 0.1
	sounds[sound].audio.preload = "auto"
}

const notification_types = {
	error: { sound: sounds.error.audio },
	info: { sound: sounds.attention.audio },
	default: { sound: sounds.click.audio },
}

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
}

const in_anim = animation_map.fade
const out_anim = animation_map.pop
const remove_time = 7000

function notificationSounds(type) {
	in_anim.in.sound.play()
	setTimeout(function () {
		notification_types[type].sound.play()
	}, 500)

	const hist = document.querySelector("#notification-history")
	if (!hist.classList.contains("active")) {
		setTimeout(function () {
			out_anim.out.sound.play()
		}, remove_time)
	}
}

var notification_count = 0

function notify(message, type) {
	var notificationSection = document.getElementById("notifications")

	type = typeof type === "undefined" ? "default" : type
	var notificationInner = document.createElement("div")
	notificationInner.className = "notification-inner"

	var notification = document.createElement("div")
	notification.className = "notification"
	notification.classList.add(in_anim.in.class)
	notification.classList.add(out_anim.out.class)

	var notificationHeader = document.createElement("div")
	notificationHeader.className = "notification-header"

	var notificationTitle = document.createElement("h4")
	notificationTitle.className = "notification-title"
	switch (type) {
		case "error":
			notification.classList.add("error")
			notificationTitle.innerHTML = "Error!"
			break
		case "info":
			notification.classList.add("info")
			notificationTitle.innerHTML = "Erm, btw~"
			break
		case "default":
			notification.classList.add("default")
			notificationTitle.innerHTML = "Hey, you!"
			break
	}

	var notificationTime = document.createElement("span")
	notificationTime.className = "notification-time"
	const now = new Date()
	notificationTime.innerHTML = new Intl.DateTimeFormat("en-GB", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		fractionalSecondDigits: 2,
	}).format(now)

	var notificationBody = document.createElement("div")
	notificationBody.className = "notification-body"

	var notificationMessageContainer = document.createElement("div")
	notificationMessageContainer.className = "notification-message-container"

	var notificationMessage = document.createElement("p")
	notificationMessage.className = "notification-message"
	notificationMessage.innerHTML = message

	notificationHeader.appendChild(notificationTitle)
	notificationHeader.appendChild(notificationTime)

	notificationMessageContainer.appendChild(notificationMessage)
	notificationBody.appendChild(notificationMessageContainer)

	notificationInner.appendChild(notificationHeader)
	notificationInner.appendChild(notificationBody)

	notification.appendChild(notificationInner)
	const hist = document.querySelector("#notification-history")
	if (hist.classList.contains("active")) {
		addNotificationToHistory(notification)
	} else {
		notificationSection.prepend(notification)
		setTimeout(function () {
			notification.classList.add("removing")
		}, remove_time)
		setTimeout(function () {
			addNotificationToHistory(notification)
			notification.classList.remove("removing")
		}, remove_time + 1000)
	}

	notificationSounds(type)
}

var showing = false
function notificationCountDisplay() {
	const notificationCountButton = document.getElementById(
		"notification-count-button",
	)

	if (notification_count > 0) {
		showing = true
	}

	if (
		notification_count === 0 ||
		document
			.querySelector("#notifications")
			.querySelectorAll(".notification:not(.history)").length > 0
	) {
		showing = false
	}

	if (
		document.querySelector("#notification-history").classList.contains("active")
	) {
		showing = true
	}

	if (
		document
			.querySelector("#notification-history")
			.classList.contains("active") &&
		notification_count === 0
	) {
		showing = true
	}

	if (showing) {
		notificationCountButton.classList.add("active")
	} else {
		notificationCountButton.classList.remove("active")
	}

	setTimeout(function () {
		notificationCountDisplay()
	}, 1000)
}

function resizeCount() {
	const el = document.querySelector("#notification-count-container")
	if (!el.parentElement) return
	el.style.setProperty("--count-font-size", "1.4rem")
	const { width: max_width, height: max_height } = el.getBoundingClientRect()
	const { width, height } = el.children[0].getBoundingClientRect()
	el.style.setProperty(
		"--count-font-size",
		Math.min(max_width / width, max_height / height) + 0.05 + "rem",
	)
}

document.addEventListener("DOMContentLoaded", function () {
	notificationCountDisplay()

	const countObserver = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.addedNodes.length > 0) {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === Node.TEXT_NODE) {
						resizeCount()
					}
				})
			}
		})
	})
	countObserver.observe(document.querySelector("#notification-count"), {
		childList: true,
		subtree: true,
	})
})

function addNotificationToHistory(notification) {
	var notificationHistory = document.getElementById("notification-history")
	var notificationCount = document.getElementById("notification-count")
	notification.classList.add("history")

	notificationHistory.prepend(notification)
	notification.addEventListener("click", () => {
		notification.classList.add("removing")
		notification.remove()
		out_anim.out.sound.play()
		notification_count -= 1
		notificationCount.textContent = notification_count

		if (notification_count === 0) {
			document.querySelector("#notification-count").classList.remove("active")
			document.querySelector("#notification-check").classList.add("active")
		}
	})

	notification_count += 1
	notificationCount.textContent = notification_count

	document.querySelector("#notification-count").classList.add("active")
	document.querySelector("#notification-check").classList.remove("active")
}

function notificationHistoryButton() {
	historyContainer = document
		.querySelector("#notification-history")
		.classList.toggle("active")
}

function notificationClearButton() {
	clearNotifications()
}

function clearNotifications() {
	document.querySelectorAll(".notification.history").forEach((notification) => {
		notification.remove()
		notification_count = 0
	})
	document
		.querySelector("#notification-history-container")
		.classList.remove("active")
	document.querySelector("#notification-count").classList.remove("active")
	document.querySelector("#notification-check").classList.add("active")
}
