var Level = function(){

	var number_of_notes;

	var raycast_targets = [];
	var debug_sphere_position = null;
	var debug_sphere;
	var mouse = { x: 0, y: 0 },INTERSECTED;
	var selectedFaces = [];

	var hexagon_size = 1;
	var hexagons = {
		'meshes': [],
		'synths': [],
		'colors': []
	};
	// var hexagon_material;
	var dome_radius = 6.66;
	var instruments_created = false;

	var current_highlights = [];
	var previous_highlights = [];
	var hexagons_mode2 = [];

	var hexagon_geometry;
	var hexagon_lines_geometery;
	var hexagon_lines_material;

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
			
			console.log(dae);

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

		// for (angle_y = 0; angle_y < target_angle * 2/10; angle_y += angle_step) {
		angle_y = 0;
		for (var angle_x = 0; angle_x < target_angle * 2; angle_x += angle_step) {
			// var hexagon = createHexagon(hexagon_size * Math.cos(angle_y));
			var hexagon = createHexagon(hexagon_size * Math.cos(angle_y));
			hexagon.position.y = Math.sin(angle_y) * dome_radius;// - hexagon_size;
			hexagon.position.x = Math.sin(angle_x) * dome_radius;
			hexagon.position.z = Math.cos(angle_x) * dome_radius;
			hexagon.lookAt(new THREE.Vector3(0,0,0));
			// hexagon.rotateY( (2 * Math.PI) * 352/360);
			raycast_targets.push(hexagon);
		}
		// }

		angle_y = (Math.PI/2)* (1/6);

		for (var angle_x = angle_step/2; angle_x < target_angle * 2; angle_x += angle_step) {
			var hexagon = createHexagon(hexagon_size * Math.cos(angle_y) );
			// hexagon.position.y = 1.55;//Math.cos(angle_y) * dome_radius - hexagon_size;
			hexagon.position.y = Math.sin(angle_y) * dome_radius;
			hexagon.position.x = Math.sin(angle_x) * dome_radius * Math.cos(angle_y);
			hexagon.position.z = Math.cos(angle_x) * dome_radius * Math.cos(angle_y);
			hexagon.lookAt(new THREE.Vector3(0,0,0));
			// hexagon.rotateY( (2 * Math.PI) * 352/360);
			raycast_targets.push(hexagon);
		}

		angle_y = (Math.PI/2)* (2/6);

		for (var angle_x = 0; angle_x < target_angle * 2; angle_x += target_angle/12) {
			// var hexagon = createHexagon(hexagon_size * Math.cos(angle_y) );
			var hexagon = createHexagon(0.85);
			// hexagon.position.y = 2.95;//Math.cos(angle_y) * dome_radius - hexagon_size;
			hexagon.position.y = Math.sin(angle_y) * dome_radius;
			hexagon.position.x = Math.sin(angle_x) * dome_radius * Math.cos(angle_y);
			hexagon.position.z = Math.cos(angle_x) * dome_radius * Math.cos(angle_y);
			hexagon.lookAt(new THREE.Vector3(0,0,0));
			// hexagon.rotateY( (2 * Math.PI) * 352/360);
			raycast_targets.push(hexagon);
		}

		angle_y = (Math.PI/2)* (3/6);

		for (var angle_x = angle_step/2; angle_x < target_angle * 2; angle_x += target_angle/9) {
			// var hexagon = createHexagon(hexagon_size * Math.cos(angle_y) );
			var hexagon = createHexagon(0.9);
			// hexagon.position.y = 4.1;//Math.cos(angle_y) * dome_radius - hexagon_size;
			hexagon.position.y = Math.sin(angle_y) * dome_radius;
			hexagon.position.x = Math.sin(angle_x) * dome_radius * Math.cos(angle_y);
			hexagon.position.z = Math.cos(angle_x) * dome_radius * Math.cos(angle_y);
			hexagon.lookAt(new THREE.Vector3(0,0,0));
			// hexagon.rotateY( (2 * Math.PI) * 352/360);
			raycast_targets.push(hexagon);
		}

		angle_y = (Math.PI/2)* (4/6);

		for (var angle_x = angle_step/2; angle_x < target_angle * 2; angle_x += target_angle/6) {
			// var hexagon = createHexagon(hexagon_size * Math.cos(angle_y) );
			var hexagon = createHexagon(1);
			// hexagon.position.y = 5;//Math.cos(angle_y) * dome_radius - hexagon_size;
			hexagon.position.y = Math.sin(angle_y) * dome_radius;
			hexagon.position.x = Math.sin(angle_x) * dome_radius * Math.cos(angle_y);
			hexagon.position.z = Math.cos(angle_x) * dome_radius * Math.cos(angle_y);
			hexagon.lookAt(new THREE.Vector3(0,0,0));
			// hexagon.rotateY( (2 * Math.PI) * 352/360);
			raycast_targets.push(hexagon);
		}

		angle_y = (Math.PI/2)* (5/6);

		for (var angle_x = 0; angle_x < target_angle * 2; angle_x += target_angle/3) {
			// var hexagon = createHexagon(hexagon_size * Math.cos(angle_y) );
			var hexagon = createHexagon(1 );
			// hexagon.position.y = 6;//Math.cos(angle_y) * dome_radius - hexagon_size;
			hexagon.position.y = Math.sin(angle_y) * dome_radius;
			hexagon.position.x = Math.sin(angle_x) * dome_radius * Math.cos(angle_y);
			hexagon.position.z = Math.cos(angle_x) * dome_radius * Math.cos(angle_y);
			hexagon.lookAt(new THREE.Vector3(0,0,0));
			raycast_targets.push(hexagon);
		}

		angle_y = (Math.PI/2)* (6/6);

		var hexagon = createHexagon(1 );
		hexagon.position.y = dome_radius;
		hexagon.position.x = 0;
		// hexagon.position.z = -0.25;
		hexagon.lookAt(new THREE.Vector3(0,0,0));

		instruments_created = true;
		console.log (hexagons.meshes.length);
		console.log (hexagons);
	};

	var createHexagon = function(size) {
		// var group = new THREE.Object3D();
		// var hexagon_material = new THREE.MeshBasicMaterial({
		// var hexagon_material = new THREE.MeshToonMaterial({
		// 	color: 0xBBBBBB, 
		// 	// vertexColors: THREE.FaceColors, 
		// 	side: THREE.DoubleSide,
		// 	shading: THREE.FlatShading
		// });

		var hexagon_material = new THREE.MeshPhongMaterial({ 
			color: 0xffffff, 
			specular: 0xdddddd, 
			shininess: 5, 
			morphTargets: true, 
			vertexColors: THREE.FaceColors, 
			shading: THREE.FlatShading 
		});
		// var hexagon_geometry = new THREE.RegularHexagonGeometry(size);


		var hexagon = new THREE.Mesh(hexagon_geometry, hexagon_material);
		hexagon.scale.x = hexagon.scale.y = hexagon.scale.z = 0.045 * size;
		var random_color = Math.random() * 0xffffff
		hexagon.material.color.setHex( random_color );

		hexagons.colors.push(random_color);
		// var quaternion = new THREE.Quaternion().setFromAxisAngle(  new THREE.Vector3( 0, 1, 0 ), Math.PI/2 );
		// hexagon.rotation.setFromQuaternion( quaternion );


		hexagon.hexagonID = hexagons.meshes.length;
		var synths_index = Math.round(Math.random() * 4);
		var synth = IllySynth.createSynth(synths_index);
		// group.add(hexagon);

		// var hexagon_line_material = new THREE.MeshBasicMaterial({
		// 	color: 0xffffff,
		// 	wireframe: true
		// });
		// var hexagon_line =  new THREE.Mesh(hexagon_lines_geometery, hexagon_lines_material);
		// var hexagon_line = new THREE.Mesh(hexagon_geometry, )
		// console.log(synth);
		// group.add(hexagon_line);
		hexagons.synths.push(synth);
		hexagons.meshes.push(hexagon);
		// App.getScene().add( group );
		App.getScene().add( hexagon );

		return hexagon;
	}


	var checkHighlight = function(){
		previous_highlights = []
		for (var i = current_highlights.length - 1; i >= 0; i--) {
			previous_highlights.push(current_highlights[i]);
		}
		
		current_highlights = [];
		if(!instruments_created) {
			return;
		}
		// return;
		var vector;
		var ray;

		if(WEBVR.isAvailable()){
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
			intersects[0].object.material.color.setHex(0xffffff);
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

	var onDocumentMouseMove = function( event ) {
		// the following line would stop any other event handler from firing
		// (such as the mouse's TrackballControls)
		//event.preventDefault();
		
		// update the mouse variable
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	};

	var onDocumentMouseDown = function( event ) {
		if(current_highlights.length > 0){
			for (var i = current_highlights.length - 1; i >= 0; i--) {
				if(existsInArray(hexagons_mode2, current_highlights[i])){
					// remove
					var removal_index = hexagons_mode2.indexOf(current_highlights[i]);
					hexagons_mode2.splice(removal_index,1);
				}
				else{
					hexagons_mode2.push(current_highlights[i]);
				}
			}
		}
	};

	var update = function(){
		// updateParticles();
		checkHighlight();
		// if(App.isDebug()){
		// 	showDebugSphere();
		// }
		updateColors();
		updateNotes();
	};

	var updateColors = function(){
		for (var i = previous_highlights.length - 1; i >= 0; i--) {
			if(!existsInArray(current_highlights, previous_highlights[i]) && !existsInArray(hexagons_mode2, previous_highlights[i])){
				hexagons.meshes[previous_highlights[i]].material.color.setHex(hexagons.colors[previous_highlights[i]]);
				IllySynth.setFreq(hexagons.synths[previous_highlights[i]], 0);
			}
		}
		for (var i = hexagons_mode2.length - 1; i >= 0; i--) {
			hexagons.meshes[hexagons_mode2[i]].material.color.setHex(0xff0000);
		}
	};

	var updateNotes = function(){
		for (var i = current_highlights.length - 1; i >= 0; i--) {
			var note_index = current_highlights[i]%number_of_notes;
			var freq = IllyNotes.getExact(note_index);
			IllySynth.setFreq(hexagons.synths[current_highlights[i]], freq);
		}
	}

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


	// public methods
	return{
		init: init,
		update: update,
		getEarth: getEarth,
		getRandomArbitrary: getRandomArbitrary
	}
}();
