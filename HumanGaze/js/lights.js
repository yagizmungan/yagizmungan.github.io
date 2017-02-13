var Lights = function(){
	var lights = [];

	var rotation_angle = 0;
	var rotation_radius = 0;
	var pivot_point;
	var main_light;

	var init = function(){
		App.getScene().add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

		main_light = new THREE.DirectionalLight(0xffffff, 0.5);
		main_light.castShadow = true;
		main_light.shadow.mapSize.width = 2048;
		main_light.shadow.mapSize.height = 2048;

		var d = 5;

		main_light.shadow.camera.left = -d;
		main_light.shadow.camera.right = d;
		main_light.shadow.camera.top = d;
		main_light.shadow.camera.bottom = -d;

		main_light.shadow.camera.far = 3500;
		main_light.shadow.bias = -0.0001;
		

		if(WEBVR.isAvailable()){
			App.getScene().add(main_light.target);
			main_light.position.set( App.getCamera().position.x, App.getCamera().position.y + 2, App.getCamera().position.z ).normalize();
			main_light.target.position.x = 0;
			main_light.target.position.y = -5;
			main_light.target.position.z = 0;

		}
		else{
			main_light.position.set(1, 1, 1 ).normalize();
		}	
		lights.push(main_light);
		// console.log(main_light);
		

		rotation_radius = main_light.position.distanceTo(Level.getEarth().position);
		pivot_point = Level.getEarth().position;

		App.getScene().add(main_light);
	};

	var rotateMainLight = function(){	
		if(main_light) {	
			main_light.position.x = pivot_point.x + Math.cos(rotation_angle) * rotation_radius;
			main_light.position.z = pivot_point.z + Math.sin(rotation_angle) * rotation_radius;
			main_light.position.y = pivot_point.y + Math.cos(rotation_angle/5) * rotation_radius;
			rotation_angle += 0.01;
		}
	};

	var update = function() {
		rotateMainLight();
		// console.log(main_light.position);
	};


	var getLights = function(){
		return lights;
	};

	// public methods
	return{
		init: init,
		getLights: getLights,
		update: update
	}
}();