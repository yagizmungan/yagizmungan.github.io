var Level = function(){

	var ground;
	var tree;
	var tree2 = [];

	var number_snowflakes  = 100;
	var snowflakes = [];
	var snowflake_references = [];
	var number_snowflake_references = 2;
	var snowflakes_initialized = false;

	var previous = 0;
	var current = 0;
	var fake_trees = []
	var shadow_caster;

	var init = function(){

		/*ground*/
		var ground_geometry = new THREE.PlaneGeometry( World.getWorldEdgeLength() * 2, World.getWorldEdgeLength() * 2, World.getWorldEdgeLength() * 2, World.getWorldEdgeLength() * 2);

		var ground_material = new THREE.MeshPhongMaterial({
			color: 0xfafafa, 
			side: THREE.BackSide,
			// emissive: 0xaaaafa, 
			// emissiveIntensity: 0.001,
			// shading: THREE.FlatShading

			// wireframe: true
		});
		var ground_material2 = new THREE.MeshPhongMaterial({
			color: 0xffffff, 
			side: THREE.BackSide,
			transparent: true,
			wireframe: true
			// emissive: 0xaaaafa, 
			// emissiveIntensity: 0.001,
			// shading: THREE.FlatShading

			// wireframe: true
		});
		// var ground_material =  new THREE.MeshPhongMaterial({ 
  //   		color: 0xfafafa, 
  //   		specular: 0xfafafa, 
  //   		shininess: 20, 
  //   		morphTargets: true, 
  //   		vertexColors: THREE.FaceColors, 
  //   		// shading: THREE.FlatShading,
  //   		side: THREE.BackSide
  //   	});

		ground = new THREE.Mesh( ground_geometry, ground_material );
		// ground = THREE.SceneUtils.createMultiMaterialObject( ground_geometry, [ground_material, ground_material2] );
		ground.lookAt(new THREE.Vector3(0,-1,0));
		World.getWorld().add( ground );
		ground.position.y = -1;
		ground.receiveShadow = true;

		ground.geometry.dynamic = true;
		for (var i = ground.geometry.vertices.length - 1; i >= 0; i--) {
			var random_height = getRandomArbitrary(-0.1, 0.1);
			ground.geometry.vertices[i].z +=  random_height;
		}
		ground.geometry.computeFaceNormals();
		ground.geometry.computeVertexNormals();
		ground.geometry.verticesNeedUpdate = true;


		/*XMAS TREE*/
		var loader = new THREE.ColladaLoader();	
		loader.load( 'assets/models/lowPolyPine-v2.dae', function (collada) {
			tree = collada.scene;
			tree.position.y -= 2.3;
			console.log('tree', tree);
			if(WEBVR.isAvailable()){
				tree.scale.x = tree.scale.y = tree.scale.z = 0.02;
				// tree.position.y  += 1.9;
			}
			else{
				tree.scale.x = tree.scale.y = tree.scale.z = 0.015;
			}
			tree.updateMatrix();

			// colladaSetProperty(tree, 'castShadow', true);
			// colladaSetProperty(tree, 'receiveShadow', true);
			// tree.castShadow = true;
			// tree.receiveShadow = true;
			World.getWorld().add(tree);
			
			// App.getScene().add(tree);

			var top_color = new THREE.Color("rgb(50%, 80%, 50%)");
			var bottom_color = new THREE.Color("rgb(50%, 50%, 10%)");
			addColorsToTree(top_color, bottom_color);

			// var fake_tree = new THREE.Mesh(
			// 	// new THREE.BoxGeometry( edge_length, edge_length, edge_length, segment_amount, segment_amount, segment_amount),
			// 	tree.children[0].children[0].children[0].geometry,
			// 	new THREE.MeshBasicMaterial({ 

			// 		// fog: false
			// 		color: 0x404040, 
			// 		// wireframe: true 
			// 	})
			// );
			// fake_trees.push(fake_tree);



			console.log('tree', tree);
			
			var style = 1;
			stylizeObject(tree.children[0].children[0].children[0].children[5], style, bottom_color);
			stylizeObject(tree.children[0].children[0].children[0].children[0], style, top_color); //1
			stylizeObject(tree.children[0].children[0].children[0].children[1], style, top_color); //4
			stylizeObject(tree.children[0].children[0].children[0].children[2], style, top_color); //3
			stylizeObject(tree.children[0].children[0].children[0].children[3], style, top_color); //2
			stylizeObject(tree.children[0].children[0].children[0].children[4], style, top_color); //5

			
			// var asd= tree.clone();
			// World.getWorld().add();
			// asd.position.y = 5;
			setupTreeLights();
			// var loader = new THREE.ColladaLoader();	
			// loader.load( 'assets/models/ShadowCaster.dae', function (collada) {
			// 	shadow_caster = collada.scene;
			// 	shadow_caster.position.y -= 2.3;

			// 	// shadow_caster.rotation.x = 0;
			// 	// shadow_caster.rotation.y = 0;
			// 	shadow_caster.rotation.z = Math.PI/4;

			// 	console.log('shadow_caster', shadow_caster);
			// 	if(WEBVR.isAvailable()){
			// 		shadow_caster.scale.x = shadow_caster.scale.y = shadow_caster.scale.z = 0.03;
			// 		shadow_caster.position.y  += 1.9;
			// 	}
			// 	else{
			// 		shadow_caster.scale.x = shadow_caster.scale.y = shadow_caster.scale.z = 0.015;
			// 	}
			// 	// tree.updateMatrix();
			// 	shadow_caster.children[0].children[0].material = new THREE.MeshPhongMaterial({
			// 		// transparent: true,
			// 		// opacity: 0.5,
			// 	});

			// 	colladaSetProperty(shadow_caster, 'castShadow', true);
			// 	colladaSetProperty(shadow_caster, 'receiveShadow', true);
			// 	shadow_caster.castShadow = true;
			// 	shadow_caster.receiveShadow = true;
			// 	World.getWorld().add(shadow_caster);
			// });

		});
		



		/*SNOWFLAKES*/
		//load prefabs
		for (var i = 1; i <= number_snowflake_references; i++){
			var loader = new THREE.ColladaLoader();	
			loader.load( 'assets/models/snowflake' + i + '.dae', function (collada){
				var temp_snowflake_reference = collada.scene;
				snowflake_references.push(temp_snowflake_reference);
			});
		}		
	};


	var update = function(){
		//setting up snow flakes
		if(snowflake_references.length == number_snowflake_references && !snowflakes_initialized){
			snowflakes_initialized = true;
			//init in scene
			for(var i = 0; i < number_snowflakes; i++){
				initSnowflake();					
			}
		}

		// let it snow
		if(snowflakes_initialized){
			for (var i = snowflakes.length - 1; i >= 0; i--) {
				moveSnowflake2(snowflakes[i], i);

				if(snowflakes[i].position.y < -2){
					World.getWorld().remove(snowflakes[i]);
					snowflakes.splice(i, 1);
					//accumulate snowflake on ideally where they touch
					var index = Math.round(getRandomArbitrary(0, ground.geometry.vertices.length-1));
					ground.geometry.vertices[index].z -= 0.2;
					ground.geometry.verticesNeedUpdate = true;

					initSnowflake();
					Audio.playSnowflakeSound();
				}
			}
		}
	};


	var stylizeObject = function(object, style, new_color){
		console.log(object);

		if(!new_color){
			new_color = object.material.color;
		}

		switch(style){
		    case 0:
		        var faceIndices = [ 'a', 'b', 'c' ];
		        var radius = 100;

				var color, f, f2, f3, p, vertexIndex;
				var geometry = new THREE.Geometry().fromBufferGeometry( object.geometry );


				for ( var i = 0; i < geometry.faces.length; i ++ ) {

					f = geometry.faces[ i ];
					// f2 = geometry2.faces[ i ];
					// f3 = geometry3.faces[ i ];

					for( var j = 0; j < 3; j++ ) {

						vertexIndex = f[ faceIndices[ j ] ];

						p = geometry.vertices[ vertexIndex ];

						color = new THREE.Color( 0xffffff );
						color.setHSL( ( p.y / radius + 1 ) / 2, 1.0, 0.5 );
						// color.setHSL( 0.5, 1 / 2, ( p.y / radius + 1 ) );
						// color.setHSL( 0, 0 ,1 );

						f.vertexColors[ j ] = color;

						// color = new THREE.Color( 0xffffff );
						// color.setHSL( 0.0, ( p.y / radius + 1 ) / 2, 0.5 );

						// f2.vertexColors[ j ] = color;

						// color = new THREE.Color( 0xffffff );
						// color.setHSL( 0.125 * vertexIndex/geometry.vertices.length, 1.0, 0.5 );

						// f3.vertexColors[ j ] = color;

					}

				}


				var materials = [
					new THREE.MeshPhongMaterial({ 
							color: new_color, 
							shading: THREE.FlatShading, 
							vertexColors: THREE.VertexColors, 
							shininess: 0 
						}),
					new THREE.MeshBasicMaterial({ 
							color: 0xffffff, 
							shading: THREE.FlatShading, 
							wireframe: true, 
							transparent: true 
						})
				];

				// object.material = null;
				// object.material.materials = materials;

				// object = THREE.SceneUtils.createMultiMaterialObject( geometry, materials );
				group3 = THREE.SceneUtils.createMultiMaterialObject( geometry, materials );
				group3.position = object.position;
				group3.rotation = object.rotation;
				group3.scale.x = group3.scale.y = group3.scale.z = 0.01;
				World.getWorld().add( group3 );
				// console.log('asd', group3);

				// object.material = new THREE.MeshBasicMaterial( { 
				// 			color: 0x000000, 
				// 			shading: THREE.FlatShading, 
				// 			wireframe: true, 
				// 			transparent: true 
				// 		} );

				object.material = null;
				object.material = new THREE.MeshPhongMaterial( { 
					color: new_color,
					shading: THREE.FlatShading, 
					vertexColors: THREE.VertexColors, 
					shininess: 0 
				} );

				object.geometry = geometry;


				// var object2 = object.clone();
				// object2.material = new THREE.MeshBasicMaterial({ 
				// 			color: 0xffffff, 
				// 			shading: THREE.FlatShading, 
				// 			// wireframe: true, 
				// 			// transparent: true 
				// 		});
				// object2.scale.x = object2.scale.y = object2.scale.z = object.scale.x;
				// object2.rotation.x = object.rotation.x;
				// object2.rotation.y = object.rotation.y;
				// object2.rotation.z = object.rotation.z;

				// var test = new THREE.Mesh( geometry, object.material );

				// tree2.push(test);
				// App.getScene().add( object2 );

				object.colorsNeedUpdate = true;
				object.elementsNeedUpdate = true;

		        break;

		    case 1:
		    	var material = new THREE.MeshPhongMaterial({ 
		    		color: new_color, 
		    		specular: 0xffaaaa, 
		    		// shininess: 10, 
		    		// morphTargets: true, 
		    		// morphNormals: true, 
		    		// vertexColors: THREE.FaceColors, 
		    		shading: THREE.FlatShading 
		    	});
		    	object.material = material;
		    	break;

		    default:
		       
		}
	};

	var setupTreeLights = function(){
		// var origin = new THREE.Vector3(0, 5, 0);
		// // Lights.createTreeLight(origin.x, origin.y, origin.z);
		// var direction = new THREE.Vector3(0,-1,0).normalize();
		// console.log('direction', direction);
		// console.log('direction origin', origin+direction);
		// // Lights.createTreeLight((origin.x+direction.x), (origin.y+direction.y), (origin.z+direction.z));
		// var raycaster = new THREE.Raycaster(origin, direction);
		// // var tree_leaves = tree2;
		// // var tree_leaves_parent = tree.children[0].children[0];
		// // console.log(tree_leaves[0]);
		// // var asd = raycaster.intersectObjects(tree_leaves, false);
		// // var asd = raycaster.intersectObjects(App.getScene().children, true);
		// // var asd = raycaster.intersectObjects(World.getWorld().children, true);
		// var asd = raycaster.intersectObjects(tree2, true);
		// // var asd = raycaster.intersectObjects(fake_trees, true);
		// // var asd = raycaster.intersectObject(tree_leaves[0], true);
		// // Lights.createTreeLight(0, (origin.y - asd[0].distance), 0);
		// // console.log('raycaster', raycaster);
		// console.log('asd', asd);

		// /// manual :( raycast on collada does not work?
		if(WEBVR.isAvailable()){
			Lights.createTreeLight(0, 3.9, 0.275);
			Lights.createTreeLight(0.37, 3.55, 0.33);
			Lights.createTreeLight(0.7, 3.2, 0.1);
			Lights.createTreeLight(0.68, 2.85, 0.625);
			Lights.createTreeLight(1.1, 2.52, 0.1);

			Lights.createTreeLight(0.5, 2.4, 0.65);
			Lights.createTreeLight(0.6, 2.25, 0.85);
			Lights.createTreeLight(1.1, 2.1, 0.5);
			Lights.createTreeLight(1.3, 1.90, 0.5);

			Lights.createTreeLight(-0.9, 1.8, 0.85);
			Lights.createTreeLight(-0.8, 1.65, 1.12);
			Lights.createTreeLight(-0.7, 1.5, 1.4);
			Lights.createTreeLight(-0.6, 1.35, 1.65);;

			Lights.createTreeLight(-0.3, 1.25, 1.45);
			Lights.createTreeLight(-0.2, 1.1, 1.65);
			Lights.createTreeLight(-0.1, 0.95, 1.8);
			Lights.createTreeLight(0, 0.8, 2);

			Lights.createTreeLight(0, 0.65, 1.55);
			Lights.createTreeLight(0.1, 0.5, 1.77);
			Lights.createTreeLight(0.2, 0.35, 2.05);
			Lights.createTreeLight(0.3, 0.2, 2.35);		
			Lights.createTreeLight(0.4, 0.05, 2.65);	
		}
		else{
			Lights.createTreeLight(0, 2.28, 0.275);
			Lights.createTreeLight(0.2, 2, 0.33);
			Lights.createTreeLight(0.25, 1.8, 0.475);
			Lights.createTreeLight(0.25, 1.6, 0.625);
			Lights.createTreeLight(0.24, 1.35, 0.775);

			Lights.createTreeLight(0.1, 1.20, 0.65);
			Lights.createTreeLight(0.1, 1.10, 0.775);
			Lights.createTreeLight(0, 1.0, 0.905);
			Lights.createTreeLight(-0.1, 0.9, 1.025);

			Lights.createTreeLight(-0.2, 0.75, 0.95);
			Lights.createTreeLight(-0.4, 0.65, 1);
			Lights.createTreeLight(-0.55, 0.55, 1);
			Lights.createTreeLight(-0.73, 0.45, 1.05);
			// Lights.createTreeLight(-0.85, 0.35, 0.2);

			Lights.createTreeLight(-0.5, 0.35, 0.95);
			Lights.createTreeLight(-0.65, 0.25, 1.05);
			Lights.createTreeLight(-0.8, 0.15, 1.15);
			Lights.createTreeLight(-0.95, 0.05, 1.25);

			Lights.createTreeLight(-0.6, -0.1, 1.05);
			Lights.createTreeLight(-0.3, -0.2, 1.35);
			Lights.createTreeLight(-0.0, -0.3, 1.65);
			Lights.createTreeLight(0.3, -0.44, 1.95);
			Lights.createTreeLight(0.55, -0.58, 2.20);
		}
		
		// Lights.createTreeLight(-0.65, 0.25, 1.05);
		// Lights.createTreeLight(-0.8, 0.15, 1.15);
		// Lights.createTreeLight(-0.95, 0.05, 1.25);

		// Lights.createTreeLight(5, 5, 0);
		// Lights.createTreeLight(0, 5, 5);
		// Lights.createTreeLight(0, 0.5, 0.92);
	};

	var initSnowflake = function(){
		var snowflake_index = Math.round(getRandomArbitrary(0, number_snowflake_references - 1));

		var temp_snowflake = snowflake_references[snowflake_index].clone();
		temp_snowflake.scale.x = 0.05;
		temp_snowflake.scale.y = 0.05;
		temp_snowflake.scale.z = 0.5;

		World.getWorld().add(temp_snowflake);
		snowflakes.push(temp_snowflake);

		temp_snowflake.position.x = getRandomArbitrary(-World.getWorldEdgeLength()/2, World.getWorldEdgeLength()/2);
		temp_snowflake.position.y = World.getWorldEdgeLength()/2 + getRandomArbitrary(0.2, World.getWorldEdgeLength()/2 + 2);
		temp_snowflake.position.z = getRandomArbitrary(-World.getWorldEdgeLength()/2, World.getWorldEdgeLength()/2);


		// set random rotation
		temp_snowflake.rotation.x = getRandomArbitrary(0, 2 * Math.PI);
		temp_snowflake.rotation.y = getRandomArbitrary(0, 2 * Math.PI);
		temp_snowflake.rotation.z = getRandomArbitrary(0, 2 * Math.PI);


		setSnowflakeMovement(temp_snowflake);
		setSnowflakeColor(temp_snowflake);
		colladaSetProperty(temp_snowflake, 'castShadow', true);
		colladaSetProperty(temp_snowflake, 'receiveShadow', true);
	};

	var moveSnowflake = function(target_snowflake, snowflake_index){
		target_snowflake.position.y -= getRandomArbitrary(0, 0.01);
		target_snowflake.position.x -= getRandomArbitrary(-0.01, 0.01)/2;
		target_snowflake.position.z -= getRandomArbitrary(-0.01, 0.01)/2;

		target_snowflake.rotation.x += getRandomArbitrary(-Math.PI/180, Math.PI/180);
		target_snowflake.rotation.y += getRandomArbitrary(-Math.PI/180, Math.PI/180);
		target_snowflake.rotation.z += getRandomArbitrary(-Math.PI/180, Math.PI/180);
	};

	var moveSnowflake2 = function(target_snowflake, snowflake_index){
		// console.log(target_snowflake.asd);
		target_snowflake.position.y -= getRandomArbitrary(0, 0.01);

		target_snowflake.position.x += getNextMovement(target_snowflake, "x");
		target_snowflake.position.z += getNextMovement(target_snowflake, "z");

		if(snowflake_index == 0){
			// console.log("prev", target_snowflake.snowflake_movement.previous["x"],"current", target_snowflake.snowflake_movement.current["x"]);
			// console.log("current", target_snowflake.snowflake_movement.current["x"]);
		}

		target_snowflake.rotation.x += getRandomArbitrary(-Math.PI/180, Math.PI/180);
		target_snowflake.rotation.y += getRandomArbitrary(-Math.PI/180, Math.PI/180);
		target_snowflake.rotation.z += getRandomArbitrary(-Math.PI/180, Math.PI/180);
	};


	/*****utils*******/
	var addColorsToTree = function (top_color, bottom_color){

		var leaves = tree.children[0].children[0].children[0].children;
		for (var i = leaves.length - 1; i >= 0; i--) {
			leaves[i].material = new THREE.MeshLambertMaterial({
				color: top_color
			});
		}
		var body =  tree.children[0].children[0].children[0].children[5];
		body.material = new THREE.MeshLambertMaterial({
			color: bottom_color
		});
	};

	var getNextMovement = function(target_snowflake, axis){
		if(target_snowflake.snowflake_movement.previous[axis] > target_snowflake.snowflake_movement.current[axis]){
			// console.log('decreasing');
			if(target_snowflake.snowflake_movement.current[axis] < target_snowflake.snowflake_movement.min[axis]){
				// console.log("now SWITCH",target_snowflake.snowflake_movement);
				target_snowflake.snowflake_movement.previous[axis] = target_snowflake.snowflake_movement.current[axis];
				target_snowflake.snowflake_movement.current[axis] = target_snowflake.snowflake_movement.min[axis];
			}
			else{
				target_snowflake.snowflake_movement.previous[axis] = target_snowflake.snowflake_movement.current[axis];
				target_snowflake.snowflake_movement.current[axis] -= target_snowflake.snowflake_movement.speed[axis];	
			}
		}
		else{
			// console.log('increasing');
			if(target_snowflake.snowflake_movement.current[axis] > target_snowflake.snowflake_movement.max[axis]){
				// console.log("now SWITCH",target_snowflake.snowflake_movement);
				target_snowflake.snowflake_movement.previous[axis] = target_snowflake.snowflake_movement.current[axis];
				target_snowflake.snowflake_movement.current[axis] = target_snowflake.snowflake_movement.max[axis];
			}
			else{
				target_snowflake.snowflake_movement.previous[axis] = target_snowflake.snowflake_movement.current[axis];
				target_snowflake.snowflake_movement.current[axis] += target_snowflake.snowflake_movement.speed[axis];	
			}
		}

		return target_snowflake.snowflake_movement.current[axis];
	};

	var setSnowflakeMovement = function(target_snowflake){
		var max_flight = 0.02;
		var max_speed = 0.0002;
		target_snowflake.snowflake_movement = {
			"current": {
				"x": 0,
				"z": 0
			},
			"previous": {
				"x": getRandomArbitrary(-max_flight, max_flight),
				"z": getRandomArbitrary(-max_flight, max_flight)
			},
			"max_flight": max_flight,
			"max_speed": max_speed,
			"min": {
				"x": getRandomArbitrary(-max_flight, 0),
				"z": getRandomArbitrary(-max_flight, 0),
			},
			"max": {
				"x": getRandomArbitrary(0, max_flight),
				"z": getRandomArbitrary(0, max_flight)
			},
			"speed": {
				"x": getRandomArbitrary(0, max_speed),
				"z": getRandomArbitrary(0, max_speed)
			}
		}
		// console.log(target_snowflake.snowflake_movement);
	};


	var setSnowflakeColor = function(target_snowflake){
		var snowflake_materials = findSnowFlakeMaterials(target_snowflake, 1);

		for (var i = snowflake_materials.length - 1; i >= 0; i--) {
			var new_r = getRandomArbitrary(0.6, 1);
			var new_g = getRandomArbitrary(0.8, 1);
			var new_b = getRandomArbitrary(0.6, 1);
			// var new_r = getRandomArbitrary(0, 1);
			// var new_g = getRandomArbitrary(0, 1);
			// var new_b = getRandomArbitrary(0, 1);

			// console.log(new_r, new_g, new_b);


			// snowflake_materials[i].color.r = new_r;
			// snowflake_materials[i].color.g = new_g;
			// snowflake_materials[i].color.b = new_b;


			// snowflake_materials[i].emissive.r = new_r;
			// snowflake_materials[i].emissive.g = new_g;
			// snowflake_materials[i].emissive.b = new_b;

			// snowflake_materials[i] = new THREE.MeshPhongMaterial({ 
	  //   		color: 0xff0000, 
	  //   		specular: 0xff0000, 
	  //   		shininess: 20, 
	  //   		morphTargets: true, 
	  //   		vertexColors: THREE.FaceColors, 
	  //   		shading: THREE.FlatShading 
	  //   	});

			snowflake_materials[i].color.r = new_r;
			snowflake_materials[i].color.g = new_g;
			snowflake_materials[i].color.b = new_b;

			snowflake_materials[i].specular.r = new_r;
			snowflake_materials[i].specular.g = new_g;
			snowflake_materials[i].specular.b = new_b;


			snowflake_materials[i].emissive.r = new_r;
			snowflake_materials[i].emissive.g = new_g;
			snowflake_materials[i].emissive.b = new_b;
		    	// object.material = material;
		}
	};

	var findSnowFlakeMaterials = function(dae_object, material_type){
		var materials = [];

		dae_object.traverse( function(child){
			if(child.material){
				switch(material_type){
					case 0:
						child.material =  new THREE.MeshLambertMaterial({

						});
						break;

					case 1:
						child.material = new THREE.MeshPhongMaterial({ 
				    		color: 0xff0000, 
				    		specular: 0xff0000, 
				    		shininess: 20, 
				    		morphTargets: true, 
				    		vertexColors: THREE.FaceColors, 
				    		shading: THREE.FlatShading 
				    	});
						break;
				}
				

				materials.push(child.material);
			}
		});

		if(dae_object.material){
			materials.push(dae_object.material);
		}

		return materials;
	}


	var colladaSetProperty = function(dae_object, property, new_state){
		dae_object[property] = new_state;
		for (var i = dae_object.children.length - 1; i >= 0; i--) {
			colladaSetProperty(dae_object.children[i], property, new_state);
		}
	};

	// Returns a random number between min (inclusive) and max (exclusive)
	var getRandomArbitrary = function (min, max) {
		return Math.random() * (max - min) + min;
	}

	var getTree = function(){
		return tree;
	}


	// public methods
	return{
		init: init,
		update: update,
		getTree: getTree,
		getRandomArbitrary: getRandomArbitrary
	}
}();
