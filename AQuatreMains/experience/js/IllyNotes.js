var IllyNotes = function(){
	var reference_note = 110;
	var notes = [reference_note];
	var notes_length = 36;//36
	var current_note= notes_length/2;
	var major = [2,2,1,2,2,2,1];
	var minor = [2,1,2,2,1,2,2];

	var scale = minor;
	//fn = f0 * (a)n 

	var init = function(){
		var j=0
		for (var i = 0; i < notes_length; i++) {
			var scale_index = i%scale.length;
			// if(scale_index < 0){
			// 	scale_index += major.length;
			// }
			// if(scale_index == -0){
			// 	scale_index = 0;
			// }
			// console.log(scale_index);
			// console.log(j+major[i%major.length]);
			var new_note = reference_note * Math.pow(Math.pow(2, (1/12)), j+scale[scale_index]);
			j = (j+scale[i%scale.length]);
			notes.push(Math.round(new_note));
		}		
		// console.log(notes);
;	};

	var getRandom = function(){
		var index =  Viz.randInt(0, notes_length);

		return notes[index];
	};

	var getSequential = function(){
		var rand = Math.random();
		if(rand < 0.2){
			current_note -= 2;
		}
		else if(rand < 0.4){
			current_note -= 1;
		}
		else if(rand < 0.6){

		}
		else if(rand < 0.8){
			current_note += 1;
		}
		else{
			current_note += 2;
		}

		if(current_note < 0){
			current_note = 0;
		}

		if(current_note > notes_length-1){
			current_note = notes_length-1;
		}
		console.log(current_note);
		console.log(notes[current_note]);
		return notes[current_note];
	};

	var getExact = function(index){
		return notes[index];
	};

	var getNumberofNotes = function(){
		return notes_length;
	};


	// public methods
	return{
		init: init,
		getRandom: getRandom,
		getSequential: getSequential,
		getExact: getExact,
		getNumberofNotes: getNumberofNotes
	}
}();