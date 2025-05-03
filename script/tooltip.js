function tooltip(element, text, icon) {
	icon = icon || ""
	const pos = element.getBoundingClientRect()
	const tooltip = createTooltip(text, icon)
	// const elementPosition = getComputedStyle(element).position

	// element.style.position = "relative"
	document.getElementsByTagName("body")[0].appendChild(tooltip)
	tooltip.style.left = `${pos.left - tooltip.getBoundingClientRect().width / 2 + pos.width / 2}px`
	const closeToTop = pos.top < window.innerHeight / 6

	if (closeToTop) {
		tooltip.classList.add("tooltip-top")
	}

	const topPos = closeToTop
		? pos.top + pos.height + 10
		: pos.top - tooltip.getBoundingClientRect().height - 10
	tooltip.style.top = `${topPos}px`

	element.addEventListener("mouseout", (_event) => {
		tooltip.remove()
	})
}

var createTooltip = function (text, icon) {
	const tooltip = document.createElement("div")
	tooltip.classList.add("tooltip")
	tooltip.style.pointerEvents = "none"

	const tooltipIcon = document.createElement("p")
	tooltipIcon.classList.add("tooltipicon")
	tooltipIcon.textContent = `${icon}`

	const tooltipText = document.createElement("p")
	tooltipText.classList.add("tooltiptext")
	tooltipText.textContent = `${text}`

	tooltip.appendChild(tooltipIcon)
	tooltip.appendChild(tooltipText)

	return tooltip
}
