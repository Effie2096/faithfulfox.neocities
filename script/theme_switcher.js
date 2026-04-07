import contrast from "/css/colorschemes/contrast.css" with { type: "css" };
import eldritch from "/css/colorschemes/eldritch.css" with { type: "css" };
import foxden from "/css/colorschemes/foxden.css" with { type: "css" };
import kanagawa from "/css/colorschemes/kanagawa.css" with { type: "css" };
import matrix from "/css/colorschemes/matrix.css" with { type: "css" };
import sakura from "/css/colorschemes/sakura.css" with { type: "css" };

import { getCookie, setCookie } from "/script/cookies.js";

const MODES = {
	light: {
		value: "light",
		icon: " ",
		next: "dark",
	},
	dark: {
		value: "dark",
		icon: "󰖔",
		next: "system",
	},
	system: {
		value: "light dark",
		icon: "󰔎",
		next: "light",
	},
};

const THEMES_DIR = "/css/colorschemes";
const THEMES = [
	{
		name: "foxden",
		sheet: foxden,
		icon: "/assets/img/colorschemes/foxden.png",
	},
	{
		name: "eldritch",
		sheet: eldritch,
		icon: "/assets/img/colorschemes/eldritch.png",
	},
	{
		name: "matrix",
		sheet: matrix,
		icon: "/assets/img/colorschemes/matrix.png",
	},
	{
		name: "sakura",
		sheet: sakura,
		icon: "/assets/img/colorschemes/sakura.png",
	},
	{
		name: "kanagawa",
		sheet: kanagawa,
		icon: "/assets/img/colorschemes/kanagawa.png",
	},
	{
		name: "contrast",
		sheet: contrast,
		icon: "/assets/img/colorschemes/contrast.png",
	},
];

const PATH_OVERRIDES = {
	"/pages/devlog": "matrix",
	"/": "foxden",
};

function pathStartsWith(dir) {
	const path = window.location.pathname;

	// special case: homepage
	if (dir === "/" || dir === "/index.html")
		return path === "/" || path === "/index.html";

	// normalize trailing slash on dir
	const normalizedDir = dir.endsWith("/") ? dir : `${dir}/`;

	return path.startsWith(normalizedDir);
}

function searchOverrides() {
	return Object.entries(PATH_OVERRIDES).find(([path, _]) => {
		return pathStartsWith(path);
	});
}

async function setThemeCookie(name) {
	const override = searchOverrides();
	const cookieName = override ? `${override[0]}-colorscheme` : "colorscheme";

	await setCookie(cookieName, name);
}

async function getThemeCookie() {
	const override = searchOverrides();
	const cookieName = override ? `${override[0]}-colorscheme` : "colorscheme";

	return await getCookie(cookieName);
}

function getThemeSheets(filter = THEMES_DIR) {
	return Object.values(document.styleSheets).filter((sheet) => {
		return sheet.href.includes(filter);
	});
}

function removeThemeSheets(stylesheets) {
	Object.values(stylesheets).forEach((sheet) => {
		sheet.ownerNode.parentNode.removeChild(sheet.ownerNode);
	});
}

function updatePicker(selected) {
	const picker = document.querySelector("#colorschemes-select");
	const options = picker.querySelectorAll(".colorscheme-option");

	Object.values(options)
		.sort((a, b) => {
			const valueA = a.querySelector(".colorscheme-value");
			const valueB = b.querySelector(".colorscheme-value");
			if (valueA.textContent < valueB.textContent) {
				return -1;
			}
			if (valueA.textContent > valueB.textContent) {
				return 1;
			}
			return 0;
		})
		.forEach((option) => {
			picker.appendChild(option);
		});

	picker.prepend(
		Object.values(options).find((option) => {
			return (
				option.querySelector(".colorscheme-value").textContent === selected
			);
		}),
	);
}

const sortThemes = (a, b) => {
	if (a.name < b.name) {
		return -1;
	}
	if (a.name > b.name) {
		return 1;
	}
	return 0;
};

function newThemesContainer() {
	const themesContainer = document.createElement("div");
	themesContainer.id = "themes-container";

	const themePicker = newThemePicker();
	const modeSwitcher = newModeSwitcher();
	themesContainer.appendChild(themePicker);
	themesContainer.appendChild(modeSwitcher);

	return {
		themesContainer: themesContainer,
		modeSwitcher: modeSwitcher,
		themePicker: themePicker,
	};
}

function newThemePicker() {
	const select = document.createElement("div");
	select.id = "colorschemes-select";
	select.classList.add("toolbar-button");

	const override = searchOverrides();

	THEMES.sort(sortThemes).forEach((theme) => {
		const option = document.createElement("div");
		option.classList.add("colorscheme-option");

		if (override && override[1] === theme.name) {
			option.classList.add("preferred");
		}

		const optionDisplay = document.createElement("div");
		optionDisplay.classList.add("colorscheme-display");
		optionDisplay.addEventListener("click", (event) => {
			const value =
				event.target.parentNode.querySelector(".colorscheme-value").textContent;
			changeColorscheme(value);
		});

		const value = document.createElement("span");
		value.role = "value";
		value.classList.add("colorscheme-value");
		value.textContent = theme.name;
		optionDisplay.appendChild(value);

		const themeIcon = document.createElement("img");
		themeIcon.src = theme.icon;
		optionDisplay.appendChild(themeIcon);

		const themeName = document.createElement("span");
		themeName.classList.add("colorscheme-name");
		themeName.textContent =
			theme.name.charAt(0).toUpperCase() + theme.name.slice(1);
		optionDisplay.appendChild(themeName);

		option.appendChild(optionDisplay);

		select.appendChild(option);
	});

	return select;
}

function newModeSwitcher() {
	const modeSwitcher = document.createElement("span");
	modeSwitcher.id = "mode-switcher";
	modeSwitcher.classList.add("toolbar-button");
	modeSwitcher.addEventListener("click", toggleMode);

	return modeSwitcher;
}

function getThemesElement() {
	const themesContainer = document.querySelector("#themes-container");
	const modeSwitcher = themesContainer.querySelector("#mode-switcher");
	return { themesContainer: themesContainer, modeSwitcher: modeSwitcher };
}

function getMode() {
	const root = document.querySelector(":root");

	if (!root) {
		return MODES.system;
	}

	const styles = getComputedStyle(root);
	const mode = styles.getPropertyValue("color-scheme");

	const documentMode = Object.values(MODES).find((entry) => {
		return entry.value === mode;
	});

	return documentMode === "normal" ? MODES.system : documentMode;
}

function setMode(mode = "light dark") {
	const root = document.querySelector(":root");

	if (root) {
		root.style.setProperty("color-scheme", mode);
	}
}

function toggleMode() {
	const root = document.querySelector(":root");
	const themesElement = getThemesElement();

	if (root) {
		const current = getMode();
		if (current) {
			const next = MODES[current.next];

			setMode(next.value);
			themesElement.modeSwitcher.textContent = next.icon;
		}
	}
}

async function changeColorscheme(name = "foxden") {
	const theme = THEMES.find((theme) => {
		return theme.name === name;
	});

	document.adoptedStyleSheets.push(theme.sheet);

	await setThemeCookie(name);

	updatePicker(name);
}

async function loadTheme() {
	const cookieTheme = await getThemeCookie();

	let themeName = "foxden"; // fallback

	if (cookieTheme?.value) {
		themeName = cookieTheme.value;
	} else {
		const existingTheme = getThemeSheets()
			.pop()
			.href.replace(/.*\//, "")
			.replace(/\.css/, "");
		themeName = existingTheme;
	}
	const theme = THEMES.find((theme) => {
		return theme.name === themeName;
	});

	document.adoptedStyleSheets.push(theme.sheet);

	updatePicker(themeName);
}

document.addEventListener("DOMContentLoaded", () => {
	const toolbar = document.querySelector("#toolbar");
	const themesElement = newThemesContainer();
	toolbar.appendChild(themesElement.themesContainer);

	const mode = getMode();
	if (mode) {
		themesElement.modeSwitcher.textContent = mode.icon;
	}

	loadTheme();
});
