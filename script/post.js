function expandPost(caller) {
	var postContainer = caller.closest(".content-card")
	var postBody = postContainer.getElementsByClassName("content-body")[0]
	postBody.classList.toggle("active")

	var expandButtons = postContainer.querySelectorAll(".content-expand")
	expandButtons.forEach((button) => {
		button.classList.toggle("active")
		if (button.classList.contains("hidden-content-expand")) {
			button.style.display = button.style.display == "block" ? "none" : "block"
		}
		button.innerHTML = button.innerHTML == " less " ? " more " : " less "
	})

	postContainer
		.getElementsByClassName("content-footer")[0]
		.classList.toggle("active")
}

function getCount(parent, recursive) {
	var relevantChildren = 0
	var children = parent.childNodes.length
	for (var i = 0; i < children; i++) {
		if (parent.childNodes[i].nodeType != 3) {
			if (recursive) relevantChildren += getCount(parent.childNodes[i], true)
			relevantChildren++
		}
	}
	return relevantChildren
}

function getContentTagDropdowns() {
	var postContainer = document.getElementById("posts")
	var tagDropdowns = Array.from(
		postContainer.querySelectorAll(".content-card"),
	).map((post) => {
		var footerLeft = post
			.getElementsByClassName("content-footer")[0]
			.getElementsByClassName("content-footer-left")[0]
		return footerLeft.getElementsByClassName("tag-dropdown")[0]
	})
	return tagDropdowns
}

function countContentTags() {
	const tagDropdowns = getContentTagDropdowns()
	tagDropdowns.forEach((tagDropdown) => {
		const tagCountFound = tagDropdown.getElementsByClassName("tag-count")
		if (tagCountFound.length > 0) {
			tagCountFound[0].remove()
		}

		var tags = tagDropdown.getElementsByClassName("tag")
		const tagDropdownWidth = tagDropdown.offsetWidth - 30

		var rowWidth = 0
		var tagCount = 0

		for (var i = 0; i < tags.length; i++) {
			const tagWidth = tags[i].offsetWidth

			rowWidth += tagWidth

			if (rowWidth < tagDropdownWidth) {
				tagCount += 1
				continue
			}
			break
		}
		if (tags.length - tagCount > 0) {
			var tagCountBadge = document.createElement("div")
			tagCountBadge.classList.add("tag-count")
			tags[tagCount - 1].insertAdjacentElement("afterend", tagCountBadge)
			tagCountBadge.innerHTML = tags.length - tagCount
		}
	})
}

function getContentUpdateDropdowns() {
	var postContainer = document.getElementById("posts")
	var timestampDropdowns = Array.from(
		postContainer.querySelectorAll(".content-card"),
	).map((post) => {
		const dropdown = post.querySelector(".timestamp-dropdown")
		return dropdown
	})
	return timestampDropdowns
}

function countContentUpdates() {
	const updateDropdowns = getContentUpdateDropdowns()
	updateDropdowns.forEach((updateDropdown) => {
		if (updateDropdown) {
			const updateBadgeFound =
				updateDropdown.parentElement.querySelector(".update-badge")
			if (updateBadgeFound) {
				updateBadgeFound.remove()
			}

			var postUpdates = updateDropdown.querySelectorAll(".post-update")
			if (postUpdates.length > 0) {
				const updateBadge = document.createElement("div")
				updateBadge.classList.add("update-badge")
				updateBadge.innerHTML = `+${postUpdates.length}`
				updateDropdown.parentElement.appendChild(updateBadge)
			}
		}
	})
}
