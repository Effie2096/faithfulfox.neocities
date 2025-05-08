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

export default sounds
