function expandPost(caller) {
	var postBody = caller.parentNode.parentNode.previousSibling.previousSibling;
	postBody.classList.contains("active")
		? postBody.classList.remove("active")
		: postBody.classList.add("active");

	caller.classList.contains("active")
		? caller.classList.remove("active")
		: caller.classList.add("active");
	caller.parentNode.parentNode.classList.contains("active")
		? caller.parentNode.parentNode.classList.remove("active")
		: caller.parentNode.parentNode.classList.add("active");
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
