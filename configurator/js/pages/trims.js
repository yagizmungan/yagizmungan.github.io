var Trims = function(){

	var init = function(){

	};

	var activate = function(){
		// enable();
		document.getElementById("trims").style.display = "block";
	};

	var deactivate = function(){
		// disable();
		document.getElementById("trims").style.display = "none";
	};

	return {
		init: init,
		activate: activate,
		deactivate: deactivate
	};
}();