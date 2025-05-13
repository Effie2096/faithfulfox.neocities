import { sounds } from "./sounds.js"

document.querySelectorAll(".friend-tab").forEach((friend) => {
	friend.addEventListener("click", () => {
		const friend_page = document.querySelector(`#${friend.id}-page`)
		if (friend_page.classList.contains("active")) {
			return
		}

		document
			.querySelectorAll(".friend-page, .personal-board")
			.forEach((friend_item) => {
				friend_item.classList.remove("active")
			})

		friend_page.classList.add("active")
		document.querySelector(`#${friend.id}-board`).classList.add("active")

		sounds.swoosh_fast.audio.play()
	})
})

function addPins() {
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
