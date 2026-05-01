import { sounds } from "./sounds.js";

let selected = document.querySelector(".friend-tab").id;

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

		selected = friend.id;

		document.querySelector("#container").style.backgroundImage =
			`url('/assets/img/friends/${friend.id}/background.png`;

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
		const s = 100 * scale;
		const bubble = {
			x: Math.random() * window.innerWidth,
			y: window.innerHeight + s,
			scale: scale,
			rotation: 0.0,
		};
		bubbles.push(bubble);
	}

	function drawBubble(bubble) {
		let gradient = ctx.createRadialGradient(
			bubble.x + (100 * bubble.scale) / 4,
			bubble.y + (100 * bubble.scale) / 4,
			(bubble.scale * 100) / 2,
			bubble.x,
			bubble.y,
			bubble.scale * 100,
		);
		gradient.addColorStop(0, `rgba(225, 163, 1, 0.15)`);
		gradient.addColorStop(0.7, "rgba(255,255,255, 0");
		gradient.addColorStop(0.85, "rgba(255,255,255, 0");
		gradient.addColorStop(0.9, "rgba(218, 84, 0, 0.2)");
		ctx.fillStyle = gradient;
		ctx.beginPath();
		ctx.arc(bubble.x, bubble.y, 100 * bubble.scale, 0, 2 * Math.PI);
		ctx.fill();

		const glint_x = bubble.x - (100 * bubble.scale) / 2;
		const glint_y = bubble.y - (100 * bubble.scale) / 2;
		const glint_size = (bubble.scale * 100) / 4;
		gradient = ctx.createRadialGradient(
			glint_x,
			glint_y,
			glint_size * 0.7,
			glint_x,
			glint_y,
			glint_size,
		);

		gradient.addColorStop(0, "rgba(225, 183, 18, 0.15)");
		gradient.addColorStop(0.85, "rgba(218, 84, 0, 0.01)");
		ctx.fillStyle = gradient;
		ctx.beginPath();
		ctx.ellipse(
			glint_x,
			glint_y,
			glint_size / 2,
			glint_size,
			Math.PI / 3,
			0,
			2 * Math.PI,
		);
		ctx.fill();
	}

	let t = 0;
	function updateBubbles() {
		for (let i = 0; i < bubbles.length; i++) {
			const bubble = bubbles[i];
			t += i;

			bubble.y -= 10 * bubble.scale;
			const freq = bubble.scale;

			bubble.x +=
				bubble.scale < 0.5
					? Math.sin(Math.PI * 4 * ((freq + 1) * 2) * t) * 1.5
					: Math.sin(Math.PI * 2 * freq * t) * 2;
			if (bubble.y + bubble.scale * 100 < 0) {
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
			drawBubble(bubble);
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
		switch (selected) {
			case "shyni": {
				createBubble(Math.random());
				break;
			}
		}
	}, 200);
});
