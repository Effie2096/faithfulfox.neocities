function expandPost(caller) {
	var postBody = caller.parentNode.parentNode.previousSibling.previousSibling;
	postBody.classList.toggle("active");

	caller.classList.toggle("active")
	caller.parentNode.parentNode.classList.toggle("active")
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
