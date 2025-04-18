function setupImageViewer(triggerElement) {
	const images = Array.from(triggerElement.querySelectorAll("img"))

	triggerElement.addEventListener("click", (e) => {
		const clickedImage = e.target.closest("img")
		if (!clickedImage) return

		const index = images.indexOf(clickedImage)
		if (index === -1) return

		openViewer(images, index)
	})
}

function openViewer(images, startIndex) {
	let currentIndex = startIndex

	// Create overlay
	const overlay = document.createElement("div")
	overlay.className = "image-viewer-overlay"

	// Create image
	const img = document.createElement("img")
	img.className = "image-viewer-img"
	img.src = images[currentIndex].src
	overlay.appendChild(img)

	// Left button
	const left = document.createElement("div")
	left.className = "image-viewer-nav nav-left"
	left.innerHTML = "&#8592;"
	overlay.appendChild(left)

	// Right button
	const right = document.createElement("div")
	right.className = "image-viewer-nav nav-right"
	right.innerHTML = "&#8594;"
	overlay.appendChild(right)

	// Close button
	const close = document.createElement("button")
	close.className = "image-viewer-close"
	close.innerHTML = "&times;"
	overlay.appendChild(close)

	document.body.appendChild(overlay)

	// Event listeners
	function showImage(index) {
		currentIndex = (index + images.length) % images.length
		img.src = images[currentIndex].src
	}

	left.addEventListener("click", () => showImage(currentIndex - 1))
	right.addEventListener("click", () => showImage(currentIndex + 1))
	close.addEventListener("click", () => document.body.removeChild(overlay))
	overlay.addEventListener("click", (e) => {
		if (e.target === overlay) document.body.removeChild(overlay)
	})
}
