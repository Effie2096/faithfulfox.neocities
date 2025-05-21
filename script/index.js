import {
	notify,
	notificationHistoryButton,
	notificationClearButton,
} from "./notify.js"
import { shortDate } from "./utils/time_format.js"

import { CopyToClipboard, copyFile } from "./CopyToClipboard.js"

window.notify = notify

function toggleSidebarRight() {
	const sidebar = document.getElementsByClassName("sidebar-right")[0]
	const sidebarRightToggle = sidebar.getElementsByClassName(
		"sidebar-right-toggle-button",
	)[0]
	sidebarRightToggle.innerHTML =
		sidebarRightToggle.innerHTML === "expand" ? "close" : "expand"
	toggleActive(sidebar)
	toggleActive(sidebarRightToggle)
}

function addCensor(element) {
	element.querySelectorAll(".censor").forEach((censor) => {
		censor.addEventListener("click", () => {
			toggleActive(censor)
		})
	})
}

function toggleActive(element) {
	element.classList.toggle("active")
}

function toggleChat() {
	var chatContainer = document.getElementById("chatbox")
	var chatButton = document.getElementById("chat-btn")
	var chatButtonIcon = document.querySelector("#chat-btn span")
	const stylea = "10px 10px 0px 0px"
	const styleb = "10px 10px 10px 10px"
	chatContainer.style.height =
		chatContainer.style.height === "0px" ? "450px" : "0px"
	chatButton.style.borderRadius =
		chatButton.style.borderRadius === stylea ? styleb : stylea
	chatButtonIcon.textContent = chatButtonIcon.textContent === "" ? "" : ""
}

window.onload = function () {
	document.getElementById("chatbox").style.height = "0px"
}

document.addEventListener("DOMContentLoaded", function () {
	const postObserver = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.addedNodes.length > 0) {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === Node.ELEMENT_NODE) {
						addCensor(node)
					}
					if (
						node.nodeType === Node.ELEMENT_NODE &&
						node.classList.contains("content-body")
					) {
						const gallery = node.querySelectorAll(".gallery-card")
						gallery.forEach((gallery) => {
							setupImageViewer(gallery)
						})
					}
					if (
						node.nodeType === Node.ELEMENT_NODE &&
						node.classList.contains("content-footer")
					) {
						const tagDropdown = node.querySelector(
							".content-footer-left .tag-dropdown",
						)
						if (tagDropdown) {
							const resizeObserver = new ResizeObserver(() => {
								countContentTags()
							})
							resizeObserver.observe(tagDropdown)
						}
						const updateDropdown = node.querySelector(
							".content-footer-right .timestamp-dropdown",
						)
						if (updateDropdown) {
							countContentUpdates()
							node.querySelectorAll(".post-timestamp").forEach((timestamp) => {
								const fmt_time = document.createElement("span")
								fmt_time.classList.add("post-timestamp-formatted")
								fmt_time.textContent = shortDate(timestamp.textContent)
								timestamp.parentElement.appendChild(fmt_time)
							})
						}
					}
				})
			}
		})
	})

	postObserver.observe(document.getElementById("posts"), {
		childList: true,
		subtree: true,
	})

	const updatesObserver = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.addedNodes.length > 0) {
				mutation.addedNodes.forEach((node) => {
					if (
						node.nodeType === Node.ELEMENT_NODE &&
						node.classList.contains("update")
					) {
						const date = node.querySelector(".update-date")
						const fmt_date = shortDate(date.textContent, true)
						date.textContent = fmt_date
					}
				})
			}
		})
	})
	updatesObserver.observe(document.getElementById("updates"), {
		childList: true,
		subtree: true,
	})

	document.querySelectorAll(".toggleable").forEach((toggleable) => {
		toggleable.addEventListener("click", () => {
			toggleActive(toggleable)
		})
	})

	document
		.querySelector("#sidebar-right-toggle")
		.addEventListener("click", () => {
			toggleSidebarRight()
		})

	document
		.querySelector("#cryptography-section .contact-button")
		.addEventListener("click", () => {
			copyFile("/zased/gpg_key.txt")
			notify("downloading pgp pubkey...", "info")
		})
	document
		.querySelector("#email-section .contact-button")
		.addEventListener("click", () => {
			CopyToClipboard("faithfulfox@proton.me", "email copied to clipboard!")
		})
	document.querySelector("#foxden-badge a").addEventListener("click", () => {
		notify("downloading Fox Den button...", "info")
		CopyToClipboard(
			`
&lt;a href='https://faithfulfox.neocities.org/'&gt;
&lt;img src='FoxDenLogo.gif' alt='Fox Den Button' width='88px' height='31px'&gt;
&lt;/a&gt;
`,
			"Fox den badge HTML copied to clipboard.",
		)
	})

	document.querySelector("#chat-btn").addEventListener("click", () => {
		toggleChat()
	})
	document
		.querySelector("#notification-clear-button")
		.addEventListener("click", () => {
			notificationClearButton()
		})
	document
		.querySelector("#notification-count-button")
		.addEventListener("click", () => {
			notificationHistoryButton()
		})
})
