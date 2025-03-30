document.addEventListener("DOMContentLoaded", function () {
	const container = document.getElementById("container");

	const bodyWidth = document.body.offsetWidth;
	const containerRect = container.getBoundingClientRect();

	const divWidth = 150;
	const divHeight = 150;

	function getRandomX() {
		return Math.floor(Math.random() * (bodyWidth - divWidth));
	}

	function getRandomY() {
		const bodyHeight = document.body.offsetHeight;
		const validRegionHeight = bodyHeight - divHeight;
		const offset = Math.floor(Math.random() * validRegionHeight);
		return offset;
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

	fetch("/pages/todo.html")
		.then((response) => response.text())
		.then((html) => {
			const parser = new DOMParser();
			const doc = parser.parseFromString(html, "text/html");

			const liElements = doc.querySelectorAll("li");

			for (let i = 0; i < liElements.length; i++) {
				let newDiv;
				let overlaps = true;
				while (overlaps) {
					const x = getRandomX();
					const y = getRandomY();
					newDiv = { x, y };
					overlaps = doesOverlap(newDiv, Array.from(container.children));
				}

				const newDivElement = document.createElement("div");
				newDivElement.classList.add("postit-note");
				newDivElement.style.position = "absolute";
				newDivElement.style.left = `${newDiv.x}px`;
				newDivElement.style.top = `${newDiv.y}px`;
				newDivElement.style.width = `${divWidth}px`;
				newDivElement.style.height = `${divHeight}px`;
				newDivElement.textContent = liElements[i].textContent;

				const pin = document.createElement("img");
				pin.classList.add("postit-pin");
				pin.src = "/assets/img/pin.png";

				newDivElement.appendChild(pin);

				container.appendChild(newDivElement);
			}
		});
});
