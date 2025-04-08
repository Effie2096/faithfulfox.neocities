window.onload = function () {
	window.secretHasEnded = false;
	window.startSound = new Audio("https://files.catbox.moe/s1s1k8.mp3");
	window.startSound.preload = "auto";
	window.startSound.volume = 0.25;

	window.pauseSound = new Audio("https://files.catbox.moe/ck2msq.wav");
	window.pauseSound.preload = "auto";
	window.pauseSound.volume = 0.25;

	var player4 = document.getElementById("player4");
	player4.addEventListener("play", () => {
		easteregg(player4);
	});
	player4.addEventListener("pause", () => {
		easteregg(player4);
	});

	document.body.style.backgroundImage =
		"url('/assets/img/shrines/doom2/doom2background.jpg')";

	const tabLinks = document.querySelectorAll(".tablinks");

	tabLinks.forEach((link) => {
		link.addEventListener("click", () => {
			const content = document.querySelector("#content");
			if (content.scrollTop > 205) {
				content.scrollTop = 205;
			}
		});
	});

	[
		document.getElementById("caco-container"),
		document.getElementById("hellknight-container"),
		document.getElementById("pinky-container"),
	].forEach((container) => {
		container.addEventListener("click", () => {
			toggleActive(container);
		});
	});
};
