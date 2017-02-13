var Audio = function(){
	// sound effetcs //
	var negative_sfx = [];
	var positive_sfx = [];
	var current_negative;
	var current_positive;

	var init = function(){
		negative_sfx.push(document.getElementById('negative-1'));
		negative_sfx.push(document.getElementById('negative-2'));
		current_negative = document.getElementById('negative-1');


		positive_sfx.push(document.getElementById('positive-1'));
		positive_sfx.push(document.getElementById('positive-2'));
		positive_sfx.push(document.getElementById('positive-3'));
		positive_sfx.push(document.getElementById('positive-4'));
		positive_sfx.push(document.getElementById('positive-5'));
		positive_sfx.push(document.getElementById('positive-6'));

		// var background_sound = document.createElement("audio");
		// if(background_sound.canPlayType("audio/mpeg").length < 1){
		// 	background_sound.src = "./assets/audio/background_sound.ogg";	
		// 	console.log('no mp3');
		// }
		// else{
		// 	background_sound.src = "./assets/audio/background_sound.mp3";
		// 	console.log('mp3');
		// }
		
		// background_sound.volume = 0.3;
		// background_sound.loop = true;
		// background_sound.play();
		// playSnowflakeSound(true);	
		// setTimeout(function(){
		// 	// console.log("1 sec delay");
		// 	playSnowflakeSound(true)
		// },1000);
		// setTimeout(function(){
		// 	// console.log("3 sec delay");
		// 	playSnowflakeSound(true)
		// },3000);
		// setTimeout(function(){
		// 	// console.log("5 sec delay");
		// 	playSnowflakeSound(true)
		// },5000);
	};

	var playPositive = function(){
		getRandomFromArray(positive_sfx).play();
	};

	var playNegative = function(){
		// current_negative = getRandomFromArray(negative_sfx);
		current_negative.play();
	};

	var stopNegative = function() {
		current_negative.pause();
		current_negative.currentTime = 0;
	};

	var playSnowflakeSound = function(redo){
		// var temp_audio_element = document.createElement("audio");
		// if(temp_audio_element.canPlayType("audio/mpeg").length < 1){
		// 	temp_audio_element.src = "./assets/audio/chime" + Math.round(Level.getRandomArbitrary(2,8)) + ".ogg";
		// }
		// else{
		// 	temp_audio_element.src = "./assets/audio/chime" + Math.round(Level.getRandomArbitrary(2,8)) + ".mp3";
		// }
		// temp_audio_element.volume = 0.3;
		// temp_audio_element.play();
		// temp_audio_element.onended = function() {
		//     // alert("The audio has ended");
		//     this.remove();
		//     // playSnowflakeSound();
		//     if(redo){
		//     	// console.log('redoing');
		//     	playSnowflakeSound(redo);
		//     }
		// };
	};

	var getRandomFromArray = function(input_array) {
		var index = Math.round(Math.random() * (input_array.length - 1));  
		return input_array[index];
	};


	// public methods
	return{
		init: init,
		playPositive: playPositive,
		playNegative: playNegative,
		stopNegative: stopNegative
	}
}();
