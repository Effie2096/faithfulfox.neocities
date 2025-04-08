document.addEventListener("DOMContentLoaded", function () {
	const container = document.getElementById("container");

	const containerRect = container.getBoundingClientRect();

	const divWidth = 150;
	const divHeight = 150;
	const offset = 0;

	function getRandomX() {
		const bodyWidth = document.body.offsetWidth;
		const validRegionWidth = bodyWidth - divWidth + offset * 2;
		const offsetSide = Math.floor(Math.random() * validRegionWidth) - offset;
		return offsetSide;
	}

	function getRandomY() {
		const bodyHeight = document.body.offsetHeight;
		const validRegionHeight = bodyHeight - divHeight + offset * 2;
		const offsetTop = Math.floor(Math.random() * validRegionHeight) - offset;
		return offsetTop;
	}

	function doesOverlap(newDiv, existingDivs) {
		for (let i = 0; i < existingDivs.length; i++) {
			const existingDiv = existingDivs[i];
			const existingDivRect = existingDiv.getBoundingClientRect();
			const newDivRect = {
				left: newDiv.x,
				top: newDiv.y,
				right: newDiv.x + divWidth,
				bottom: newDiv.y + divHeight,
			};

			if (
				newDivRect.left < existingDivRect.right &&
				newDivRect.right > existingDivRect.left &&
				newDivRect.top < existingDivRect.bottom &&
				newDivRect.bottom > existingDivRect.top
			) {
				return true;
			}
		}

		if (
			newDiv.x + divWidth > containerRect.left &&
			newDiv.x < containerRect.right &&
			newDiv.y + divHeight > containerRect.top &&
			newDiv.y < containerRect.bottom
		) {
			return true;
		}

		return false;
	}

	function drawPostits() {
		fetch("/pages/todo.html")
			.then((response) => response.text())
			.then((html) => {
				const parser = new DOMParser();
				const doc = parser.parseFromString(html, "text/html");

				const liElements = doc.querySelectorAll("li");

				for (let i = 0; i < liElements.length; i++) {
					let newDiv;
					let overlaps = true;
					let attempts = 0;
					const maxAttempts = 100;
					while (overlaps && attempts < maxAttempts) {
						const x = getRandomX();
						const y = getRandomY();
						newDiv = { x, y };
						overlaps = doesOverlap(newDiv, Array.from(container.children));
						attempts++;
					}

					if (attempts < maxAttempts) {
						const newDivElement = document.createElement("div");
						newDivElement.classList.add("postit-note");
						newDivElement.style.position = "absolute";
						newDivElement.style.left = `${newDiv.x}px`;
						newDivElement.style.top = `${newDiv.y}px`;
						newDivElement.style.width = `${divWidth}px`;
						newDivElement.style.height = `${divHeight}px`;
						newDivElement.textContent = liElements[i].textContent;

						const rotation = Math.floor(Math.random() * 20) - 10;
						newDivElement.style.transform = `rotate(${rotation}deg)`;

						const pin = document.createElement("img");
						pin.classList.add("postit-pin");
						pin.src = "/assets/img/pin.png";

						newDivElement.appendChild(pin);

						container.appendChild(newDivElement);
					} else {
						console.log(
							`Failed to place postit ${i} after ${maxAttempts} attempts.`,
						);
					}
				}
			});
	}

	function clearPostits() {
		document.querySelectorAll(".postit-note").forEach((postit) => {
			postit.remove();
		});
	}

	const postitWidth = divWidth + 20;
	const minScreenWidth = 1160;
	const minScreenheight = 690;

	let resizeTimeout = null;

	let previousWidth = window.innerWidth;
	let previousHeight = window.innerHeight;

	if (previousWidth >= minScreenWidth && previousHeight >= minScreenheight) {
		drawPostits();
		document.getElementById("postit").style.display = "none";
	}

	window.addEventListener("resize", () => {
		if (resizeTimeout) {
			clearTimeout(resizeTimeout);
		}

		resizeTimeout = setTimeout(() => {
			const currentWidth = window.innerWidth;
			const currentHeight = window.innerHeight;

			if (currentWidth < minScreenWidth || currentHeight < minScreenheight) {
				clearPostits();
				document.getElementById("postit").style.display = "block";
			} else if (
				Math.floor(currentWidth / postitWidth) !==
					Math.floor(previousWidth / postitWidth) ||
				Math.floor(currentHeight / postitWidth) !==
					Math.floor(previousHeight / postitWidth)
			) {
				clearPostits();
				drawPostits();
				document.getElementById("postit").style.display = "none";
				document.getElementById("updates").classList.add("active");
				document.getElementById("todo-list").classList.remove("active");
				document.getElementById("postit").classList.remove("active");
				document.getElementById("update-heading").innerHTML = "Updates";
			}

			previousWidth = currentWidth;
			previousHeight = currentHeight;
		}, 100);
	});
});
