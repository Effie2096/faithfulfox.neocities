import { sounds } from "./sounds.js";

document.querySelectorAll(".friend-tab").forEach((friend) => {
	friend.addEventListener("click", () => {
		const friend_page = document.querySelector(`#${friend.id}-page`);
		if (friend_page.classList.contains("active")) {
			return;
		}

		document
			.querySelectorAll(".friend-page, .personal-board")
			.forEach((friend_item) => {
				friend_item.classList.remove("active");
			});

		friend_page.classList.add("active");
		document.querySelector(`#${friend.id}-board`).classList.add("active");

		sounds.swoosh_fast.audio.play();
	});
});

function addPins() {
	document.querySelectorAll(".personal-board .pin").forEach((pin) => {
		if (!pin.querySelector(".pin-img")) {
			const pinImg = document.createElement("img");
			pinImg.classList.add("pin-img");
			pinImg.src = "/assets/img/pin.png";

			pinImg.style.position = "absolute";
			pinImg.style.width = "2rem";
			pinImg.style.height = "2rem";
			pinImg.style.top = "-0.4rem";
			pinImg.style.left = "50%";
			pinImg.style.transform = "translateX(-50%)";

			pin.appendChild(pinImg);
		}
	});
}

document.addEventListener("DOMContentLoaded", () => {
	addPins();

	const canvas = document.getElementById("canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	let canvas_debounce = null;
	const canvasResizeObserver = new ResizeObserver(() => {
		if (canvas_debounce) {
			clearTimeout(canvas_debounce);
		}

		canvas_debounce = setTimeout(() => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		}, 100);
	});
	canvasResizeObserver.observe(document.querySelector("body"));

	const ctx = canvas.getContext("2d");

	const bubbles = [];

	function createBubble(scale) {
		const s = Math.min(scale * 100, 50);
		const bubble = {
			x: Math.random() * window.innerWidth,
			y: window.innerHeight + s,
			scale: s,
		};
		bubbles.push(bubble);
	}

	function drawBubble(x, y, scale) {
		ctx.beginPath();
		ctx.arc(x, y, scale, 0, 2 * Math.PI);
		ctx.stroke();
	}

	function updateBubbles() {
		for (let i = 0; i < bubbles.length; i++) {
			const bubble = bubbles[i];
			bubble.y -= 10;

			if (bubble.y + bubble.scale < window.innerHeight / 2) {
				bubbles.splice(i, 1);
				i--;
			}
		}
	}
	function drawBubbles() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for (let i = 0; i < bubbles.length; i++) {
			const bubble = bubbles[i];

			ctx.save();
			ctx.translate(bubble.x, bubble.y);
			drawBubble(bubble.x, bubble.y, bubble.scale);
			ctx.restore();
		}
	}
	let start = null;
	requestAnimationFrame(firstFrame);
	function firstFrame(timestamp) {
		start = timestamp;
		step(timestamp);
	}

	function step(timestamp) {
		const elapsed = (timestamp - start) / (performance.now() - start);

		updateBubbles();
		drawBubbles();

		requestAnimationFrame(step);
	}

	setInterval(() => {
		createBubble(Math.random());
		console.log(bubbles);
	}, 2000);
});
