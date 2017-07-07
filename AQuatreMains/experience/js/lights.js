var Lights = function(){
	var lights = [];
	var outer_point_light;

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
		

		// if(App.getVrCanWork()){
		// 	// App.getScene().add(directional_light.target);
		// 	// directional_light.position.set( App.getCamera().position.x, App.getCamera().position.y + 2, App.getCamera().position.z ).normalize();
		// 	// directional_light.target.position.x = 0;
		// 	// directional_light.target.position.y = -5;
		// 	// directional_light.target.position.z = 0;

		// }
		// else{
			directional_light.position.set(1, 1, 1 ).normalize();
		// }	
		lights.push(directional_light);

		if(App.getVrCanWork()){
			var spotLight = new THREE.SpotLight( 0xffffff );
			// spotLight.intensity = 100;
			App.getCamera().add(spotLight);
		}

		var inner_point_light = new THREE.PointLight(0xffffff, 0.3);
		inner_point_light.position = new THREE.Vector3(0,0,0);

		outer_point_light = new THREE.PointLight(0xffffff, 0.3);
		outer_point_light.position.set(14, 2, 0);

		App.getScene().add(inner_point_light);
		App.getScene().add(outer_point_light);

		
		// App.getScene().add(directional_light);
	};

	var update = function(time){
		time = App.getClock().getElapsedTime();
		outer_point_light.position.set(14 * Math.sin(time), 2, 14 * Math.cos(time));
	};


	var getLights = function(){
		return lights;
	};

	// public methods
	return{
		init: init,
		update: update,
		getLights: getLights
	}
}();