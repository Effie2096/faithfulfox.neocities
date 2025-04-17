function gallery() {
	document.querySelectorAll(".content-card").forEach((post) => {
		post.querySelectorAll(".media-card .gallery-card").forEach((gallery) => {
			const images = gallery.querySelectorAll("img");
			if (images.length > 3) {
				images.forEach((image, index) => {
					if (index > 2) {
						image.style.display = "none";
					}
				});
			}
		});
	});
}
