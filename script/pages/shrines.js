function toggleContentWarnings() {
	const contentWarnings = document.getElementById("content-warning-index")
	const toggleButton = document.getElementById("toggle-button")
	contentWarnings.classList.toggle("active")
	toggleButton.innerHTML =
		toggleButton.innerHTML == "expand" ? "close" : "expand"
}

function toggleActive(element) {
	element.classList.toggle("active")
}

document.addEventListener("DOMContentLoaded", function () {
	const shrines = document.querySelectorAll(".card").forEach((shrine) => {
		if (shrine.querySelector(".content-warning")) {
			shrine.classList.add("has-warnings")

			shrine
				.querySelector(".content-warning.warning")
				.addEventListener("click", function () {
					toggleActive(this)
				})
		}
	})
})
