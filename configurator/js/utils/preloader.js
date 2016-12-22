var Preloader = function(){

	// preload and hide all the images!
	var init = function(){
		// TODO: tidy this up
		for (var i = configurator_data.colors.length - 1; i >= 0; i--) {
			var temp_image = document.createElement("img");
			temp_image.src = configurator_data.colors[i].swatch_file_path;
			temp_image.style.display = "none";
			document.getElementById("preloader").appendChild(temp_image);
		}

		for (var i = configurator_data.colors.length - 1; i >= 0; i--) {
			var temp_image = document.createElement("img");
			temp_image.src = configurator_data.colors[i].target_file_path;
			temp_image.style.display = "none";
			document.getElementById("preloader").appendChild(temp_image);
		}

		for (var i = configurator_data.wheels.length - 1; i >= 0; i--) {
			var temp_image = document.createElement("img");
			temp_image.src = configurator_data.wheels[i].hero_path;
			temp_image.style.display = "none";
			document.getElementById("preloader").appendChild(temp_image);
		}
	};

	// public methods
	return {
		init: init
	};
}();
