var Interior = function(){

	var init = function(){

	};

	var activate = function(){
		// enable();
		document.getElementById("interior").style.display = "block";
	};

	var deactivate = function(){
		// disable();
		document.getElementById("interior").style.display = "none";
	};

	return {
		init: init,
		activate: activate,
		deactivate: deactivate
	};
}();