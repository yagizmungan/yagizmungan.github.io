var Lights = function(){
	var lights = [];
	var tree_lights = [];

	var bulb_colors = [0xff0000, 0x00ff00, 0x0000ff, 0xff00ff, 0x00ffff, 0xffff00, 0xa05600, 0x66f066];

	var init = function(){
		App.getScene().add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

		var light = new THREE.DirectionalLight( 0xffffff );
		

		if(WEBVR.isAvailable()){
			App.getScene().add(light.target);
			light.position.set( App.getCamera().position.x, App.getCamera().position.y + 2, App.getCamera().position.z ).normalize();
			light.target.position.x = 0;
			light.target.position.y = -3;
			light.target.position.z = -World.getWorldEdgeLength()/3;

		}
		else{
			light.position.set( 1, 1, 1 ).normalize();
		}	
		lights.push(light);
		console.log(light);
		
		App.getScene().add( light );


		// createTreeLight(0,2.6,0);

		

	};

	var createTreeLight = function(x, y, z){
		var bulb_geometry = new THREE.SphereGeometry (0.03, 8, 8);
		// var bulb_geometry = new THREE.SphereGeometry (1, 8, 8);

		// var bulb_color = new THREE.Color(Math.random() * 0xffffff);
		// var bulb_color = new THREE.Color("rgb("+Level.getRandomArbitrary(0,100)+"%, "+Level.getRandomArbitrary(0,100)+"%, "+Level.getRandomArbitrary(0,100)+"%)");
		// console.log(bulb_color);
		// var r = Math.random();
		// var b = Math.random();
		// var g = Math.random();
		// console.log(r, g, b);
		// bulb_color.r = r;
		// bulb_color.g = g;
		// bulb_color.b = b;
		// var bulb_color = new THREE.Color(0x00ff00);

		var bulb_color = new THREE.Color(bulb_colors[Math.round(Level.getRandomArbitrary(0, bulb_colors.length -1))]);

		// console.log(bulb_color);


		var bulb_material = new THREE.MeshPhongMaterial({
			'emissive': bulb_color,
			'emissiveIntensity': 10,
			'color': bulb_color,
			// 'shininess': 100
		});

		bulb_material.emissiveIntensity = 10;
				bulb_material.shininess = 10;

		var bulb = new THREE.Mesh(bulb_geometry, bulb_material);

		bulb.fog = null;

		// var point_light = new THREE.PointLight( bulb_color, 1, 1 );
		// point_light.fog = null;
		// bulb.add( point_light );

		bulb.position.x = x;
		bulb.position.y = y;
		bulb.position.z = z;
		App.getScene().add(bulb);
		tree_lights.push(bulb);

		var second_bulb = bulb.clone();
		// var axis = new THREE.Vector3(0,1,0);
		// second_bulb.rotateOnAxis(axis, Math.PI/2);
		second_bulb.position.x = -x;
		second_bulb.position.z = -z;
		App.getScene().add(second_bulb);
		tree_lights.push(second_bulb);


		var third_bulb = bulb.clone();
		// var axis = new THREE.Vector3(0,1,0);
		// second_bulb.rotateOnAxis(axis, Math.PI/2);
		third_bulb.position.x = z;
		third_bulb.position.z = x;
		App.getScene().add(third_bulb);
		tree_lights.push(third_bulb);

		var fourth_bulb = bulb.clone();
		// var axis = new THREE.Vector3(0,1,0);
		// second_bulb.rotateOnAxis(axis, Math.PI/2);
		fourth_bulb.position.x = -z;
		fourth_bulb.position.z = -x;
		App.getScene().add(fourth_bulb);
		tree_lights.push(fourth_bulb);
		// Level.getTree().add(bulb);
	};

	var getLights = function(){
		return lights;
	};

	// public methods
	return{
		init: init,
		getLights: getLights,
		createTreeLight: createTreeLight
	}
}();