var World = function(){

	var world;
	var edge_length = 24;
	var segment_amount = 10;
	

	var init = function(){
		var world_texture = new THREE.TextureLoader().load( "./assets/images/world_texture.png" );
		world_texture.wrapS = THREE.RepeatWrapping;
		world_texture.wrapT = THREE.RepeatWrapping;
		world_texture.repeat.set( segment_amount/2, segment_amount/2);

		world = new THREE.Mesh(
			// new THREE.BoxGeometry( edge_length, edge_length, edge_length, segment_amount, segment_amount, segment_amount),
			new THREE.SphereGeometry( edge_length, segment_amount, segment_amount ),
			new THREE.MeshBasicMaterial({ 
				map: world_texture,
				side: THREE.BackSide
				,
				// fog: false
				// color: 0x404040, 
				// wireframe: true 
			})
		);

		console.log(world);

		if(WEBVR.isAvailable()){
			world.position.z = -edge_length/2;
		}

		App.getScene().add(world);
	};

	

	var getWorld = function(){
		return world;
	};

	var getAbsoluteCenter = function(){
		var center = new THREE.Vector3(world.position.x, edge_length/2 + world.position.y, world.position.z);
		return center;
	};

	var getRelativeCenter = function(){
		return new THREE.Vector3(world.position.x, edge_length/2 + world.position.y, world.position.z);
	};

	var getNonVRCameraStartingPoint = function(){
		return {
			x: edge_length/2,
			y: edge_length/4, 
			z: edge_length/2
		};
	};

	var getVRCameraStartingPoint = function(){
		return {
			x: edge_length/2,
			y: edge_length/2, 
			z: edge_length/2
		};
	};

	var getMobileCameraStartingPoint = function(){
		return {
			x: edge_length/2,
			y: edge_length/2, 
			z: edge_length/2
		};
	};

	var getWorldEdgeLength = function(){
		return edge_length;
	};


	// public methods
	return{
		init: init,
		getWorld: getWorld,
		getWorldEdgeLength: getWorldEdgeLength,
		getAbsoluteCenter: getAbsoluteCenter,
		getVRCameraStartingPoint: getVRCameraStartingPoint,
		getNonVRCameraStartingPoint: getNonVRCameraStartingPoint,
		getMobileCameraStartingPoint: getMobileCameraStartingPoint
	}
}();
