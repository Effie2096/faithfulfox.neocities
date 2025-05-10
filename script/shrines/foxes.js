document.addEventListener("DOMContentLoaded", function () {
	document.querySelectorAll(".gallery-card").forEach((gallery) => {
		setupImageViewer(gallery)
	})

	const canvas = document.getElementById("canvas")
	const ctx = canvas.getContext("2d")

	canvas.width = window.innerWidth
	canvas.height = window.innerHeight

	const images = []
	const numImages = 10
	const radius = 20
	let imagesLoaded = 0

	for (let i = 0; i < numImages; i++) {
		const image = {
			x: Math.random() * (canvas.width - radius * 2),
			y: Math.random() * (canvas.height - radius * 2),
			vx: Math.random() * 4 - 2,
			vy: Math.random() * 4 - 2,
			img: new Image(),
		}
		image.img.src = "/assets/img/fox sit.webp"
		image.img.onload = function () {
			imagesLoaded++
			if (imagesLoaded === numImages) {
				draw()
			}
		}
		images.push(image)
	}

	function draw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		for (let i = 0; i < images.length; i++) {
			const image = images[i]
			ctx.drawImage(image.img, image.x, image.y, radius * 2, radius * 2)

			image.x += image.vx
			image.y += image.vy

			if (image.x + radius * 2 > canvas.width || image.x < 0) {
				image.vx = -image.vx
			}
			if (image.y + radius * 2 > canvas.height || image.y < 0) {
				image.vy = -image.vy
			}
		}
		requestAnimationFrame(draw)
	}
})
