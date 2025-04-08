function toggleToDo() {
	document.getElementById("updates").classList.toggle("active");
	document.getElementById("todo-list").classList.toggle("active");
	document.getElementById("postit").classList.toggle("active");
	var updateHeading = document.getElementById("update-heading");
	updateHeading.innerHTML =
		updateHeading.innerHTML == "To-do" ? "Updates" : "To-do";
}
