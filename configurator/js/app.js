var App = function(){

	var current_view_index = 0;
	var global_navigation_enabled = false;
	var views = [
		Login,
		Loading,
		Trims,
		ExteriorColor,
		Wheel,
		Interior,
		Summary
	];


	var init = function(){
		//preload and/or appcache all the assets
		Preloader.init();

		$.pressureConfig({
			polyfill: false
		});

		document.addEventListener('touchmove', function(event){
			event.preventDefault();
		});

		for (var i = views.length - 1; i >= 0; i--) {
			views[i].init();
			views[i].deactivate();
			// properly disable them
		}

		Landscape.init();
		// Landscape.activate();
		Landscape.deactivate();

		//default start
		views[current_view_index].activate();

		//for jumping to a random page
		// views[3].activate();


		//setup footer action
		$('#main').on("swipeDown", function(){
			console.log("swiping down",global_navigation_enabled);
			// previous
			if(global_navigation_enabled){
				previousScreen();
			}
		});

		$('#main').on("swipeUp", function(){
			console.log("swiping up",global_navigation_enabled);
			// next
			if(global_navigation_enabled){
				nextScreen();
			}
		});

		document.addEventListener("orientationchange", function() {
			// alert("the orientation of the device is now " + screen.orientation.angle);
			console.log(screen);
			if(window.orientation != 0){
				//trigger portrait mode
				Landscape.activate();
				views[current_view_index].deactivate();
			}
			else{
				//trigger landscape
				Landscape.deactivate();
				views[current_view_index].activate();
			}
		});

		document.addEventListener("resize", function() {
			var aspect_ratio = window.innerWidth/window.innerHeight;
			if(aspect_ratio > 1){
				//trigger landscape mode
			}
			else{
				//trigger portrait mode
			}
		});
	};

	var nextScreen = function(){   
		
		current_view_index++;	

		if(current_view_index > views.length -1){
			current_view_index = views.length -1;
		}
		else{
			views[current_view_index-1].deactivate();
			views[current_view_index].activate();
		}
	};

	var previousScreen = function(){  

		current_view_index--;

		if(current_view_index < 0){
			current_view_index = 0;
		}
		else{
			views[current_view_index+1].deactivate();
			views[current_view_index].activate();
		}
	};

	var setGlobalNavigationEnabled = function(new_state){
		global_navigation_enabled = new_state;
	};

	var setMode = function(){

	};

	// public methods
	return {
		init: init,
		nextScreen: nextScreen,
		previousScreen: previousScreen,
		setGlobalNavigationEnabled: setGlobalNavigationEnabled
	};
}();
