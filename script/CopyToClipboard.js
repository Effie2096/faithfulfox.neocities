function CopyToClipboard(content) {
	var text = "";
	if (typeof content !== "string") {
		text = document.getElementById(content).textContent;
	} else {
		text = content;
	}
	navigator.clipboard.writeText(text);
}

async function readFile(filePath) {
	try {
		const response = await fetch(filePath);
		const fileContent = await response.text();
		return fileContent;
	} catch (error) {
		return -1;
	}
}

function copyFile(filePath) {
	readFile(filePath).then(function (result) {
		if (result === -1) {
			notify("Sorry. There was a problem copying the file. :c", "error");
			return;
		}

		CopyToClipboard(result);
		notify("Copying file contents to clipboard.", "info");
	});
}
