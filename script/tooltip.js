function tooltip(element, text, icon) {
	icon = icon || ""
	const pos = element.getBoundingClientRect()
	const tooltip = createTooltip(text, icon)

	document.getElementsByTagName("body")[0].appendChild(tooltip)
	tooltip.style.left = `${
		pos.left - tooltip.getBoundingClientRect().width / 2 + pos.width / 2
	}px`
	const closeToTop = pos.top < window.innerHeight / 6

	if (closeToTop) {
		tooltip.classList.add("tooltip-top")
	}

	const topPos = closeToTop
		? pos.top + pos.height + 15
		: pos.top - tooltip.getBoundingClientRect().height - 15
	tooltip.style.top = `${topPos}px`

	if (
		tooltip.getBoundingClientRect().x + tooltip.getBoundingClientRect().width >
		window.innerWidth
	) {
		tooltip.style.left = `${
			window.innerWidth - tooltip.getBoundingClientRect().width - 15
		}px`
	}

	tooltip.querySelector(".tooltip-notch").style.left = `${
		element.getBoundingClientRect().x -
		tooltip.getBoundingClientRect().x +
		element.getBoundingClientRect().width / 2
	}px`

	element.addEventListener("mouseout", (_event) => {
		tooltip.classList.add("removing")
		setTimeout(() => {
			tooltip.remove()
		}, 200)
	})
}

var createTooltip = function (text, icon) {
	const tooltip = document.createElement("div")
	tooltip.classList.add("tooltip")
	tooltip.style.pointerEvents = "none"

	if (icon) {
		const tooltipIcon = document.createElement("div")
		tooltipIcon.classList.add("tooltipicon")

		const iconText = document.createElement("span")
		iconText.textContent = `${icon}`
		tooltipIcon.appendChild(iconText)
		tooltip.appendChild(tooltipIcon)
	}

	const tooltipText = document.createElement("span")
	tooltipText.classList.add("tooltiptext")
	tooltipText.textContent = `${text}`

	const notch = document.createElement("div")
	notch.classList.add("tooltip-notch")

	tooltip.appendChild(tooltipText)
	tooltip.appendChild(notch)

	return tooltip
}
