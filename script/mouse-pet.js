var velocity = { x: 1, y: 1 };

var petElement = document.getElementById("pet");
var mouseX = 0;
var mouseY = 0;
var petX = 0;
var petY = 0;
var speed = 2;
var sit = false;
const sit_range = 4;

const sitTimeout = 4000;
const wakeUpTimeout = 4000;
var isWakingUp = false;
var lastSitTime = 0;
var isSearching = false;
const searchBounds = 0;

function updatePosition() {
	var dx = mouseX - petX;
	var dy = mouseY - petY;

	if (!isSearching) {
		petElement.classList.remove("fox-search");
	}

	if (Math.abs(dx) > speed || Math.abs(dy) > speed) {
		var angle = Math.atan2(dy, dx);
		var velocityX = Math.cos(angle) * speed;
		var velocityY = Math.sin(angle) * speed;

		var currentTime = new Date().getTime();
		if (sit) {
			// Fox is sitting, don't move yet
			if (currentTime - lastSitTime > sitTimeout - wakeUpTimeout) {
				// Add wake up class
				if (!isWakingUp) {
					petElement.classList.add("fox-wake");
					isWakingUp = true;
				}
			}
			if (currentTime - lastSitTime > sitTimeout) {
				// Delay has expired, start following mouse
				sit = false;
				isWakingUp = false;
				petElement.classList.remove("fox-wake");
			}
		} else if (isSearching) {
			petElement.classList.add("fox-search");
		} else {
			petX += velocityX;
			petY += velocityY;

			velocity.x = velocityX;
			velocity.y = velocityY;

			petElement.style.left = petX + "px";
			petElement.style.top = petY + "px";

			sit = Math.abs(dx) <= sit_range && Math.abs(dy) <= sit_range;
			updateBackgroundImage(petElement, velocity);
		}
	}

	requestAnimationFrame(updatePosition);
}

document.addEventListener("mouseout", function (event) {
	isSearching =
		event.clientY <= searchBounds ||
		event.clientX <= searchBounds ||
		event.clientX >= window.innerWidth - searchBounds ||
		event.clientY >= window.innerHeight - searchBounds;
});

// For tracking mouse movement
function trackMouse(event) {
	mouseX = event.clientX;
	mouseY = event.clientY;
	console.log("Mouse X:", mouseX, "Mouse Y:", mouseY);
}
document.addEventListener("mousemove", trackMouse);

petX = window.innerWidth / 2;
petY = window.innerHeight / 2;
// petElement.style.left = petX + "px";
// petElement.style.top = petY + "px";

updatePosition();

function updateBackgroundImage(element, velocity) {
	const angle =
		(Math.atan2(velocity.y, velocity.x) * (180 / Math.PI) + 360) % 360;

	const className = angleToDirection(angle);

	if (className) {
		element.className = className;
		if (sit) {
			lastSitTime = new Date().getTime();
			element.className = "fox_lay";
		} else {
			element.className = className;
		}
	}
}

function angleToDirection(angle) {
	const directions = {
		"north-east": [292.5, 337.5],
		east: [-22.5, 22.5],
		north: [247.5, 292.5],
		"north-west": [202.5, 247.5],
		west: [157.5, 202.5],
		"south-west": [112.5, 157.5],
		south: [67.5, 112.5],
		"south-east": [22.5, 67.5],
	};

	for (const direction in directions) {
		const range = directions[direction];
		if (range[0] < 0) {
			if (angle >= 360 + range[0] || angle < range[1]) {
				return direction;
			}
		} else {
			if (angle >= range[0] && angle < range[1]) {
				return direction;
			}
		}
	}
}
