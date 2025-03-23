function CopyToClipboard(content) {
	var text = "";
	if (typeof content !== "string") {
		text = document.getElementById(content).textContent;
	} else {
		text = content;
	}
	navigator.clipboard.writeText(text);
}
