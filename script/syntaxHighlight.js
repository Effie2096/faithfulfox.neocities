function syntaxHighlight(element, mode) {
	var lang = mode || "shell";
	var elmntObj = document.getElementById(element) || element;
	var elmntTxt = elmntObj.textContent.trim();

	elmntTxt = elmntTxt.replace(
		/"(?:\\.|[^"\\])*"/g,
		(m) => `<span class="syntax string">${m}</span>`,
	);

	elmntTxt = elmntTxt.replace(
		/\B(-{1,2}[a-zA-Z][a-zA-Z0-9_-]*)\b/g,
		'<span class="syntax flag">$1</span>',
	);
	elmntObj.innerHTML = elmntTxt;
}
