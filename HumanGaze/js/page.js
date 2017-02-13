var Page = function(){

	var init = function(){
		console.log('bds');
		document.getElementById("start-button").addEventListener("click", function(event){
			console.log("asd");
			$('html, body').stop().animate({
	            scrollTop: window.innerHeight
	        }, 1000);
		});
	};



	// public methods
	return{
		init: init
	}
}();