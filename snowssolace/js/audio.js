var Audio = function(){



	var init = function(){
		var background_sound = document.createElement("audio");
		background_sound.src = "./assets/audio/background_sound.mp3";
		background_sound.volume = 0.03;
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
		temp_audio_element.src = "./assets/audio/chime" + Math.round(Level.getRandomArbitrary(2,8)) + ".mp3";
		temp_audio_element.volume = 0.03;
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
