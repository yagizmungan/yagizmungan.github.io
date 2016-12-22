var ExteriorColor = function(){

	var selection_window_visible = false;
	var selection_items = [];
	var selector_enabled = false;
	var hero_enabled = false;

	var pressure_block = {
		start: function(event){
			console.log('start', event);
		},

		change: function(force, event){
			if(force > 0.2 && hero_enabled){
				// alert('really');
				if(!selection_window_visible){
					console.log('change', force);
					showSelectorWindow();
				}
			}
		},

		startDeepPress: function(event){
			console.log('start deep press', event);
			// this.style.backgroundColor = '#FF0040';
		},

		endDeepPress: function(){
			console.log('end deep press');
			// this.style.backgroundColor = '#0080FF';
		},

		end: function(){
			console.log('end');
			// this.style.width = '200px';
			// this.innerHTML = 0;
		},

		unsupported: function(){
			console.log(this);
			// this.innerHTML = 'Your device / browser does not support this :(';
		}
	};

	var init = function(){
		// defaults and initialization
		document.getElementById("exterior-color-hero").src = configurator_data.colors[0].target_file_path;
		$('#exterior-color-selector-window-color-name').html(configurator_data.colors[0].name);
		$('#exterior-color-selector-window-color-price').html(getHumanReadablePrice(configurator_data.colors[0].price));
		Pressure.set(document.querySelectorAll('#main'), pressure_block , {polyfill: true, polyfillSpeed: 5000});

		setupSelectorWindow();

		// SUPER MESSY
		document.getElementById('main').addEventListener("touchmove", function(event){
			event.preventDefault();
			if(selector_enabled){
				var current_index = calculateFingerLocation(event.pageX, event.pageY);
				for (var i = selection_items.length - 1; i >= 0; i--) {
					if(i == current_index){
						selection_items[i].classList.add("color-selector-item-selected");
					}
					else{
						selection_items[i].classList.remove("color-selector-item-selected");
					}
				}

				$('#exterior-color-selector-window-color-name').html(configurator_data.colors[current_index].name);
				$('#exterior-color-selector-window-color-price').html(getHumanReadablePrice(configurator_data.colors[current_index].price));
			}
		});

		document.getElementById('main').addEventListener("touchend", function(event){
			event.preventDefault();
			if(selector_enabled){
				var current_index = calculateFingerLocation(event.pageX, event.pageY);
				setCarColor(current_index);
				selection_items[current_index].classList.remove("color-selector-item-selected");

				$('#exterior-color-selector-window-color-name').html(configurator_data.colors[current_index].name);
				$('#exterior-color-selector-window-color-price').html(getHumanReadablePrice(configurator_data.colors[current_index].price));
			}
		});
	};

	var showSelectorWindow = function(){
		$('#exterior-color-selector-window').fadeIn("slow", function(){
			enableSelector();
			disableHero();
		});
		selection_window_visible = true;
		// document.getElementById('selector-window').style.opacity = 1;
	};

	var setupSelectorWindow = function(){
		// loop through and iterate
		console.log(configurator_data);
		$('#exterior-color-selector-window').fadeOut(0);
		
		for (var i = 0; i < configurator_data.colors.length; i++) {
			data = configurator_data.colors[i];

			// background-image
			var img_element = document.createElement("div");
			img_element.style.backgroundImage = "url('" + data.swatch_file_path + "')";
			img_element.style.width = (window.innerWidth/3)+ "px";
			img_element.style.height = (window.innerHeight - 75)/4 + "px";
			img_element.style.backgroundSize = "100% 100%";


			img_element.classList.add("color-selector-item");    
			img_element.dataset.id = i;
			img_element.draggable = false;

			img_element.addEventListener("mouseup", function(event){
				console.log("here", event.target.dataset.id);
				setCarColor(event.target.dataset.id);
			});

			img_element.addEventListener("mouseover", function(event){
				event.target.classList.add("color-selector-item-selected");
				$('#exterior-color-selector-window-color-name').html(configurator_data.colors[event.target.dataset.id].name);
				$('#exterior-color-selector-window-color-price').html(getHumanReadablePrice(configurator_data.colors[event.target.dataset.id].price));
			});

			img_element.addEventListener("mouseout", function(event){
				console.log("mouseout");
				event.target.classList.remove("color-selector-item-selected");
			});

			document.getElementById("exterior-color-selector-window-main").appendChild(img_element);
			selection_items.push(img_element);
		}
	};

	var setCarColor = function(color_id){
		console.log("color_id", color_id);
		data = configurator_data.colors[color_id];
		document.getElementById("exterior-color-hero").src = configurator_data.colors[color_id].target_file_path;
		document.getElementById("exterior-color-title").innerHTML = configurator_data.colors[color_id].name;
		document.getElementById("exterior-color-price").innerHTML = getHumanReadablePrice(configurator_data.colors[color_id].price);  
		$('#exterior-color-selector-window').fadeOut("fast");
		selection_window_visible = false;
		disableSelector();
		enableHero();
	};

	var calculateFingerLocation = function(x,y){
		var x_prime = x / (window.innerWidth/3);  
		var y_prime = (y - 75) / ((window.innerHeight - 75) / 4);  
		var item_index = Math.floor(x_prime) + (Math.floor(y_prime) * 3);
		// console.log("x_prime",x_prime, "y_prime", y_prime, "item_index", item_index);
		return item_index;
	};

	var getHumanReadablePrice = function(input_price){
		var output_price;
		// console.log(input_price);

		if(input_price > 0){
			output_price = "$" + input_price;
		}
		else{
			output_price = "No charge";
		}

		return output_price;
	};

	var enableSelector = function(){			
		selector_enabled = true;
	};

	var disableSelector = function(){
		selector_enabled = false;
	};

	var enableHero = function(){
		hero_enabled = true;
	};

	var disableHero = function(){
		hero_enabled = false;
	};

	var activate = function(){
		disableSelector();
		enableHero();
		document.getElementById("exterior-color").style.display = "block";
	};

	var deactivate = function(){
		disableSelector();
		disableHero();
		document.getElementById("exterior-color").style.display = "none";
	};


	return {
		init: init,
		activate: activate,
		deactivate: deactivate
	};
}();	