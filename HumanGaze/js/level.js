var Level = function(){

	var earth;

	// look at //
	var targetList = [];
	var debug_sphere_position = null;
	var debug_sphere;
	var mouse = { x: 0, y: 0 },INTERSECTED;
	var selectedFaces = [];
	var gaze_target_changed = false;
	// look at //

	// particles //
	var tick = 0;
	var particle_system;

	var spawnerOptions = {
		spawnRate: 15000,
		horizontalSpeed: 1.5 * 10,
		verticalSpeed: 1.33 * 10,
		timeScale: 0.1
	};

	var simple_particle_rotation_speed = 0.001;
	var universe_particle_timer = 0.001;

	var options = {
		position: new THREE.Vector3(),
		positionRandomness: 5,
		velocity: new THREE.Vector3(),
		velocityRandomness: 5,
		color: 0xaa88ff,
		colorRandomness: 10,
		turbulence: 2,
		lifetime: 2,
		size: 5,
		sizeRandomness: 1
	};
	// particles //

	// particles 2 //
	var starField;
	// particles 2 //

	// color states //
	// gaze
	var gazed_index;
	var gazed_index_color = 0x000000;
	// expanded_base
	var expanded_base_index = [];
	var expanded_base_color = 0x666666;
	// expanded_inactive
	var expanded_inactive_color = 0xaaaaaa;
	var expanded_inactive_index = [];
	// normal
	var normal_color_land = 0x55ffaa;
	var normal_color_land_cold = 0x55ffaa;//0xccffee;
	var normal_color_sea = 0x55aaff;
	var normal_color_sea_cold = 0xffffff;


	// timer //
	var gaze_timer = 0;
	var gazed_faces = [];
	var still_focused = false;
	var gaze_timer_limit_sound = 3;
	var gaze_timer_limit_expanse = 5;
	var gaze_expanded_faces = [];
	var previous_focus = false;
	// timer //


	// neighbour checker //
	var collision_object_radius = 0.6;
	var collision_object_vr_radius = 0.15;
	var collision_object;
	var collision_object_position_reference;
	// neighbour checker //

	// model scale
	var earth_scalar;
	var earth_vr_scalar = 0.01;
	var earth_non_vr_scalar = 0.04;

	// model default colouring
	var earth_colouring = {
		'vr':{
			'land_sea': 0.557,
			'cold': 1
		},
		'non_vr':{
			'land_sea': 2.2,
			'cold': 1.9
		}
	}
	var cold_colouring;
	var land_sea_colouring
	

	
	var init = function(){

		if(WEBVR.isAvailable()){
			earth_scalar = earth_vr_scalar;
			land_sea_colouring = earth_colouring['vr']['land_sea'];
			cold_colouring = earth_colouring['vr']['cold'];
			collision_object_radius = collision_object_vr_radius;
		}
		else{
			earth_scalar = earth_non_vr_scalar;
			land_sea_colouring = earth_colouring['non_vr']['land_sea'];
			cold_colouring = earth_colouring['non_vr']['cold'];
		}
		

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


		var loader = new THREE.OBJLoader( manager );
		THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

		var mtlLoader = new THREE.MTLLoader();
		mtlLoader.setPath( 'assets/models/earth/' );
		mtlLoader.load( 'LowPolyEarth.mtl', function( materials ) {

			materials.preload();

			var objLoader = new THREE.OBJLoader();
			objLoader.setMaterials( materials );
			objLoader.setPath( 'assets/models/earth/' );
			objLoader.load( 'LowPolyEarth.obj', function ( object ) {
				console.log('materials', materials);
				earth = object;
				var geometry = new THREE.Geometry().fromBufferGeometry( object.children[0].geometry );

				// console.log(geometry);
				// return;

				earth.children[0].geometry = geometry; 

				// object.children[0].material.materials[0] = materials.materials.ground_;
				// object.children[0].material.materials[1] = materials.materials.water_;

				// object.children[0].material.materials[0].vertexColors = THREE.FaceColors;
				// object.children[0].material.materials[1].vertexColors = THREE.FaceColors;

				earth.traverse( function ( child ) {

					if ( child instanceof THREE.Mesh ) {

						var land_material = new THREE.MeshPhongMaterial({ 
							vertexColors: THREE.VertexColors,
							shininess: 500,
						});

						var sea_material = new THREE.MeshPhongMaterial({ 
							vertexColors: THREE.VertexColors,
							shininess: 500,
						});

						var land_material_cold = new THREE.MeshPhongMaterial({ 
							vertexColors: THREE.VertexColors,
							shininess: 50,
						});

						var sea_material_cold = new THREE.MeshPhongMaterial({ 
							vertexColors: THREE.VertexColors,
							shininess: 500,
						});

						var materials = [
							land_material,
							sea_material,
							land_material_cold,
							normal_color_sea_cold
						];
						// child.materials = materials;
						// child.material = null;
						child.material = land_material;

						// earth = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial() );
						// child.material.map = texture;

					}

				} );

				// console.log('loaded');
				// console.log(object);
				// console.log(object.children[0]);

				updateColors();
				

				earth.children[0].geometry.colorsNeedUpdate = true;

				// object.position.y = - 95;
				// console.log('object', object);
				// console.log('scene', App.getScene());
				earth.updateMatrix();
				earth.scale.x = object.scale.y = object.scale.z = earth_scalar;
				earth.position.z = 0;
				targetList.push(earth);
				App.getScene().add( earth );
				// World.getWorld().add( earth );
				// console.log('scene', App.getScene());

				if(WEBVR.isAvailable()){
					earth.position.z = 0;
					earth.position.x = World.getAbsoluteCenter().x;
					earth.position.y = 1.5;
				}

				Lights.init();
			}, onProgress, onError );
		});


		var onError = function ( xhr ) {

		};

		document.addEventListener( 'mousemove', onDocumentMouseMove, false );

		if(App.isDebug()){
			var sphere_geomtery= new THREE.SphereGeometry(0.03,5,5);
			debug_sphere= new THREE.Mesh(sphere_geomtery, new THREE.MeshBasicMaterial({ 
				color: 0x00ffff 
			}));
			App.getScene().add(debug_sphere);
		}		

		setupCollisionObject();
		if(!WEBVR.isAvailable()){
			setupUniverseParticles();	
		}
		
		setupSimpleUniverseParticles();
	};
	
	var setupCollisionObject = function(){
		var collision_object_geometry = new THREE.SphereGeometry(collision_object_radius,32, 32);//32, 32);
		// var collision_object_geometry = new THREE.BoxGeometry( 0.8, 0.8, 0.8);
		var collision_object_material = new THREE.MeshBasicMaterial( { 
			color: 0xff0000, 
			wireframe:true,
			transparent: true,
			opacity: 0
		});
		collision_object = new THREE.Mesh(collision_object_geometry, collision_object_material );
		// MovingCube.position.set(0, 25.1, 0);
		App.getScene().add(collision_object);
	};

	var checkHighlight = function(){
		if(!earth) {
			return;
		}

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

		var intersects = ray.intersectObjects( targetList, true );

		var current_gazed_faces = [];

		if(intersects.length > 0) {
			if(existsInArray(gazed_faces, intersects[0].faceIndex) || existsInArray(gaze_expanded_faces, intersects[0].faceIndex)){
				// gaze_target_changed = false;
			}
			else {
				gaze_target_changed = true;
			}

			gazed_index = intersects[0].faceIndex;
			
		}

		for (var i = intersects.length - 1; i >= 0; i--) {
			found = true;
			current_gazed_faces.push(j);
		}

		still_focused = false; //gaze_expanded_faces

		for (var i = current_gazed_faces.length - 1; i >= 0; i--) {
			for (var j = gazed_faces.length - 1; j >= 0; j--) {
				if(current_gazed_faces[i] == gazed_faces[j]){
					still_focused = true;
				}
			}
		}

		for (var i = current_gazed_faces.length - 1; i >= 0; i--) {
			for (var j = gaze_expanded_faces.length - 1; j >= 0; j--) {
				if(current_gazed_faces[i] == gaze_expanded_faces[j]){
					still_focused = true;
				}
			}
		}


		gazed_faces = current_gazed_faces;
		
		// if there is one (or more) intersections
		if ( intersects.length > 0) {	
			INTERSECTED = intersects[0];	
			debug_sphere_position = [INTERSECTED.point.x,INTERSECTED.point.y,INTERSECTED.point.z];
			if (WEBVR.isAvailable()){
				gazed_index = intersects[0].faceIndex;
				var asd = getFacePosition(gazed_index);
				asd = asd.multiplyScalar(earth_scalar);

				debug_sphere_position[0] = asd.x + earth.position.x;
				debug_sphere_position[1] = asd.y + earth.position.y;
				debug_sphere_position[2] = asd.z + earth.position.z;
			}
		} 
		else {
			INTERSECTED = null;
			debug_sphere_position = null;
		}

		earth.children[0].geometry.colorsNeedUpdate = true;
	};

	var setCollisionObjectPosition = function(){
		if(debug_sphere_position != null){
			if(WEBVR.isAvailable()){
				collision_object.position.set(debug_sphere_position[0], debug_sphere_position[1], debug_sphere_position[2]);
			}
			else{
				if(gaze_expanded_faces.length == 0 || gaze_target_changed) {
					collision_object.position.set(debug_sphere_position[0]*1.1,debug_sphere_position[1]*1.1,debug_sphere_position[2]*1.1);	
				}
				else {
					var position = getFacePosition(collision_object_position_reference);
					collision_object.position.set(position.x * earth_scalar, position.y * earth_scalar, position.z * earth_scalar);
				}
			}
			
		}
		else {
			collision_object.position.set(100, 100, 100);
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

	var update = function() {
		// updateParticles();
		// updateSimpleParticles();
		updateGazeTimer();
		
		checkHighlight();
		setCollisionObjectPosition();
		if(App.isDebug()){
			showDebugSphere();
		}
		Lights.update();
		updateColors();
		if(!WEBVR.isAvailable()){
			updateParticles()
		}
		updateSimpleParticles();
				
	};

	var updateColors = function(){
		// handle the colouring	
		if(earth){
			for (var i = earth.children[0].geometry.faces.length - 1; i >= 0; i--) {
				// earth.children[0].geometry.faces[j].color.setHex(normal_color);	
				var face_position = getFacePosition(i);
				face_position.multiplyScalar(earth_scalar);
				var earth_position_clone = earth.position.clone();
				earth_position_clone.multiplyScalar(earth_scalar);
				var distance = face_position.distanceTo(earth_position_clone);
				// console.log(distance);
				if(distance > land_sea_colouring){
					// earth.children[0].geometry.faces[i].color = new THREE.Color( 0x00ff00);  
					if(Math.abs(face_position.y) >= cold_colouring){
						earth.children[0].geometry.faces[i].color.setHex(normal_color_land_cold);	
					}
					else {
						earth.children[0].geometry.faces[i].color.setHex(normal_color_land);
					}
				}	
				else{
					// earth.children[0].geometry.faces[i].color = new THREE.Color( 0x0000ff);  
					if(Math.abs(face_position.y) >= cold_colouring){
						// console.log('cold sea');
						earth.children[0].geometry.faces[i].color.setHex(normal_color_sea_cold);	
					}
					else {
						earth.children[0].geometry.faces[i].color.setHex(normal_color_sea);
					}
				}
				//
			}

			for (var i = gaze_expanded_faces.length - 1; i >= 0; i--) {
				earth.children[0].geometry.faces[gaze_expanded_faces[i]].color.setHex(expanded_inactive_color);			
			}

			for (var i = expanded_base_index.length - 1; i >= 0; i--) {
				earth.children[0].geometry.faces[expanded_base_index[i]].color.setHex(expanded_base_color);
			}	

			if(gazed_index){
				earth.children[0].geometry.faces[gazed_index].color.setHex(gazed_index_color);		
			}		
		}				
	};

	// var 

	var findNeighbourFaces = function(){
		var originPoint = collision_object.position.clone();
		var all_collisions = [];

		if(WEBVR.isAvailable()){		
			////faces
			//// not sure why it is not working that is raycasting
			// for(var face_index = 0; face_index < collision_object.geometry.faces.length; face_index++){
			// 	var target_position = getGenericFacePosition(collision_object, face_index);

			// 	// // regular method
			// 	// var direction_vector = target_position.clone();//.sub(originPoint);
			// 	// direction_vector.normalize();


			// 	// var ray = new THREE.Raycaster( originPoint, direction_vector, 0, collision_object_radius * 1.1 * 1);				
			// 	// var collisionResults = ray.intersectObjects( targetList, true );

			// 	// all_collisions = all_collisions.concat(collisionResults);

			// 	// if(App.isDebug()) {
			// 	// 	var material = new THREE.LineBasicMaterial({
			// 	// 		color: 0x0000ff
			// 	// 	});

			// 	// 	var geometry = new THREE.Geometry();
					
			// 	// 	var temp_vector = direction_vector.clone();
			// 	// 	// temp_vector = originPoint.add(temp_vector.multiplyScalar(collision_object_radius * 1.1 * 1));
			// 	// 	geometry.vertices.push(
			// 	// 		originPoint,
			// 	// 		target_position.add(originPoint)
			// 	// 	);

			// 	// 	var line = new THREE.Line( geometry, material );
			// 	// 	App.getScene().add( line );
			// 	// }
			// 	// var target_position2 = target_position.clone();
			// 	// console.log('bfore', target_position);
			// 	// target_position2.project(App.getCamera());
			// 	// console.log('isthis',target_position2);
			// }
			dx_limit = 0.1;
			dy_limit = 0.1;
			dx_step = 0.01;
			dy_step = 0.01;
			for(var dx = -dx_limit; dx < dx_limit; dx+= dx_step){				
				for(var dy = -dx_limit; dy < dy_limit; dy += dy_step){					
					ray = new THREE.Raycaster();
					ray.setFromCamera( { x: dx, y: dy }, App.getCamera() );			
					// collisionResults = ray.intersectObjects( targetList, true );
					collisionResults = ray.intersectObjects( earth.children, true );
					all_collisions = all_collisions.concat(collisionResults);
					// console.log('hel',collisionResults);
				}
			}
		}
		else
		{
			for (var vertexIndex = 0; vertexIndex < collision_object.geometry.vertices.length; vertexIndex++) {		
				var localVertex = collision_object.geometry.vertices[vertexIndex].clone();
				// var globalVertex = localVertex.applyMatrix4( collision_object.matrix );
				var globalVertex = localVertex.applyMatrix4( collision_object.matrixWorld );
				var directionVector = globalVertex.sub( collision_object.position );

				console.log('local vertex positions', localVertex);
				console.log('global vertex positions', globalVertex);
				
				// var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize(), 0, collision_object_radius * 1.1);
				var ray = new THREE.Raycaster( originPoint, globalVertex.clone().normalize(), 0, collision_object_radius * 1.1);
				var collisionResults = ray.intersectObjects( targetList, true );

				all_collisions = all_collisions.concat(collisionResults);

				
				if(App.isDebug()) {
					var material = new THREE.LineBasicMaterial({
						color: 0x0000ff
					});

					var geometry = new THREE.Geometry();
					globalVertex.add(collision_object.position);
					geometry.vertices.push(
						originPoint,
						globalVertex
					);

					var line = new THREE.Line( geometry, material );
					App.getScene().add( line );
				}
			}
		}

		

		var min_dist = 999;
		// console.log(all_collisions);
		if(all_collisions.length === 0 && gaze_expanded_faces.length > 0){
			var position = getFacePosition(gaze_expanded_faces[gaze_expanded_faces.length - 1]);
			collision_object.position.set(position.x * earth_scalar, position.y * earth_scalar, position.z * earth_scalar);
			findNeighbourFaces();
			return;
		}

		for (var i = all_collisions.length - 1; i >= 0; i--) {
			if(!existsInArray(gaze_expanded_faces, all_collisions[i].faceIndex)){
				
				gaze_expanded_faces.push(all_collisions[i].faceIndex);

				if(all_collisions[i].distance < min_dist){
					min_dist = all_collisions[i].distance;
					collision_object_position_reference = all_collisions[i].faceIndex;
					expanded_base_index.push(collision_object_position_reference);
				}
				earth.children[0].geometry.colorsNeedUpdate = true;

				if(gaze_target_changed){
					gaze_target_changed = false;
				}
			}	
		}	
		gaze_timer = 0;
	};

	var clearNeighbourFace = function(){
		if(gaze_expanded_faces.length > 0){
			gaze_expanded_faces.splice(-1, 1);
		}
		else if (expanded_base_index.length > 0){
			expanded_base_index.splice(-1, 1);
		}		
	};

	var setupUniverseParticles = function(){
		particle_system = new THREE.GPUParticleSystem({
			maxParticles: 250000
		});
		World.getWorld().add( particle_system);
	};

	var setupSimpleUniverseParticles = function(){
		var starsGeometry = new THREE.Geometry();

		for ( var i = 0; i < 1000; i ++ ) {

			var star = new THREE.Vector3();
			star.x = THREE.Math.randFloatSpread( 15 );
			star.y = THREE.Math.randFloatSpread( 15 );
			star.z = THREE.Math.randFloatSpread( 15 );

			starsGeometry.vertices.push( star )

		}

		var starsMaterial = new THREE.PointsMaterial( { 
			color: 0xf0f0f0, 
			size: 0.1, 
			blending: THREE.AdditiveBlending, 
			depthWrite: true, 
			transparent: true,
			// map: THREE.ImageUtils.loadTexture('https://dl.dropboxusercontent.com/u/265455/PI/assets/images/particle3.png')
			map: THREE.ImageUtils.loadTexture('./assets/images/particle3.png'),
		});

		starField = new THREE.Points( starsGeometry, starsMaterial );

		World.getWorld().add( starField );
	};

	var updateParticles = function(){
		// var delta = App.getClock().getDelta() * spawnerOptions.timeScale;
		var delta = universe_particle_timer * spawnerOptions.timeScale;
		tick += delta;
		if (tick < 0) tick = 0;
		if (delta > 0) {
			options.position.x = Math.sin(tick * spawnerOptions.horizontalSpeed) * 6;// * 20;
			options.position.y = Math.sin(tick * spawnerOptions.verticalSpeed) * 3;// * 10;
			options.position.z = Math.sin(tick * spawnerOptions.horizontalSpeed + spawnerOptions.verticalSpeed);// * 5;
			for (var x = 0; x < spawnerOptions.spawnRate * delta; x++) {
				// Yep, that's really it.	Spawning particles is super cheap, and once you spawn them, the rest of
				// their lifecycle is handled entirely on the GPU, driven by a time uniform updated below
				particle_system.spawnParticle(options);
			}
		}
		particle_system.update(tick);
	};

	var updateSimpleParticles = function(){
		starField.rotation.y += simple_particle_rotation_speed;//App.getClock().getDelta() * 0.01;
	}

	var updateGazeTimer = function(){
		// use gaze timer limit 2
		if(previous_focus == still_focused){
			if(still_focused){
				gaze_timer  += App.getClock().getDelta();
				if(gaze_timer > gaze_timer_limit_sound){
					// findNeighbourFaces();
					Audio.playNegative();
				}
				if(gaze_timer > gaze_timer_limit_expanse){
					findNeighbourFaces();
				}
			}
			else{
				gaze_timer  += App.getClock().getDelta();
				if(gaze_timer > gaze_timer_limit_expanse){
					clearNeighbourFace();
					gaze_timer = 0;
					Audio.playPositive();
				}
			}
		}
		else {
			previous_focus = still_focused;
			gaze_timer = 0;
			Audio.stopNegative();			
		}

		// if(gaze_timer == 0){
		// 	negative_sfx[0].pause();
		// 	negative_sfx[0].currentTime = 0;
		// }
		// else {
		// 	if(!(!negative_sfx[0].paused && !negative_sfx[0].ended && 0 < negative_sfx[0].currentTime)){
		// 		negative_sfx[0].play();
		// 	}
		// }
		
		// console.log(gaze_timer);
	};



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

	var getGenericFacePosition = function(reference_object, face_index){
		var input_face = reference_object.geometry.faces[face_index];
		// seems borked!
		var v1 = reference_object.geometry.vertices[input_face.a];
		var v2 = reference_object.geometry.vertices[input_face.b];
		var v3 = reference_object.geometry.vertices[input_face.c];

		// console.log('vs', v1, v2, v3);

		// calculate the centroid
		var position = new THREE.Vector3();
		position.x = (v1.x + v2.x + v3.x) / 3;
		position.y = (v1.y + v2.y + v3.y) / 3;
		position.z = (v1.z + v2.z + v3.z) / 3;

		return position;
	};

	var getFacePosition = function(input_face_index){
		var input_face = earth.children[0].geometry.faces[input_face_index];
		// seems borked!
		var v1 = earth.children[0].geometry.vertices[input_face.a];
		var v2 = earth.children[0].geometry.vertices[input_face.b];
		var v3 = earth.children[0].geometry.vertices[input_face.c];

		// console.log('vs', v1, v2, v3);

		// calculate the centroid
		var position = new THREE.Vector3();
		position.x = (v1.x + v2.x + v3.x) / 3;
		position.y = (v1.y + v2.y + v3.y) / 3;
		position.z = (v1.z + v2.z + v3.z) / 3;

		return position;
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
