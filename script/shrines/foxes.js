document.addEventListener("DOMContentLoaded", function () {
	document.querySelectorAll(".gallery-card").forEach((gallery) => {
		setupImageViewer(gallery)
	})
})
