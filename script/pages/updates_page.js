import { shortDate } from "/script/utils/time_format.js"

document.addEventListener("DOMContentLoaded", function () {
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
})
