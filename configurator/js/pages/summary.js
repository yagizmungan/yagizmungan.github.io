var Summary = function(){

	var init = function(){

	};

	var activate = function(){
		// enable();
		document.getElementById("summary").style.display = "block";
		$('#footer').hide();
	};

	var deactivate = function(){
		// disable();
		document.getElementById("summary").style.display = "none";
		$('#footer').show();
	};

	return {
		init: init,
		activate: activate,
		deactivate: deactivate
	};
}();