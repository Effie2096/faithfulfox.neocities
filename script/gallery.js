function setupImageViewer(triggerElement) {
	const containers = Array.from(triggerElement.children)
	const imagePairs = containers
		.map((container) => {
			const img = container.querySelector("img")
			const captionEl = container.querySelector("p")
			if (!img) return null
			return {
				img,
				caption: captionEl ? captionEl.textContent : "",
			}
		})
		.filter(Boolean) // remove nulls (containers with no img)

	if (triggerElement.dataset.viewerInitialized === "true") return
	triggerElement.dataset.viewerInitialized = "true"

	triggerElement.addEventListener("click", (e) => {
		const clickedImage = e.target.closest("img")
		if (!clickedImage) return

		const index = imagePairs.findIndex((pair) => pair.img === clickedImage)
		if (index === -1) return

		openViewer(imagePairs, index)
	})
}

function openViewer(imagePairs, startIndex) {
	let currentIndex = startIndex

	const overlay = document.createElement("div")
	overlay.className = "image-viewer-overlay"

	const img = document.createElement("img")
	img.className = "image-viewer-img"
	overlay.appendChild(img)

	const caption = document.createElement("div")
	caption.className = "image-viewer-caption"
	overlay.appendChild(caption)

	const left = document.createElement("div")
	left.className = "image-viewer-nav nav-left"
	left.innerHTML = "&#8592;"
	overlay.appendChild(left)

	const right = document.createElement("div")
	right.className = "image-viewer-nav nav-right"
	right.innerHTML = "&#8594;"
	overlay.appendChild(right)

	const close = document.createElement("button")
	close.className = "image-viewer-close"
	close.innerHTML = "&times;"
	overlay.appendChild(close)

	document.body.appendChild(overlay)

	function showImage(index) {
		currentIndex = (index + imagePairs.length) % imagePairs.length
		img.src = imagePairs[currentIndex].img.src
		caption.textContent = imagePairs[currentIndex].caption || ""
	}

	showImage(currentIndex)

	left.addEventListener("click", () => showImage(currentIndex - 1))
	right.addEventListener("click", () => showImage(currentIndex + 1))
	close.addEventListener("click", () => document.body.removeChild(overlay))
	overlay.addEventListener("click", (e) => {
		if (e.target === overlay) document.body.removeChild(overlay)
	})
}
