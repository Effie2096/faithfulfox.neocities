async function checkPerms(permissionName) {
	try {
		const permission = await navigator.permissions.query({ name: permissionName });

		if (permission.state !== 'granted') {
			return false
		}
		return true
	} catch (error) {
		if (error.name === "TypeError") {
			return true
		} 
	}

}

async function CopyToClipboard(content, message) {
	if (await checkPerms("clipboard-write") === false) {
		notify("Clipboard permission not granted.", "error")
		return
	}

	var msg = message ? message : "Copied to clipboard."
	var text = ""
	if (typeof content !== "string") {
		text = document.getElementById(content).textContent
	} else {
		text = content
	}
	navigator.clipboard.writeText(text)
	notify(`${msg}`)
}

async function readFile(filePath) {
	try {
		const response = await fetch(filePath)
		const fileContent = await response.text()
		return fileContent
	} catch (error) {
		return -1
	}
}

function copyFile(filePath) {
	readFile(filePath).then(function (result) {
		if (result === -1) {
			notify("Sorry. There was a problem copying the file. :c", "error")
			return
		}

		CopyToClipboard(result)
		notify("Copying file contents to clipboard.", "info")
	})
}
