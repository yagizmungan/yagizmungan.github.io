var Login = function(){

	var init = function(){
		document.getElementById("login-fake-button").addEventListener("click", function(){
			App.nextScreen();
		});
		$("#login-fake-button").on("singleTap", function(){
			console.log("Asda");
			App.nextScreen();
		});	
	};

	var activate = function(){
		// enable();
		document.getElementById("login").style.display = "block";
		App.setGlobalNavigationEnabled(false);
	};

	var deactivate = function(){
		// disable();
		document.getElementById("login").style.display = "none";
		App.setGlobalNavigationEnabled(true);
	};

	return {
		init: init,
		activate: activate,
		deactivate: deactivate
	};
}();