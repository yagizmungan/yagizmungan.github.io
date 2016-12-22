var Landscape = function(){
	var renderer;
	var scene;
	var camera;
	var enabled = false;
	var controls;
	var car;

	var width;
	var height;

	var inside = false;

	var init = function(){
		// alert($(window).width());
		width = window.screen.height; //= ($(window).width() > $(window).height()) ? $(window).width() : $(window).height();
		height = window.screen.width;// = ($(window).width() < $(window).height()) ? $(window).height() : $(window).width();
		if(window.screen.width > window.screen.height){
			width = window.screen.width;
			height = window.screen.height;
		}

		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
		renderer = new THREE.WebGLRenderer({ 
			antialias: true 
		});

		


		$('#landscape').width(width);
		$('#landscape').height(height);

		renderer.setSize(width, height);
		renderer.setPixelRatio(window.devicePixelRatio);
		document.getElementById("landscape").appendChild(renderer.domElement);


		// controls = new THREE.DeviceOrientationControlsLimits(camera);
		controls = new THREE.OrbitControls(camera, renderer.domElement);

		var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
				dirLight.color.setHSL( 0.1, 1, 0.95 );
				dirLight.position.set( -1, 1.75, 1 );
				dirLight.position.multiplyScalar( 50 );
				scene.add( dirLight );

		//car

		// var mtlLoader = new THREE.MTLLoader();
		// mtlLoader.setPath( '../../assets/models/2017_Audi_Q5_OBJ/' );
		// mtlLoader.load( '2017_Audi_Q5_LOW.mtl', function( materials ) {
		// 	console.log('materials are loaded');
		// 	materials.preload();
		// 	var objLoader = new THREE.OBJLoader();
		// 	objLoader.setMaterials( materials );
		// 	objLoader.setPath( '../../assets/models/2017_Audi_Q5_OBJ/' );
		// 	objLoader.load( '2017_Audi_Q5_LOW.obj', function ( object ) {
		// 		console.log('model is loaded');
		// 		car = object;
		// 		scene.add( car );
		// 	});
		// });

		var room_geometry = new THREE.BoxGeometry(16,16,16,8,8,8);
		var room_material = new THREE.MeshBasicMaterial({
			color: 0xff0000,
			wireframe: true,
			side : THREE.Back
		});
		var room = new THREE.Mesh(room_geometry, room_material);
		scene.add(room);

		var objLoader = new THREE.OBJLoader();
		// http://yagizmungan.com/assets/models/2017_Audi_Q5_OBJ/2017_Audi_Q5_LOW.obj
		objLoader.setPath( '../assets/models/2017_Audi_Q5_OBJ/' );
		objLoader.load( '2017_Audi_Q5_LOW.obj', function ( object ) {
			alert('model is loaded');
			car = object;
			car.scale.x = car.scale.y = car.scale.z = 0.01;
			// car.rotateZ = Math.PI/2;
			var look_at = new THREE.Vector3(0,1,0);
			car.lookAt(look_at);

			var rotate_axis = new THREE.Vector3(0, 0, 1);
			car.rotateOnAxis(rotate_axis, Math.PI/2);

			// var look_at = new THREE.Vector3(0,0,1);
			// car.lookAt(look_at);
			// car.position.z = -5;
			scene.add( car );
		});



		camera.position.z = 5;
		var look_at = new THREE.Vector3(0,0,0);
		// car.lookAt(look_at);
		camera.lookAt(look_at)

		console.log("landscape initiated");

		
		render();
	};

	var render = function() {
		if(enabled){
			// console.log("threejs working");
			// cube.rotation.x += 0.1;
			if(car){
				car.rotation.z += 0.003;	
			}
			

			requestAnimationFrame( render );
			controls.update();
			renderer.render( scene, camera );
		}
	};

	var activate = function(){
		enabled = true;
		render();
		document.getElementById("landscape").style.display = "block";
		$('landscape').width = window.innerWidth;
		$('landscape').height = window.innerHeight;
		console.log("landscape activated");
	};

	var deactivate = function(){
		enabled = false;		
		document.getElementById("landscape").style.display = "none";		
	};

	return {
		init: init,
		activate: activate,
		deactivate: deactivate
	};
}();