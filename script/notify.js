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
	setTimeout(function () {
		out_anim.out.sound.play()
	}, remove_time)
}

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

	notificationSection.prepend(notification)

	notificationSounds(type)
	setTimeout(function () {
		notification.classList.add("removing")
	}, remove_time)
	setTimeout(function () {
		notification.remove()
	}, remove_time + 1000)
}
