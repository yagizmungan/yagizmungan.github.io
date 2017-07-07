var GeometryUtils = function() {

	var createHandMesh = function() {
		// let geometry = new THREE.TorusKnotGeometry(2, 1, 100, 16);
		// let geometry = new THREE.SphereGeometry(0.05, 32, 32);
		let geometry = new THREE.SphereGeometry(0.05, 16, 16);
		// let geometry = new THREE.SphereGeometry(1, 32, 32);
		// let geometry = new THREE.SphereGeometry(4, 32, 32);
		// let geometry = new THREE.TorusKnotGeometry(2, 1, 100, 16);
		// let geometry = new THREE.TorusKnotGeometry(0.05, 0.02, 100, 16);
		let material = new THREE.MeshPhongMaterial( { 
			color: 0xff0000, 
			shininess: 50, 
			// wireframe: true,
			specular: 0x999999,
			shading: THREE.FlatShading
		});
		let object = new THREE.Mesh(geometry, material);

		object.default_vertices = [];
		let vertices = object.geometry.vertices;
		for (var i = 0; i < vertices.length; i++) {
			object.default_vertices.push({
				x: 0,
				y: 0,
				z: 0
			})
			object.default_vertices[i].x=vertices[i].x;
			object.default_vertices[i].y=vertices[i].y;
			object.default_vertices[i].z=vertices[i].z;

		}

		return object;
	};

	var createHandTriggerMesh = function() {
		let geometry = new THREE.SphereGeometry(0.05, 4, 4);

		let material = new THREE.MeshStandardMaterial( { 
			opacity: 0,
			transparency: true
		});
		let object = new THREE.Mesh(geometry, material);

		return object;
	};

	
	var rippleObject = function(object, multiplier) {

		let vertices = object.geometry.vertices;
		if(!multiplier) {
			multiplier = 0.001;	
		}
		
		let sin_multiplier = 1;
		let time = Date.now();//CLOCK.elapsedTime;
		// console.log(time);
		let scale = 2 * Math.PI/vertices.length;

		for(let i = 0; i < vertices.length; i++) {
			// best so far
			vertices[i].x = object.default_vertices[i].x + Math.sin(i + sin_multiplier * time/(103 + i/5)) * multiplier;
			vertices[i].y = object.default_vertices[i].y + Math.sin(i + sin_multiplier * time/(93 + i/5)) * multiplier;
			vertices[i].z = object.default_vertices[i].z + Math.sin(i + sin_multiplier * time/(83 + i/5)) * multiplier; 
		}

		object.geometry.verticesNeedUpdate = true;
		object.geometry.normalsNeedUpdate = true;
		object.geometry.computeFaceNormals();
		object.geometry.computeVertexNormals();
	};

	var resetRipple = function(object) {
		let vertices = object.geometry.vertices;
		
		for(let i = 0; i < vertices.length; i++) {
			vertices[i].x = object.default_vertices[i].x;
			vertices[i].y = object.default_vertices[i].y;
			vertices[i].z = object.default_vertices[i].z;
		}

		object.geometry.verticesNeedUpdate = true;
		object.geometry.normalsNeedUpdate = true;
		object.geometry.computeFaceNormals();
		object.geometry.computeVertexNormals();
	};

	var pulseObject = function(object, max, min, speed) {		
		var scale = object.animation_scale;
		var old_scale = scale;

		if(object.pulse_direction == 1) {
			scale = scale + speed;
			if(scale > max) {
				scale = max;
				object.pulse_direction = 0;
			}			
		}
		else {
			
			scale -= speed;
			if(scale < min) {
				scale = min;
				object.pulse_direction = 1;
			}
		}

		object.animation_scale = scale;
		object.scale.multiplyScalar(scale/old_scale);
	};

	var pulseObjectTo = function(object, target, speed) {
		var scale = object.scale.x;

		if(scale == target) {
			return;
		}
		if(target > scale) {
			scale += speed;
			if (scale > target) {
				scale = target;
			}
		}
		else {
			scale -= speed;
			if (scale < target) {
				scale = target;
			}
		}
		object.scale.multiplyScalar(scale);
	};
	
	// public methods
	return{
		createHandMesh: createHandMesh,
		createHandTriggerMesh: createHandTriggerMesh,
		rippleObject: rippleObject,
		resetRipple: resetRipple,
		pulseObject: pulseObject,
		pulseObjectTo: pulseObjectTo
	}
}();
