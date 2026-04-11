const canvas_tuah = document.getElementById("canvas-tuah");
const ctx_tuah = canvas_tuah.getContext("2d");

canvas_tuah.width = window.innerWidth;
canvas_tuah.height = window.innerHeight;

const image_tuah = new Image();
image_tuah.src = "/assets/img/fox sit.webp";

const explosion = {
	x: 0,
	y: 0,
	images: [],
	numImages: 10,
	speed: 10,
	angle: 0,
};
const frameTime = 16;
const scaleFactor = 1;
const imageLimit = 200;
const lifetime = 2000;
const fadeTime = 600;

function createImage(x, y) {
	const img = {
		x: x,
		y: y,
		vx: Math.random() * explosion.speed - explosion.speed / 2,
		vy: Math.random() * explosion.speed - explosion.speed / 2,
		angle: Math.random() * 360,
		opacity: 1.0,
		birth: performance.now(),
		lifetime: lifetime,
		fade: Math.random() * fadeTime,
	};
	explosion.images.push(img);
}

function updateImages() {
	for (let i = 0; i < explosion.images.length; i++) {
		const img = explosion.images[i];
		img.x += img.vx;
		img.y += img.vy;
		img.angle += 1;
		img.lifetime -= frameTime;

		// Check if the image has hit an edge
		if (
			img.x + (image_tuah.width * scaleFactor) / 2 > canvas_tuah.width ||
			img.x - (image_tuah.width * scaleFactor) / 2 < 0
		) {
			img.vx = -img.vx;
		}
		if (
			img.y + (image_tuah.height * scaleFactor) / 2 > canvas_tuah.height ||
			img.y - (image_tuah.height * scaleFactor) / 2 < 0
		) {
			img.vy = -img.vy;
		}

		if (img.lifetime <= img.fade) {
			const dec = img.fade / frameTime / 100;
			const opacity = Math.max(0, img.opacity - dec);

			img.opacity = opacity;
		}

		if (img.lifetime <= 0) {
			explosion.images.splice(i, 1); // remove the image from the array
			i--; // decrement the index to avoid skipping images
		}
	}

	if (explosion.images.length > imageLimit) {
		explosion.images.shift(); // remove the oldest image from the array
	}
}

function drawImages() {
	ctx_tuah.clearRect(0, 0, canvas_tuah.width, canvas_tuah.height);
	for (let i = 0; i < explosion.images.length; i++) {
		const img = explosion.images[i];
		ctx_tuah.save();
		ctx_tuah.translate(img.x, img.y);
		ctx_tuah.rotate((img.angle * Math.PI) / 180);
		ctx_tuah.globalAlpha = img.opacity;
		ctx_tuah.drawImage(
			image_tuah,
			0,
			0,
			image_tuah.width,
			image_tuah.height,
			-image_tuah.width / 2,
			-image_tuah.height / 2,
			image_tuah.width * scaleFactor,
			image_tuah.height * scaleFactor,
		);
		ctx_tuah.restore();
	}
}

let updateInterval = null;
let drawInterval = null;
function createExplosion(x, y) {
	for (let i = 0; i < explosion.numImages; i++) {
		createImage(x, y);
	}

	// Clear existing intervals if they exist
	if (updateInterval) {
		clearInterval(updateInterval);
	}
	if (drawInterval) {
		clearInterval(drawInterval);
	}

	// Set new intervals
	updateInterval = setInterval(updateImages, frameTime);
	drawInterval = setInterval(drawImages, frameTime);
}

document.addEventListener("click", (event) => {
	if (event.target !== canvas_tuah) {
		const rect = canvas_tuah.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		createExplosion(x, y);
	}
});
