function openTab(evt, tabName) {
	var i, tabcontent, tablinks

	tabcontent = document.getElementsByClassName("tab-content")
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none"
	}

	tablinks = document.getElementsByClassName("tablinks")
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "")
	}

	document.getElementById(tabName).style.display = "block"
	evt.currentTarget.className += " active"
}

function toggleCollapsible(caller) {
	const collapsibles = document
		.querySelectorAll(".collapsible-container")
		.forEach((collapsible) => {
			if (collapsible !== caller.parentNode) {
				collapsible.classList.remove("active")
			}
		})
	caller.parentNode.classList.toggle("active")
}

function toggleHUD() {
	const hud = document.getElementById("hud")
	const hudToggle = document.getElementById("hud-toggle")
	hudToggle.querySelector("span").innerHTML =
		hudToggle.innerHTML === "open" ? "close" : "close"
	toggleActive(hud)
	toggleActive(hudToggle)
}

function toggleActive(element) {
	element.classList.toggle("active")
}

window.onload = function () {
	window.secretHasEnded = false
	window.startSound = new Audio("https://files.catbox.moe/s1s1k8.mp3")
	window.startSound.preload = "auto"
	window.startSound.volume = 0.25

	window.pauseSound = new Audio("https://files.catbox.moe/ck2msq.wav")
	window.pauseSound.preload = "auto"
	window.pauseSound.volume = 0.25

	var player4 = document.getElementById("player4")
	player4.addEventListener("play", () => {
		easteregg(player4)
	})
	player4.addEventListener("pause", () => {
		easteregg(player4)
	})

	document.body.style.backgroundImage =
		"url('/assets/img/shrines/doom2/doom2background.jpg')"

	const tabLinks = document.querySelectorAll(".tablinks")

	tabLinks.forEach((link) => {
		link.addEventListener("click", () => {
			const content = document.querySelector("#content")
			if (content.scrollTop > 205) {
				content.scrollTop = 205
			}
		})
	})
	;[
		document.getElementById("caco-container"),
		document.getElementById("hellknight-container"),
		document.getElementById("pinky-container"),
	].forEach((container) => {
		container.addEventListener("click", () => {
			toggleActive(container)
		})
	})

	document.querySelectorAll(".censor").forEach((censor) => {
		censor.addEventListener("click", () => {
			censor.classList.toggle("active")
		})
	})
}

document.getElementById("defaultOpen").click()
