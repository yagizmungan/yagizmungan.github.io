var Audio = function(){
	var init = function(){
		var background_sound = document.createElement("audio");
		if(background_sound.canPlayType("audio/mpeg").length < 1){
			background_sound.src = "./assets/audio/background_sound.ogg";	
			console.log('no mp3');
		}
		else{
			background_sound.src = "./assets/audio/background_sound.mp3";
			console.log('mp3');
		}
		
		background_sound.volume = 0.3;
		background_sound.loop = true;
		background_sound.play();
		playSnowflakeSound(true);	
		setTimeout(function(){
			// console.log("1 sec delay");
			playSnowflakeSound(true)
		},1000);
		setTimeout(function(){
			// console.log("3 sec delay");
			playSnowflakeSound(true)
		},3000);
		setTimeout(function(){
			// console.log("5 sec delay");
			playSnowflakeSound(true)
		},5000);
	};

	var playSnowflakeSound = function(redo){
		var temp_audio_element = document.createElement("audio");
		if(temp_audio_element.canPlayType("audio/mpeg").length < 1){
			temp_audio_element.src = "./assets/audio/chime" + Math.round(Level.getRandomArbitrary(2,8)) + ".ogg";
		}
		else{
			temp_audio_element.src = "./assets/audio/chime" + Math.round(Level.getRandomArbitrary(2,8)) + ".mp3";
		}
		temp_audio_element.volume = 0.3;
		temp_audio_element.play();
		temp_audio_element.onended = function() {
		    // alert("The audio has ended");
		    this.remove();
		    // playSnowflakeSound();
		    if(redo){
		    	// console.log('redoing');
		    	playSnowflakeSound(redo);
		    }
		};
	};


	// public methods
	return{
		init: init,
		playSnowflakeSound: playSnowflakeSound
	}
}();
