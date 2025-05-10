function pausePlayers(excludePlayer, excludeBtn) {
	document.querySelectorAll(".player").forEach((player) => {
		if (player !== excludePlayer) {
			player.pause()
		}
	})
	document.querySelectorAll(".player-btn").forEach((btn) => {
		if (btn !== excludeBtn) {
			btn.innerHTML = ""
		}
	})
}

function playSecret() {
	return new Promise(function (resolve) {
		window.secret.addEventListener("ended", function () {
			resolve()
		})
		window.secret.play()
	})
}

function playButton(name) {
	var elem = document.getElementById(name)
	var btn = document.getElementById(`${name}-btn`)

	pausePlayers(elem, btn)

	if (name === "player4") {
		const mugshot = document.getElementById("mugshot-link")
		mugshot.classList.toggle("active")
		if (window.startSound.currentTime > 0 && !window.startSound.paused) {
			setTimeout(function () {
				window.startSound.pause()
				window.startSound.currentTime = 0
			}, 100)
		}
		if (elem.paused) {
			// Play start sound before main audio
			window.startSound.play()
			window.startSound.addEventListener("ended", function () {
				elem.play()
			})
		} else {
			// Play pause sound when paused
			window.pauseSound.play()
			elem.pause()
			elem.currentTime = 0
		}
	} else {
		// Play or pause the main audio
		if (elem.paused) {
			elem.play()
			btn.innerHTML = ""
		} else {
			elem.pause()
			btn.innerHTML = ""
		}
	}
}

function easteregg(player) {
	var egg = document.getElementById("easteregg")
	const hudBackground = document.querySelector("#hud")
	if (player.paused) {
		document.body.style.backgroundImage =
			"url('/assets/img/shrines/doom2/doom2background.jpg')"
		document.body.style.animation = ""
		egg.style.display = "none"
		hudBackground.style.setProperty("--fire-display", "none")
	} else {
		document.body.style.backgroundImage = ""
		document.body.style.animation = "easteregg 0.2s linear infinite"
		egg.style.display = "flex"
		hudBackground.style.setProperty("--fire-display", "block")
	}
}
