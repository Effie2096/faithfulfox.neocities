var xhr = new XMLHttpRequest();

xhr.open("GET", "pages/posts/foggs.html", true);
xhr.onreadystatechange = function () {
	if (this.readyState !== 4) return;
	if (this.status !== 200) return; // or whatever error handling you want
	document.getElementById("content-card").innerHTML = this.responseText;
};
xhr.send();
