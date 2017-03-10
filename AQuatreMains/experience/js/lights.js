var Lights = function(){
	var lights = [];

	var init = function(){
		App.getScene().add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

		var directional_light = new THREE.DirectionalLight(0xffffff, 0.5);
		directional_light.castShadow = true;
		directional_light.shadow.mapSize.width = 2048;
		directional_light.shadow.mapSize.height = 2048;

		var d = 5;

		directional_light.shadow.camera.left = -d;
		directional_light.shadow.camera.right = d;
		directional_light.shadow.camera.top = d;
		directional_light.shadow.camera.bottom = -d;

		directional_light.shadow.camera.far = 3500;
		directional_light.shadow.bias = -0.0001;
		

		if(WEBVR.isAvailable()){
			App.getScene().add(directional_light.target);
			directional_light.position.set( App.getCamera().position.x, App.getCamera().position.y + 2, App.getCamera().position.z ).normalize();
			directional_light.target.position.x = 0;
			directional_light.target.position.y = -5;
			directional_light.target.position.z = 0;

		}
		else{
			directional_light.position.set(1, 1, 1 ).normalize();
		}	
		lights.push(directional_light);
		console.log(directional_light);
		
		App.getScene().add(directional_light);
	};


	var getLights = function(){
		return lights;
	};

	// public methods
	return{
		init: init,
		getLights: getLights
	}
}();