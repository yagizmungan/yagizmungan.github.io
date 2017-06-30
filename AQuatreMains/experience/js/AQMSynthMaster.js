AQMSynthMaster = function() {

	var audio_context;

	var master_volume;

	var reverb_node;
	var reverb_enabled = true;
	// ArbroathAbbeySacristy
	// AbernyteGrainSilo
	// KinoullAisle
	// InsidePiano
	// LadyChapelStAlbansCathedral
	var reverb_url = "./assets/audio/reverb/LadyChapelStAlbansCathedral.ogg"; 


	var BPM = 80;
	var BPM_resolution = 16;
	var quarter_notes_per_measure = 4;
	var beat_time = (60/BPM);
	var BPM_resolution_time = (beat_time * quarter_notes_per_measure) / (BPM_resolution);
	var measure_time = beat_time * quarter_notes_per_measure;
	var BPM_triggers = [];
	var beat_flags = [];
	var current_beat;
	var previous_beat;

	console.log('beat_time', beat_time);
	console.log('BPM_resolution_time', BPM_resolution_time);
	console.log('measure_time', measure_time);

	var init = function(autosetup){
		audio_context = new (window.AudioContext || window.webkitAudioContext)();
		reverbjs.extend(audio_context);


		master_volume = audio_context.createGain();
		master_volume.gain.value = 0.2;

		if(autosetup) {
			// initialize the instruments

		}	

		if(reverb_enabled) {
			reverb_node = audio_context.createReverbFromUrl(reverb_url, function() {
			  
			  master_volume.connect(reverb_node);
			  reverb_node.connect(audio_context.destination);
			});
		}
		else {
			master_volume.connect(audio_context.destination);
		}		

		// beat
		for(var i = 0; i < BPM_resolution; i++) {
			var BPM_slot = [];
			BPM_triggers.push(BPM_slot);
			beat_flags.push(false);
		}


	};

	var createSynth = function(type) {

		// type = 4;

		if(!audio_context){
			return;
		}
		var synth = {
			oscs : []
		};

		synth.fading = false;
		synth.master_freq = null;

		synth.vol_master = audio_context.createGain();
		synth.vol_master.gain.value = 0.0;

		// /** super saw **/
		if (type == 0) {
			var number_of_saws = 4;

			for(var i = 0; i < number_of_saws; i++) {
				var osc = audio_context.createOscillator();
				osc.type = 'sawtooth';
				osc.detune.value = (-5 + i) * 2;
				synth.oscs.push(osc);
				osc.connect(synth.vol_master);
				osc.start();
			}

			synth.default_volume = 0.2;
			synth.vol_master.connect(master_volume);
			/** super saw **/
		}

		else if(type == 1) {
			/** blade runner v1 **/
			var osc1 = audio_context.createOscillator();
			osc1.type = 'sawtooth';
			osc1.detune.value = -4;
			osc1.connect(synth.vol_master);
			synth.oscs.push(osc1);

			var osc2 = audio_context.createOscillator();
			osc2.type = 'sawtooth';
			osc2.detune.value = 4;
			osc2.connect(synth.vol_master);
			synth.oscs.push(osc2);

			var filter = audio_context.createBiquadFilter();
			filter.type = 'lowpass';
			filter.frequency.value = 440;
			// alert(filter.frequency.value);
			synth.vol_master.connect(filter);

			osc1.start();
			osc2.start();

			var scalargain = audio_context.createGain();
			scalargain.gain.value = 50;


			// synth.vol_master.connect(filter.Q);
			// synth.vol_master.connect(filter.frequency);
			synth.vol_master.connect(scalargain);
			scalargain.connect(filter.Q);

			synth.default_volume = 1.0;
			filter.connect(master_volume);
		}

		// ////FIND A WAY TO HANDLE CHANGING VOLUME////
		// /*
		// https://www.youtube.com/watch?v=Fne0oIEv-WI
		// http://www.bytenoise.co.uk/How_to_Sound_Like_Vangelis
		// https://www.gearslutz.com/board/electronic-music-instruments-electronic-music-production/786642-show-us-your-blade-runner-type-synth-brass.html
		// http://www.musictech.net/2016/08/the-7-deadly-synth-sounds/
		// https://noisehack.com

		// https://github.com/burnson/Reverb.js/tree/master
		// https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createConvolver
		// */
		// /** blade runner v1  **/



		/** blade runner v2 **/
		else if (type == 2) {
			var osc1 = audio_context.createOscillator();
			osc1.type = 'sawtooth';
			osc1.detune.value = -4;
			osc1.connect(synth.vol_master);
			synth.oscs.push(osc1);

			var osc2 = audio_context.createOscillator();
			osc2.type = 'sawtooth';
			osc2.detune.value = 4;
			osc2.connect(synth.vol_master);
			synth.oscs.push(osc2);

			var filter = audio_context.createBiquadFilter();
			// filter.type = 'lowpass';
			filter.frequency.value = 440;
			// alert(filter.frequency.value);
			synth.vol_master.connect(filter);

			osc1.start();
			osc2.start();

			var scalargain = audio_context.createGain();
			scalargain.gain.value = 50;


			// synth.vol_master.connect(filter.Q);
			// synth.vol_master.connect(filter.frequency);
			synth.vol_master.connect(scalargain);
			scalargain.connect(filter.Q);

			synth.default_volume = 1.0;
			filter.connect(master_volume);
		}

		////FIND A WAY TO HANDLE CHANGING VOLUME////
		/*
		https://www.youtube.com/watch?v=Fne0oIEv-WI
		http://www.bytenoise.co.uk/How_to_Sound_Like_Vangelis
		https://www.gearslutz.com/board/electronic-music-instruments-electronic-music-production/786642-show-us-your-blade-runner-type-synth-brass.html
		http://www.musictech.net/2016/08/the-7-deadly-synth-sounds/
		https://noisehack.com

		https://github.com/burnson/Reverb.js/tree/master
		https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createConvolver
		*/
		/** blade runner v2  **/

		/** base synth **/
		// https://music.tutsplus.com/tutorials/essential-synthesis-part-3-synth-bass--audio-6844
		else if (type == 3) {
			var osc1 = audio_context.createOscillator();
			osc1.type = 'sawtooth';
			osc1.detune.value = +4;
			synth.oscs.push(osc1);

			var osc2 = audio_context.createOscillator();
			osc2.type = 'sawtooth';
			osc2.detune.value = -4;
			synth.oscs.push(osc2);

			var osc3 = audio_context.createOscillator();
			osc3.type = 'sine';
			synth.oscs.push(osc3);

			var osc3_gain = audio_context.createGain();
			osc3_gain.gain.value = 0.7;
			osc3.connect(osc3_gain);

			var filter = audio_context.createBiquadFilter();
			filter.type = 'lowpass';
			filter.frequency.value = 220;
			filter.Q.value = 10;
			
			// osc1.connect(filter);
			// osc2.connect(filter);
			// osc3.connect(filter);

			

			synth.default_volume = 1.0;
			// filter.connect(master_volume);

			

			var distortion = audio_context.createWaveShaper();
			distortion.curve = makeDistortionCurve(40);
			distortion.oversample = '4x';

			osc1.connect(synth.vol_master);
			osc2.connect(synth.vol_master);
			osc3_gain.connect(synth.vol_master);

			// synth.vol_master.connect(distortion);		
			synth.vol_master.connect(filter);
			// distortion.connect(filter);
			filter.connect(master_volume);

			osc1.start();
			osc2.start();
			osc3.start();
		}	

		/** base synth **/


		/** kickdrum **/
		else if (type == 4) {
			//https://dev.opera.com/articles/drum-sounds-webaudio/
			synth.osc1 = audio_context.createOscillator();
			// synth.oscs.push(osc1);
			// var gain =
			synth.osc1_gain = audio_context.createGain();

			synth.osc1.frequency.value = 150;
			synth.osc1_gain.gain.value = 20;
			synth.master_freq = 150;

			synth.osc1.connect(synth.osc1_gain);
			synth.default_volume = 0.4;

			synth.osc1_gain.connect(synth.vol_master);
			// synth.osc1.connect(synth.vol_master);
			synth.vol_master.connect(master_volume);

			synth.osc1.start();
			synth.vol_master.gain = 1;
		}
		/** kickdrum **/

		synth.type = type;
		

		// console.log(synth);
		// setFreq(synth, target_freq);

		return synth;
	};


	var makeDistortionCurve = function(amount) {
		var k = typeof amount === 'number' ? amount : 50,
			n_samples = 44100,
			curve = new Float32Array(n_samples),
			deg = Math.PI / 180,
			i = 0,
			x;
		for ( ; i < n_samples; ++i ) {
			x = i * 2 / n_samples - 1;
			curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
		}
		return curve;
	};

	var setGlobalSynthFreq = function(index, freq) {
		instruments[index].osc1.frequency.value = freq;
		instruments[index].osc2.frequency.value = freq * instruments[index].osc2_freq;
		if(instruments[index].osc3){
			instruments[index].osc3.frequency.value = freq * instruments[index].osc3_freq;
		}
	};

	var setFreq = function(synth, freq){
		// console.log(synth);
		// synth.osc1.frequency.value = freq;
		// synth.osc2.frequency.value = freq * instruments[synth.type].osc2_freq;
		// if(synth.osc3){
		// 	synth.osc3.frequency.value = freq * instruments[synth.type].osc3_freq;
		// }

		if(synth.master_freq == null) {
			synth.master_freq  = freq;
		}

		var temp_freq = freq;
		for (var i = synth.oscs.length - 1; i >= 0; i--) {
			freq = temp_freq;
			if(synth.type == 3) {
				freq = freq/2;
				if(i == 2) {
					freq = freq/2;
				}
			}			
			synth.oscs[i].frequency.value = freq;
		}


	};	

	var setGlobalSynthVol = function(index, vol){
		instruments[index].vol_master.gain.value = vol;
	};

	var setVol = function(synth, vol){
		synth.vol_master.gain.value = vol;
	};

	var synthFadeOut = function (synth) {
		if(synth.type == 0){
			// /** super saw **/\
			if(isFunction(synth.vol_master.gain.cancelAndHoldAtTime)) {
				synth.vol_master.gain.cancelAndHoldAtTime(audio_context.currentTime);
			}
			else {
				var current_value = synth.vol_master.gain.value;
				// console.log(current_value);
				synth.vol_master.gain.cancelScheduledValues(audio_context.currentTime);	
				synth.vol_master.gain.value = current_value;
			}
    		var target_time = audio_context.currentTime + 0.1;
			synth.vol_master.gain.linearRampToValueAtTime(0.0, target_time);
		}
		else if(synth.type == 1) {
			//** blade runner v1**//
			if(isFunction(synth.vol_master.gain.cancelAndHoldAtTime)) {
				synth.vol_master.gain.cancelAndHoldAtTime(audio_context.currentTime);
			}
			else {
				var current_value = synth.vol_master.gain.value;
				console.log(current_value);
				synth.vol_master.gain.cancelScheduledValues(audio_context.currentTime);	
				synth.vol_master.gain.value = current_value;
			}
			var target_time = audio_context.currentTime + 0.5;
			synth.vol_master.gain.linearRampToValueAtTime(0.0, target_time);
		}
		else if(synth.type == 2) {
			//** blade runner v1**//
			if(isFunction(synth.vol_master.gain.cancelAndHoldAtTime)) {
				synth.vol_master.gain.cancelAndHoldAtTime(audio_context.currentTime);
			}
			else {
				var current_value = synth.vol_master.gain.value;
				console.log(current_value);
				synth.vol_master.gain.cancelScheduledValues(audio_context.currentTime);	
				synth.vol_master.gain.value = current_value;
			}
			var target_time = audio_context.currentTime + 2;
			synth.vol_master.gain.linearRampToValueAtTime(0.0, target_time);
		}
		else if(synth.type == 3) {
			//** bass synth**//
			if(isFunction(synth.vol_master.gain.cancelAndHoldAtTime)) {
				synth.vol_master.gain.cancelAndHoldAtTime(audio_context.currentTime);
			}
			else {
				var current_value = synth.vol_master.gain.value;
				console.log(current_value);
				synth.vol_master.gain.cancelScheduledValues(audio_context.currentTime);	
				synth.vol_master.gain.value = current_value;
			}			
			var target_time = audio_context.currentTime + 0.5;
			synth.vol_master.gain.linearRampToValueAtTime(0.0, target_time);

			// synth.vol_master.gain.value = 0;
		}

		else if(synth.type == 4) {
			//** kick drum **//
			// synth.vol_master.gain.cancelAndHoldAtTime(audio_context.currentTime);			
			// var target_time = audio_context.currentTime + 0.5;
			// synth.vol_master.gain.linearRampToValueAtTime(0.0, target_time);

			// synth.vol_master.gain.value = 0;
		}
	};

	var update = function() {
		// return;
		// console.log('hey there');
		if(audio_context){
			previous_beat = current_beat;
			var current_time = audio_context.currentTime;
			var inside_measure_time = current_time % measure_time;

			current_beat = Math.floor(inside_measure_time/BPM_resolution_time);			

			if(current_beat != previous_beat) {
				// this is a new beat
				for(var i = 0; i < BPM_triggers[current_beat].length; i++ ) {
					if(BPM_triggers[current_beat][i]) {
						if(BPM_triggers[current_beat][i].freq) {
							if(BPM_triggers[current_beat][i].synth.type == 4){
								synthFadeIn(BPM_triggers[current_beat][i].synth);
							}
							else {
								setFreq(BPM_triggers[current_beat][i].synth, BPM_triggers[current_beat][i].freq);
							}
						}
					}
				}
			}
		}
	};

	var synthFadeIn = function (synth) {
		if(synth.type == 0){
			/** super saw **/
			var target_time = audio_context.currentTime + 1;
			synth.vol_master.gain.linearRampToValueAtTime(parseFloat(synth.default_volume), target_time);
		}
		else if (synth.type == 1) {
			//** blade runner v1**//
	    	var target_time = audio_context.currentTime + 1;
	    	if(isFunction(synth.vol_master.gain.cancelAndHoldAtTime)) {
	    		synth.vol_master.gain.cancelAndHoldAtTime(audio_context.currentTime);
	    	}
	    	else {
	    		synth.vol_master.gain.cancelScheduledValues(audio_context.currentTime);	
	    	}
			synth.vol_master.gain.linearRampToValueAtTime(parseFloat(synth.default_volume), target_time);
		}
		else if (synth.type == 2) {		
			//** blade runner v1**//
	    	var target_time = audio_context.currentTime + 2;
	    	if(isFunction(synth.vol_master.gain.cancelAndHoldAtTime)) {
	    		synth.vol_master.gain.cancelAndHoldAtTime(audio_context.currentTime);
	    	}
	    	else {
	    		synth.vol_master.gain.cancelScheduledValues(audio_context.currentTime);	
	    	}
			synth.vol_master.gain.linearRampToValueAtTime(parseFloat(synth.default_volume), target_time);
		}
		else if (synth.type == 3) {		
			// synth.vol_master.gain.value = parseFloat(synth.default_volume);


			//** bass synth**//
	    	var target_time = audio_context.currentTime + 0.5;
	    	if(isFunction(synth.vol_master.gain.cancelAndHoldAtTime)) {
	    		synth.vol_master.gain.cancelAndHoldAtTime(audio_context.currentTime);
	    	}
	    	else {
	    		synth.vol_master.gain.cancelScheduledValues(audio_context.currentTime);	
	    	}
			synth.vol_master.gain.linearRampToValueAtTime(parseFloat(synth.default_volume), target_time);
		}
		else if (synth.type == 4) {		
			//* kick drum *//
			var target_time = audio_context.currentTime + 0.01;

			
			if(isFunction(synth.osc1.frequency.cancelAndHoldAtTime)) {
	    		synth.osc1.frequency.cancelAndHoldAtTime(audio_context.currentTime);
	    	}
	    	else {
	    		synth.osc1.frequency.cancelScheduledValues(audio_context.currentTime);	
	    	}
			synth.osc1.frequency.value = 100;

			if(isFunction(synth.vol_master.gain.cancelAndHoldAtTime)) {
	    		synth.vol_master.gain.cancelAndHoldAtTime(audio_context.currentTime);
    		}
    		else {
    			synth.vol_master.gain.cancelScheduledValues(audio_context.currentTime);	
    		}
			synth.vol_master.gain.value = parseFloat(synth.default_volume);

			synth.osc1.frequency.exponentialRampToValueAtTime(0.0001, audio_context.currentTime + 1.5);
			synth.vol_master.gain.exponentialRampToValueAtTime(0.0001, audio_context.currentTime + 1.5);
		}
	};

	var stopGlobalSynth = function (index){
		// instruments[index].osc1.stop(0);
		// instruments[index].osc2.stop(0);
		// if(instruments[index].osc3){
		// 	instruments[index].osc3.stop(0);
		// }	
	};

	var addArpeggiation = function(synth, freq, beat_difference) {
		// console.log('arpeggiation added');
		var target_beat = (current_beat + beat_difference) % BPM_resolution;
		synth.arpeggiation_index = BPM_triggers[target_beat].length;
		BPM_triggers[target_beat].push({
			"synth": synth,
			"freq": freq
		});
		// console.log(BPM_triggers);
	};

	var removeArpeggiation = function(index) {
		for (var i = 0; i < BPM_triggers.length; i++) {
			// BPM_triggers[i].splice(index, 1);
			BPM_triggers[i][index] = null;
		}
	};

	var stopSynth = function (synth){
		// synth.osc1.stop(0);
		// synth.osc2.stop(0);
		// if(synth.osc3){
		// 	synth.osc3.stop(0);
		// }	
	};

	var startGlobalSynth = function (index){
		instruments[index].osc1.start();
		instruments[index].osc2.start();
		if(instruments[index].osc3){
			instruments[index].osc3.start();
		}	
	};

	var startSynth = function (synth){
		synth.osc1.start();
		synth.osc2.start();
		if(synth.osc3){
			synth.osc3.start();
		}	
	};

	var setMasterVol = function(new_volume){
		master_volume.gain.value = new_volume;
	};

	var toggleReverb = function() {
		master_volume.disconnect();
		if(!reverb_enabled) {
			if(!reverb_node) {
				reverb_node = audio_context.createReverbFromUrl(reverb_url, function() {			  
					master_volume.connect(reverb_node);
					reverb_node.connect(audio_context.destination);
				});
			}
			else{
				master_volume.connect(reverb_node);
				reverb_node.connect(audio_context.destination);
			}
		}
		else {
			// master_volume.disconnect();
			master_volume.connect(audio_context.destination);
			// reverb_node = null;
			reverb_node.disconnect();
		}	

		reverb_enabled = !reverb_enabled;
	}

	var isFunction = function(test_function) {
  		var result = typeof(test_function) === typeof(Function);
  		return result;
	}

	return {
    	init: init,
    	setFreq: setFreq,
    	setVol: setVol,
    	stopSynth: stopSynth,
    	startSynth: startSynth,
    	setMasterVol: setMasterVol,
    	synthFadeIn: synthFadeIn,
    	synthFadeOut: synthFadeOut,
    	createSynth: createSynth,
    	toggleReverb: toggleReverb,
    	addArpeggiation: addArpeggiation,
    	removeArpeggiation: removeArpeggiation,
    	update: update
  	}
}();
