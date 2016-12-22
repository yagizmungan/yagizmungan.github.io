var Wheel = function(){
	var enabled = false;
	var current_index = 0;

	var init = function(){	
		//set events


		//defaults	
		setWheel(current_index);

		$('#main').on("swipeLeft", function(){
			if(enabled){
				current_index++;
				if(current_index >= configurator_data.wheels.length){
					current_index = 0;
				}

				setWheel(current_index);
			}			
		});

		$('#main').on("swipeRight", function(){
			if(enabled){
				current_index--;
				if(current_index < 0){
					current_index = configurator_data.wheels.length - 1;
				}

				setWheel(current_index);
			}			
		});
	};

	var enable = function(){
		enabled = true;
	};

	var disable = function(){
		enabled = false;
	};

	var activate = function(){
		enable();
		document.getElementById("wheel").style.display = "block";
	};

	var deactivate = function(){
		disable();
		document.getElementById("wheel").style.display = "none";
	};

	var setWheel = function(index){
		document.getElementById("wheel-hero").src = configurator_data.wheels[index].hero_path;
		document.getElementById("wheel-title").innerHTML = configurator_data.wheels[index].name;
		document.getElementById("wheel-price").innerHTML = getWheelPrice(configurator_data.wheels[index].price);
		document.getElementById("wheel-description").innerHTML = configurator_data.wheels[index].description;
	};

	var getWheelPrice = function(input_price){
		var output_price;
		if(input_price > 0){
			output_price = "$" + input_price;
		}
		else{
			output_price = "Equipped as standard";
		}

		return output_price;
	};

	return {
		init: init,
		activate: activate,
		deactivate: deactivate
	};
}();