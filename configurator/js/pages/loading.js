var Loading = function(){

	var init = function(){
		$('#loading-message').fadeOut(0);
		// setTimeout(function(){
		// 	// App.nextScreen();
		// }, 3000);
		// simulate loading...
		
	};

	var activate = function(){
		// enable();
		document.getElementById("loading").style.display = "block";
		App.setGlobalNavigationEnabled(false);	
		loadingAnimation();	
	};

	var deactivate = function(){
		// disable();
		document.getElementById("loading").style.display = "none";
		App.setGlobalNavigationEnabled(true);
	};

	var loadingAnimation = function(){
		$('#loading-logo').fadeOut('slow', function(){
			$('#loading-logo').fadeIn('slow', function(){
				$('#loading-logo').fadeOut('slow', function(){
					$('#loading-logo').fadeIn('slow', function(){
						$('#loading-logo').fadeOut('slow', function(){
							$('#loading-logo').fadeIn('slow', function(){
								$( "#loading-logo" ).animate({
							    		top: 223
						  			}, 
						  			400, 
						  			function() {
									    $('#loading-message').fadeIn('slow', function(){
										setTimeout(function(){
											App.nextScreen();
										}, 1000);
									});
								});								
							});
						});
					});
				});
			});
		});
	};

	return {
		init: init,
		activate: activate,
		deactivate: deactivate
	};
}();