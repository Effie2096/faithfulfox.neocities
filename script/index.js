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
							const resizeObserver = new ResizeObserver((entries) => {
								countContentTags()
							})
							resizeObserver.observe(tagDropdown)
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
})

function toggleActive(element) {
	element.classList.toggle("active")
}

function removeClassAfterTimeout(element, className, timeout) {
	setTimeout(function () {
		element.classList.remove(className)
	}, timeout)
}

function toggleChat() {
	// toggle the visibility of the "chat-container" div
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
