function expandPost(caller) {
	var postContainer = caller.closest(".content-card");
	var postBody = postContainer.getElementsByClassName("content-body")[0];
	postBody.classList.toggle("active");

	var expandButtons = postContainer.querySelectorAll(".content-expand");
	expandButtons.forEach((button) => {
		button.classList.toggle("active");
		if (button.classList.contains("hidden-content-expand")) {
			button.style.display = button.style.display == "block" ? "none" : "block";
		}
		button.innerHTML = button.innerHTML == " less " ? " more " : " less ";
	});

	postContainer
		.getElementsByClassName("content-footer")[0]
		.classList.toggle("active");
}

function getCount(parent, recursive) {
	var relevantChildren = 0;
	var children = parent.childNodes.length;
	for (var i = 0; i < children; i++) {
		if (parent.childNodes[i].nodeType != 3) {
			if (recursive) relevantChildren += getCount(parent.childNodes[i], true);
			relevantChildren++;
		}
	}
	return relevantChildren;
}
