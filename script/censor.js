export function censorElementDescendants(element) {
	element.querySelectorAll(".censor, .spoiler").forEach((censor) => {
		censor.addEventListener("click", () => {
			censor.classList.toggle("active");
		});
	});
}
export function addCensors() {
	document.querySelectorAll(".censor, .spoiler").forEach((censor) => {
		censor.addEventListener("click", () => {
			censor.classList.toggle("active");
		});
	});
}
