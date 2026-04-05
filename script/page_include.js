import "/script/jquery-3.7.1.min.js";

$(() => {
	var includes = $("[data-include]");
	$.each(includes, function () {
		var file = `${$(this).data("include")}.html`;
		$(this).load(file);
	});
});
