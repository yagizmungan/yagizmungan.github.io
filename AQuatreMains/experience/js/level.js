var Level = function(){

	var number_of_notes;

	var raycast_targets = [];
	var debug_sphere_position = null;
	var debug_sphere;
	var mouse = { x: 0, y: 0 };
	var selectedFaces = [];

	var hexagon_size = 1;
	var hexagons = {
		'meshes': [],
		'synths': [],
		'colors': []
	};
	// var hexagon_material;
	var dome_radius = 6.66;
	var dome_radius_vr = 0.7;
	var webvr_size_scalar = 1;
	var instruments_created = false;

	var vr_hexagon_y = 1.4;

	var current_highlights = [];
	var previous_highlights = [];
	var hexagons_mode2 = [];
	var hexagons_mode2_removal = [];
	var hexagons_mode2_addition = [];

	var hexagons_mode3 = [];
	var hexagons_mode3_removal = [];
	var hexagons_mode3_addition = [];

	var hexagon_geometry;
	var hexagon_lines_geometery;
	var hexagon_lines_material;

	var active_synths = [];

	var freq_scale = Math.pow(2, 1/12);

	var reset_timer = null;
	var reset_timer_time = 1000 * 60;

	// // particles //
	// var tick = 0;
	// var particle_system;

	// var spawnerOptions = {
	// 	spawnRate: 15000,
	// 	horizontalSpeed: 1.5 * 10,
	// 	verticalSpeed: 1.33 * 10,
	// 	timeScale: 0.1
	// };

	// var options = {
	// 	position: new THREE.Vector3(),
	// 	positionRandomness: 5,
	// 	velocity: new THREE.Vector3(),
	// 	velocityRandomness: 5,
	// 	color: 0xaa88ff,
	// 	colorRandomness: 10,
	// 	turbulence: 2,
	// 	lifetime: 2,
	// 	size: 5,
	// 	sizeRandomness: 1
	// };
	// // particles //
	
	var init = function(){
		if(App.getVrCanWork()){
			dome_radius = dome_radius_vr;
			webvr_size_scalar =  dome_radius/5*dome_radius_vr;

			// App.getController1().addEventListener( 'triggerdown', checkHandHits );
		}
		else{
			vr_hexagon_y = 0;
		}
		number_of_notes = IllyNotes.getNumberofNotes();

		var manager = new THREE.LoadingManager();
		manager.onProgress = function ( item, loaded, total ) {
			console.log( item, loaded, total );
		};

		var onProgress = function ( xhr ) {
			if ( xhr.lengthComputable ) {
				var percentComplete = xhr.loaded / xhr.total * 100;
				console.log( Math.round(percentComplete, 2) + '% downloaded' );
			}
		};

		var onError = function ( xhr ) {

		};


		document.addEventListener( 'mousedown', onDocumentMouseDown, false );
		document.addEventListener( 'mousemove', onDocumentMouseMove, false );
		// document.addEventListener( 'contextmenu', onDocumentRightClick, false);
		document.addEventListener('keydown', (event) => {
			if(event.keyCode == 71) {
				onDocumentRightClick ();
			}

			if(event.keyCode == 49) {
				silenceAllSynths();
			}
		});

		var loader = new THREE.ColladaLoader();
		loader.options.convertUpAxis = true;
		loader.load( './assets/models/hexagon2.dae', function ( collada ) {
			dae = collada.scene;
			dae.traverse( function ( child ) {
				if ( child instanceof THREE.SkinnedMesh ) {
					var animation = new THREE.Animation( child, child.geometry.animation );
					animation.play();
				}
			} );
			
			dae.updateMatrix();
			
			// console.log(dae);

			// App.getScene().add(dae);
			hexagon_geometry = new THREE.Geometry().fromBufferGeometry( dae.children[0].children[0].geometry );
			// for geometry 2
			var hexagon_geometry_p2 = new THREE.Geometry().fromBufferGeometry( dae.children[0].children[3].geometry );
			hexagon_geometry.merge(hexagon_geometry_p2, hexagon_geometry_p2.matrix);
			// hexagon_lines_geometery = new THREE.Geometry().fromBufferGeometry( dae.children[0].children[2].geometry );

			setupHexagons();
		} );
	};

	var setupHexagons = function(){
		var angle_x = 0;
		var angle_y = 0;
		var angle_z = 0;

		var target_angle = Math.PI;
		var angle_step = Math.PI/12;

		angle_y = 0;
		var synth_id = 0;
		var hexagon_color;
		for (var angle_x = 0; angle_x < target_angle * 2 - angle_step/2; angle_x += angle_step) {
			// hexagon_color = getHEXfromRGB(255, Math.round(255 * (angle_x / (target_angle * 2))), Math.round(255 * (angle_x / (target_angle * 2))));

			if(angle_x == 0) {
				hexagon_color = 0xffffff;
			}
			else {
				hexagon_color = null;
			}
			
			var note_index = hexagons.synths.length%number_of_notes;
			var freq = IllyNotes.getExact(note_index);

			var hexagon = createHexagon(hexagon_size * Math.cos(angle_y), synth_id, hexagon_color, freq);
			hexagon.position.y = Math.sin(angle_y) * dome_radius + vr_hexagon_y;// - hexagon_size;
			hexagon.position.x = Math.sin(angle_x) * dome_radius;
			hexagon.position.z = Math.cos(angle_x) * dome_radius;
			hexagon.lookAt(new THREE.Vector3(0,(0 + vr_hexagon_y),0));

			

			raycast_targets.push(hexagon);
		}

		angle_y = (Math.PI/2)* (1/6);
		synth_id = 1;
		var note_index = 0;
		for (var angle_x = angle_step/2; angle_x < target_angle * 2; angle_x += angle_step) {
			// hexagon_color = getHEXfromRGB(Math.round(255 * (angle_x / (target_angle * 2))), Math.round(255 * (angle_x / (target_angle * 2))), 255);
			// var note_index = hexagons.synths.length%number_of_notes;

			if(angle_x == angle_step/2) {
				hexagon_color = 0xcccccc;
			}
			else {
				hexagon_color = null;
			}

			var freq = IllyNotes.getExact(note_index);
			note_index++;

			var hexagon = createHexagon(hexagon_size * Math.cos(angle_y), synth_id, hexagon_color, freq);

			hexagon.position.y = Math.sin(angle_y) * dome_radius + vr_hexagon_y;
			hexagon.position.x = Math.sin(angle_x) * dome_radius * Math.cos(angle_y);
			hexagon.position.z = Math.cos(angle_x) * dome_radius * Math.cos(angle_y);
			hexagon.lookAt(new THREE.Vector3(0,(0 + vr_hexagon_y),0));

			raycast_targets.push(hexagon);			
		}

		angle_y = (Math.PI/2)* (2/6);
		synth_id = 2;

		note_index = 6;
		for (var angle_x = 0; angle_x < target_angle * 2 - target_angle/24; angle_x += target_angle/12) {
			// hexagon_color = getHEXfromRGB(Math.round(255 * (angle_x / (target_angle * 2))), 255, Math.round(255 * (angle_x / (target_angle * 2))));

			if(angle_x == 0) {
				hexagon_color = 0x999999;
			}
			else {
				hexagon_color = null;
			}
				
			var freq = IllyNotes.getExact(note_index);
			note_index++;

			var hexagon = createHexagon(0.85, synth_id, hexagon_color, freq);

			hexagon.position.y = Math.sin(angle_y) * dome_radius + vr_hexagon_y;
			hexagon.position.x = Math.sin(angle_x) * dome_radius * Math.cos(angle_y);
			hexagon.position.z = Math.cos(angle_x) * dome_radius * Math.cos(angle_y);
			hexagon.lookAt(new THREE.Vector3(0,(0 + vr_hexagon_y),0));
			
			raycast_targets.push(hexagon);
		}

		angle_y = (Math.PI/2)* (3/6);
		synth_id = 3;

		for (var angle_x = angle_step/2; angle_x < target_angle * 2; angle_x += target_angle/9) {
			// hexagon_color = getHEXfromRGB(Math.round(255 * (angle_x / (target_angle * 2))), Math.round(155 * (angle_x / (target_angle * 2))), 55);
			if(angle_x == angle_step/2) {
				hexagon_color = 0x666666;
			}
			else {
				hexagon_color = null;
			}

			note_index = hexagons.synths.length%number_of_notes;
			var freq = IllyNotes.getExact(note_index);
			var hexagon = createHexagon(0.9, synth_id, hexagon_color,freq);

			hexagon.position.y = Math.sin(angle_y) * dome_radius + vr_hexagon_y;
			hexagon.position.x = Math.sin(angle_x) * dome_radius * Math.cos(angle_y);
			hexagon.position.z = Math.cos(angle_x) * dome_radius * Math.cos(angle_y);
			hexagon.lookAt(new THREE.Vector3(0,(0 + vr_hexagon_y),0));

			raycast_targets.push(hexagon);
		}

		angle_y = (Math.PI/2)* (4/6);
		synth_id = 2;

		note_index = 24;
		for (var angle_x = angle_step/2; angle_x < target_angle * 2; angle_x += target_angle/6) {
			if(angle_x == angle_step/2) {
				hexagon_color = 0x333333;
			}
			else {
				hexagon_color = null;
			}

			// hexagon_color = getHEXfromRGB(Math.round(125 * (angle_x / (target_angle * 2))), Math.round(255 * ((target_angle * 2 - angle_x )/ (target_angle * 2))), 55);
			var freq = IllyNotes.getExact(note_index);
			note_index ++;
			var hexagon = createHexagon(1, synth_id, hexagon_color, freq);

			hexagon.position.y = Math.sin(angle_y) * dome_radius + vr_hexagon_y;
			hexagon.position.x = Math.sin(angle_x) * dome_radius * Math.cos(angle_y);
			hexagon.position.z = Math.cos(angle_x) * dome_radius * Math.cos(angle_y);
			hexagon.lookAt(new THREE.Vector3(0,(0 + vr_hexagon_y),0));
			
			raycast_targets.push(hexagon);
		}

		angle_y = (Math.PI/2)* (5/6);
		synth_id = 1;
		note_index = 24;

		for (var angle_x = 0; angle_x < target_angle * 2 - target_angle/6; angle_x += target_angle/3) {
			if(angle_x == 0) {
				hexagon_color = 0x000000;
			}
			else {
				hexagon_color = null;
			}

			// hexagon_color = getHEXfromRGB(Math.round(125 * (angle_x / (target_angle * 2))), Math.round(255 * ((target_angle * 2 - angle_x )/ (target_angle * 2))),  Math.round(255 * ((target_angle * 2 - angle_x )/ (target_angle * 2))));
			var freq = IllyNotes.getExact(note_index);
			note_index ++;
			var hexagon = createHexagon(1, synth_id, hexagon_color, freq);
			
			hexagon.position.y = Math.sin(angle_y) * dome_radius + vr_hexagon_y;
			hexagon.position.x = Math.sin(angle_x) * dome_radius * Math.cos(angle_y);
			hexagon.position.z = Math.cos(angle_x) * dome_radius * Math.cos(angle_y);
			hexagon.lookAt(new THREE.Vector3(0,(0 + vr_hexagon_y),0));			

			raycast_targets.push(hexagon);
		}

		angle_y = (Math.PI/2)* (6/6);
		synth_id = 4;
		hexagon_color = null;
		
		var hexagon = createHexagon(1, synth_id, hexagon_color, 150);
		hexagon.position.y = dome_radius + vr_hexagon_y;
		hexagon.position.x = 0;
		hexagon.lookAt(new THREE.Vector3(0,(0 + vr_hexagon_y),0));
		raycast_targets.push(hexagon);

		instruments_created = true;


		// App.setupControls();
		if(App.getVrCanWork()) {
			App.getController1().addEventListener( 'triggerdown', function() {
				// if(App.getVREffect().isPresenting) {
				// 	App.getVREffect().requestPresent();
				// }
				checkHandHits(App.getController1(), 1);
			});
			App.getController2().addEventListener( 'triggerdown', function() {
				// if(App.getVREffect().isPresenting) {
				// 	App.getVREffect().requestPresent();
				// }
				checkHandHits(App.getController2(), 1);
			});

			App.getController1().addEventListener('thumbpaddown', function() {
				AQMSynthMaster.toggleReverb();
			});
			App.getController2().addEventListener('thumbpaddown', function() {
				AQMSynthMaster.toggleReverb();
			});

			
			App.getController1().addEventListener( 'gripsdown', function(){
				checkHandHits(App.getController1(), 2);
			});
			App.getController2().addEventListener( 'gripsdown', function(){
				checkHandHits(App.getController2(), 2);
			});			
		}
	};

	var createHexagon = function(size, synths_index, hexagon_color, freq) {
		// console.log(freq);
		var hexagon_material = new THREE.MeshPhongMaterial({ 
			color: 0xffffff, 
			specular: 0xdddddd, 
			shininess: 10, 
			morphTargets: true, 
			// opacity: 0.8,
			// transparent: true,
			vertexColors: THREE.FaceColors, 
			shading: THREE.FlatShading 
		});

		var hexagon = new THREE.Mesh(hexagon_geometry.clone(), hexagon_material);
		
		hexagon.default_vertices = [];
		hexagon.pulse_direction = 1;
		hexagon.animation_scale = 1;

		let vertices = hexagon.geometry.vertices;
		for (var i = 0; i < vertices.length; i++) {
			hexagon.default_vertices.push({
				x: 0,
				y: 0,
				z: 0
			})
			hexagon.default_vertices[i].x=vertices[i].x;
			hexagon.default_vertices[i].y=vertices[i].y;
			hexagon.default_vertices[i].z=vertices[i].z;
		}


		hexagon.scale.x = hexagon.scale.y = hexagon.scale.z = 0.045 * size * webvr_size_scalar;

		// random color
		if(!hexagon_color) {
			hexagon_color = Math.random() * 0xffffff
		}
		hexagon.material.color.setHex( hexagon_color );

		hexagons.colors.push(hexagon_color);


		hexagon.hexagonID = hexagons.meshes.length;
		
		

		var synth = AQMSynthMaster.createSynth(synths_index);

		AQMSynthMaster.setFreq(synth, freq);

		hexagons.synths.push(synth);
		hexagons.meshes.push(hexagon);
		
		App.getScene().add( hexagon );


		return hexagon;
	}

	var checkHandHits = function(controller, mode) {
		// console.log("hand mode", mode);


	 	var controller_hit_mesh = controller.children[0];
	 	var controller_visual_mesh = controller.children[1];
	 	var just_triggered = [];
	 	var collision_results_hexagonIDs = [];
	 	var collision_results = [];

	 	for(ray_distance = 0.02; ray_distance < 0.08; ray_distance += 0.02) {
		 	for (var vertex_index = controller_hit_mesh.geometry.vertices.length - 1; vertex_index >= 0; vertex_index--) {
		 		var local_vertex = controller_hit_mesh.geometry.vertices[vertex_index].clone();
		 		local_vertex.normalize();
		 		raycaster = new THREE.Raycaster();
			 	var tempMatrix = new THREE.Matrix4();
				tempMatrix.identity().extractRotation( controller.matrixWorld );
				raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
				raycaster.ray.direction.set( local_vertex.x, local_vertex.y , local_vertex.z);
				raycaster.far = ray_distance;
				var temp_collision_results = raycaster.intersectObjects(raycast_targets);
				// console.log(collision_results);
		      	
		      	for (var i = temp_collision_results.length - 1; i >= 0; i--) {
		      		var temp_hexagon_id = temp_collision_results[i].object.hexagonID;
		      		if(!existsInArray(collision_results_hexagonIDs, temp_hexagon_id)){
		      			collision_results_hexagonIDs.push(temp_hexagon_id);
		      			collision_results.push(temp_collision_results[i]);
		      		}
		      	}
		 	}
	 	}

	 	// put these into an array
	 	// for (var i = collision_results.length - 1; i >= 0; i--) {

	 	if(collision_results_hexagonIDs.length > 0) {
	 		clearResetTimer();
	 	}
	 	else {
	 		startResetTimer();
	 	}

 		for (var i = collision_results_hexagonIDs.length - 1; i >= 0; i--) {
      		// var current_hex_id = collision_results[i].object.hexagonID;
      		var current_hex_id = collision_results_hexagonIDs[i];
      		if(current_highlights.indexOf(current_hex_id) < 0 && mode == 0) {
      			// collision_results[i].object.material.color.setHex(0xffffff);
				current_highlights.push(current_hex_id);
			}
			else if (mode == 1) {
				// console.log('mode 1');
				if(existsInArray(hexagons_mode2, current_hex_id) && just_triggered.indexOf(current_hex_id) < 0){
					// console.log('mode 1: removing', hexagons_mode2.length);
					// remove
					var removal_index = hexagons_mode2.indexOf(current_hex_id);
					hexagons_mode2_removal.push(current_hex_id);
					hexagons_mode2.splice(removal_index,1);
					// console.log('mode 1: removed', hexagons_mode2.length);
					// console.log('new hexagons_mode2_removal length: ', hexagons_mode2_removal.length);
				}
				else{
					// console.log('mode 1: adding');
					just_triggered.push(current_hex_id);
					hexagons_mode2.push(current_hex_id);
					hexagons_mode2_addition.push(current_hex_id);
				}
			}
			else if (mode == 2) {
				// console.log('mode 3');
				if(existsInArray(hexagons_mode3, current_hex_id) && just_triggered.indexOf(current_hex_id) < 0){
					// console.log('mode 2: removing', hexagons_mode3.length);
					// remove
					var removal_index = hexagons_mode3.indexOf(current_hex_id);
					hexagons_mode3_removal.push(current_hex_id);
					hexagons_mode3.splice(removal_index,1);
					var arpeggiation_index = hexagons.synths[current_highlights[i]].arpeggiation_index;
					AQMSynthMaster.removeArpeggiation(arpeggiation_index);
					AQMSynthMaster.setFreq(hexagons.synths[current_highlights[i]], hexagons.synths[current_highlights[i]].master_freq);
					// console.log('mode 2: removed', hexagons_mode3.length);
					// console.log('new hexagons_mode2_removal length: ', hexagons_mode3_removal.length);
				}
				else{
					// console.log('mode 2: adding');
					just_triggered.push(current_hex_id);
					hexagons_mode3.push(current_hex_id);
					hexagons_mode3_addition.push(current_hex_id);

					var note_index = current_highlights[i]%number_of_notes;
					var freq = IllyNotes.getExact(note_index);

					// A A# B C C# D D# E F F# G  G# A
					// 0 1  2 3 4  5 6  7 8 9  10 11 12 
					for(var j = 0; j < 4; j++) {
						
						if(hexagons.synths[current_highlights[i]].type == 4) {
							if(j == 0) {
								AQMSynthMaster.addArpeggiation(hexagons.synths[current_highlights[i]], freq * Math.pow(freq_scale, 0), 4*j);
							}
							else {
								AQMSynthMaster.addArpeggiation(hexagons.synths[current_highlights[i]], null, 4*j);	
							}
							AQMSynthMaster.addArpeggiation(hexagons.synths[current_highlights[i]], null, 4*j+1);
							AQMSynthMaster.addArpeggiation(hexagons.synths[current_highlights[i]], null, 4*j+2);
							AQMSynthMaster.addArpeggiation(hexagons.synths[current_highlights[i]], null, 4*j+3);	
						}
						else {
							AQMSynthMaster.addArpeggiation(hexagons.synths[current_highlights[i]], freq * Math.pow(freq_scale, 0), 4*j);
							AQMSynthMaster.addArpeggiation(hexagons.synths[current_highlights[i]], freq * Math.pow(freq_scale, 0), 4*j+1);
							AQMSynthMaster.addArpeggiation(hexagons.synths[current_highlights[i]], freq * Math.pow(freq_scale, 2), 4*j+2);
							AQMSynthMaster.addArpeggiation(hexagons.synths[current_highlights[i]], freq * Math.pow(freq_scale, 3), 4*j+3);	
						}
					}
				}
			} 
      	}

      	if(collision_results_hexagonIDs.length > 0 ) {
      		// controller_hit_mesh.material.color.setHex(0xffffff);
      		controller_visual_mesh.material.color.setHex(hexagons.colors[collision_results_hexagonIDs[0]]);
      	}
      	else {
      		controller_visual_mesh.material.color.setHex(0xffffff);
      	}
	 	// console.log('checking triggers hand results ' , current_highlights);
	};

	var checkHighlight = function() {
		var vector;
		var ray;

		if(App.getVrCanWork()){
			// raycast from camera to the scene
			ray = new THREE.Raycaster();
			ray.setFromCamera( { x: 0, y: 0 }, App.getCamera() );
		}
		else{
			// raycast from mouse to the scene towards the direction of camera
			var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
			vector.unproject(App.getCamera());
			var ray = new THREE.Raycaster( App.getCamera().position, vector.sub( App.getCamera().position ).normalize() );
		}		

		var intersects = ray.intersectObjects( raycast_targets, true );

		if(intersects.length > 0){
			// intersects[0].object.material.color.setHex(0xffffff);
			current_highlights.push(intersects[0].object.hexagonID);
		}
	};

	
	var showDebugSphere = function() {
		if(debug_sphere_position != null){
			debug_sphere.position.set(debug_sphere_position[0],debug_sphere_position[1],debug_sphere_position[2]);
			debug_sphere.visible = true;
		}
		else {
			debug_sphere.visible = false;
		}
	};

	var onDocumentMouseMove = function(event) {
		// the following line would stop any other event handler from firing
		// (such as the mouse's TrackballControls)
		//event.preventDefault();
		
		// update the mouse variable
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	};

	var onDocumentMouseDown = function(event) {
		if(current_highlights.length > 0){
			for (var i = current_highlights.length - 1; i >= 0; i--) {
				if(existsInArray(hexagons_mode2, current_highlights[i])){
					// remove
					var removal_index = hexagons_mode2.indexOf(current_highlights[i]);
					hexagons_mode2.splice(removal_index,1);
					hexagons_mode2_removal.push(current_highlights[i]);
				}
				else{
					hexagons_mode2.push(current_highlights[i]);
					hexagons_mode2_addition.push(current_highlights[i]);
				}
			}
		}
	};

	var onDocumentRightClick = function(event){		
		if(current_highlights.length > 0){
			for (var i = current_highlights.length - 1; i >= 0; i--) {
				if(existsInArray(hexagons_mode3, current_highlights[i])){
					// remove
					var removal_index = hexagons_mode3.indexOf(current_highlights[i]);
					var arpeggiation_index = hexagons.synths[current_highlights[i]].arpeggiation_index;
					hexagons_mode3.splice(removal_index,1);
					hexagons_mode3_removal.push(current_highlights[i]);
					AQMSynthMaster.removeArpeggiation(arpeggiation_index);
					
				}
				else{
					hexagons_mode3.push(current_highlights[i]);

					var note_index = current_highlights[i]%number_of_notes;
					var freq = IllyNotes.getExact(note_index);

					// A A# B C C# D D# E F F# G  G# A
					// 0 1  2 3 4  5 6  7 8 9  10 11 12 
					for(var j = 0; j < 4; j++) {
						
						if(hexagons.synths[current_highlights[i]].type == 4) {
							if(j == 0) {
								AQMSynthMaster.addArpeggiation(hexagons.synths[current_highlights[i]], freq * Math.pow(freq_scale, 0), 4*j);
							}
							else {
								AQMSynthMaster.addArpeggiation(hexagons.synths[current_highlights[i]], null, 4*j);	
							}
							AQMSynthMaster.addArpeggiation(hexagons.synths[current_highlights[i]], null, 4*j+1);
							AQMSynthMaster.addArpeggiation(hexagons.synths[current_highlights[i]], null, 4*j+2);
							AQMSynthMaster.addArpeggiation(hexagons.synths[current_highlights[i]], null, 4*j+3);	
						}
						else {
							AQMSynthMaster.addArpeggiation(hexagons.synths[current_highlights[i]], freq * Math.pow(freq_scale, 0), 4*j);
							AQMSynthMaster.addArpeggiation(hexagons.synths[current_highlights[i]], freq * Math.pow(freq_scale, 0), 4*j+1);
							AQMSynthMaster.addArpeggiation(hexagons.synths[current_highlights[i]], freq * Math.pow(freq_scale, 2), 4*j+2);
							AQMSynthMaster.addArpeggiation(hexagons.synths[current_highlights[i]], freq * Math.pow(freq_scale, 3), 4*j+3);	
						}
					}
				}
			}
		}
	}

	var update = function(){

		// updateParticles();
		
		// if(App.isDebug()){
		// 	showDebugSphere();
		// }

		if(instruments_created) {
			previous_highlights = []
			for (var i = 0; i < current_highlights.length; i++) {
				previous_highlights.push(current_highlights[i]);
			}
			
			current_highlights = [];
			// hexagons_mode2_removal = [];

			if(App.getVrCanWork()) {
				checkHandHits(App.getController1(), 0);
				checkHandHits(App.getController2(), 0);

				if(App.getController1().getGamepad() && App.getController2().getGamepad()) {
					if(App.getController1().getGamepad().axes[0] < -0.9 && App.getController2().getGamepad().axes[0] > 0.9) {
						console.log('silence');
						silenceAllSynths();
					}
				}
			}
			else {
				checkHighlight();
			}

			updateNotes();
			updateShapes();

		}
		
		// updateColors();
		
	};

	var updateShapes = function() {

		for (var i = hexagons_mode3.length - 1; i >= 0; i--) {
			GeometryUtils.rippleObject(hexagons.meshes[hexagons_mode3[i]], 0.2);
		}

		for (var i = hexagons_mode3_addition.length - 1; i >= 0; i--) {
			hexagons.meshes[hexagons_mode3_addition[i]].scale.multiplyScalar(1.1);
		}
		hexagons_mode3_addition = [];

		for (var i = hexagons_mode3_removal.length - 1; i >= 0; i--) {
			GeometryUtils.resetRipple(hexagons.meshes[hexagons_mode3_removal[i]]);
			hexagons.meshes[hexagons_mode3_removal[i]].scale.multiplyScalar(1/1.1);
		}
		hexagons_mode3_removal = [];

		////////
		for (var i = hexagons_mode2.length - 1; i >= 0; i--) {
			GeometryUtils.pulseObject(hexagons.meshes[hexagons_mode2[i]], 1.1, 0.9, 0.001);
		}
	};

	var updateColors = function(){
		for (var i = previous_highlights.length - 1; i >= 0; i--) {
			if(!existsInArray(current_highlights, previous_highlights[i]) && !existsInArray(hexagons_mode2, previous_highlights[i]) && !existsInArray(hexagons_mode3, previous_highlights[i])){
				hexagons.meshes[previous_highlights[i]].material.color.setHex(hexagons.colors[previous_highlights[i]]);
			}
		}
		for (var i = hexagons_mode2.length - 1; i >= 0; i--) {
			hexagons.meshes[hexagons_mode2[i]].material.color.setHex(0xff0000);
		}
	};

	var updateNotes = function() {
		for (var i = current_highlights.length - 1; i >= 0; i--) {
			if (existsInArray(previous_highlights, current_highlights[i])) {
				return;
			}
			// var note_index = current_highlights[i]%number_of_notes;
			// var freq = IllyNotes.getExact(note_index);
			// AQMSynthMaster.setFreq(hexagons.synths[current_highlights[i]], freq);
			AQMSynthMaster.synthFadeIn(hexagons.synths[current_highlights[i]]);
			
			if(hexagons.synths[current_highlights[i]].type != 4) {
				active_synths.push(current_highlights[i]);
			}
			// console.log('calling fadein on ' + current_highlights[i]);
		}

		for (var i = previous_highlights.length - 1; i >= 0; i--) {
			if(!existsInArray(current_highlights, previous_highlights[i]) && !existsInArray(hexagons_mode2, previous_highlights[i]) && !existsInArray(hexagons_mode3, previous_highlights[i])){
				AQMSynthMaster.synthFadeOut(hexagons.synths[previous_highlights[i]]);

				var remove_index = active_synths.indexOf(previous_highlights[i]);
				if(remove_index > -1) {
					active_synths.splice(remove_index, 1);
				}
			}
		}

		if(current_highlights.length != active_synths.length) {
			for (var i = 0; i < active_synths.length; i++) {

				if(hexagons_mode2.indexOf(active_synths[i]) < 0) {
					if(hexagons_mode3.indexOf(active_synths[i]) < 0) {						
						if(current_highlights.indexOf(active_synths[i]) < 0) {
							AQMSynthMaster.synthFadeOut(hexagons.synths[active_synths[i]]);
							active_synths.splice(i, 1);
							i -=1;
						}
					}
				}
			}
		}
	}

	var silenceAllSynths = function() {
		for (var i = 0; i < current_highlights.length; i++) {
			AQMSynthMaster.synthFadeOut(hexagons.synths[current_highlights[i]]);
		}
		current_highlights = [];

		for (var i = 0; i < hexagons_mode2.length; i++) {
			AQMSynthMaster.synthFadeOut(hexagons.synths[hexagons_mode2[i]]);
			hexagons_mode2_removal.push(hexagons_mode2[i]);
		}
		hexagons_mode2 = [];

		for (var i = 0; i < hexagons_mode3.length; i++) {
			AQMSynthMaster.synthFadeOut(hexagons.synths[hexagons_mode3[i]]);
			hexagons_mode3_removal.push(hexagons_mode3[i]);

			var arpeggiation_index = hexagons.synths[hexagons_mode3[i]].arpeggiation_index;
			AQMSynthMaster.removeArpeggiation(arpeggiation_index);
			AQMSynthMaster.setFreq(hexagons.synths[hexagons_mode3[i]], hexagons.synths[hexagons_mode3[i]].master_freq);
		}
		hexagons_mode3 = [];

		for (var i = 0; i < active_synths.length; i++) {
			AQMSynthMaster.synthFadeOut(hexagons.synths[active_synths[i]]);
		}
		active_synths = [];
	};

	var startResetTimer = function() {
		if(reset_timer == null) {
			// console.log('reset timer initiated');
			reset_timer = setTimeout( function() {
				// console.log('reset timer hit, silencing all synths');
				reset_timer = null;
				silenceAllSynths();
			}, reset_timer_time);
		}
	};

	var clearResetTimer = function() {
		if (reset_timer != null) {
			// console.log('action detected clearing reset timer');
			clearTimeout(reset_timer);
			reset_timer = null;
		}
	};

	// var setupUniverseParticles = function(){
	// 	particle_system = new THREE.GPUParticleSystem({
	// 		maxParticles: 250000
	// 	});
	// 	World.getWorld().add( particle_system);
	// };

	// var updateParticles = function(){
	// 	var delta = App.getClock().getDelta() * spawnerOptions.timeScale;
	// 	tick += delta;
	// 	if (tick < 0) tick = 0;
	// 	if (delta > 0) {
	// 		options.position.x = Math.sin(tick * spawnerOptions.horizontalSpeed) * 6;// * 20;
	// 		options.position.y = Math.sin(tick * spawnerOptions.verticalSpeed) * 3;// * 10;
	// 		options.position.z = Math.sin(tick * spawnerOptions.horizontalSpeed + spawnerOptions.verticalSpeed);// * 5;
	// 		for (var x = 0; x < spawnerOptions.spawnRate * delta; x++) {
	// 			// Yep, that's really it.	Spawning particles is super cheap, and once you spawn them, the rest of
	// 			// their lifecycle is handled entirely on the GPU, driven by a time uniform updated below
	// 			particle_system.spawnParticle(options);
	// 		}
	// 	}
	// 	particle_system.update(tick);
	// };



	/*****utils*******/
	var existsInArray = function(input_array, input_value){
		var exists = false;
		for (var i = input_array.length - 1; i >= 0; i--) {
			if(input_array[i] === input_value){
				exists = true;
				i = -1;
			}
		}

		return exists;
	};
	// Returns a random number between min (inclusive) and max (exclusive)
	var getRandomArbitrary = function (min, max) {
		return Math.random() * (max - min) + min;
	};

	var getEarth = function(){
		return earth;
	};

	var  vectorToString = function(input_vector) { 
		return "[ " + input_vector.x + ", " + input_vector.y + ", " + input_vector.z + " ]"; 
	};

	var getHEXfromRGB = function(r, g , b) {
		var color = new THREE.Color("rgb("+ r + "," + g +"," + b + ")");
		return hexagon_color = color.getHex();
	}


	// public methods
	return{
		init: init,
		update: update,
		getEarth: getEarth,
		getRandomArbitrary: getRandomArbitrary
	}
}();
