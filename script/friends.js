import sounds from "./sounds.js"

document.querySelectorAll(".friend-tab").forEach((friend) => {
	friend.addEventListener("click", () => {
		document.querySelectorAll(".friend-page").forEach((page) => {
			page.classList.remove("active")
		})
		document.querySelectorAll(".personal-board").forEach((board) => {
			board.classList.remove("active")
		})
		addPins()
		document.querySelector(`#${friend.id}-page`).classList.add("active")
		document.querySelector(`#${friend.id}-board`).classList.add("active")
		sounds.swoosh.audio.play()
	})
})

var addPins = function () {
	document.querySelectorAll(".personal-board .pin").forEach((pin) => {
		if (!pin.querySelector(".pin-img")) {
			const pinImg = document.createElement("img")
			pinImg.classList.add("pin-img")
			pinImg.src = "/assets/img/pin.png"

			pinImg.style.position = "absolute"
			pinImg.style.width = "2rem"
			pinImg.style.height = "2rem"
			pinImg.style.top = "-0.4rem"
			pinImg.style.left = "50%"
			pinImg.style.transform = "translateX(-50%)"

			pin.appendChild(pinImg)
		}
	})
}

document.addEventListener("DOMContentLoaded", function () {
	addPins()
})
