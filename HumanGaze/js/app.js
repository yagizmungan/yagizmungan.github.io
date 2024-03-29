// TODO 
// Lights - first pass
// Sounds - first pass
// Post-processing visuals (scanlines cause grayscale)
// phone orientation change  is broken on landscape
// accumulate snow - first pass
// shadow looks broken and now disabled

var App = function(){

	var clock = new THREE.Clock();

	var container;
	var camera, scene, renderer;
	var effect, controls;
	var controller1, controller2;
	var room;

	var all_controls = [];

	var rotate_around = false;

	var init = function(){

		container = document.createElement( 'div' );
		document.body.appendChild( container );

		scene = new THREE.Scene();
		console.log(scene);
		scene.fog = new THREE.FogExp2( 0x000000, 0.15 );

		/*setup renderer*/
		setupRenderer();

		/*camera*/
		setupCamera();		

		/*environment*/
		World.init();
		room = World.getWorld();					

		/*Actual Content*/
		Level.init();

		/*Global lights*/
		// Lights.init();

		/*controllers*/
		setupControls();
					
		if ( WEBVR.isAvailable() === true ) {
			scene.position.y -= World.getWorldEdgeLength();
			effect = new THREE.VREffect( renderer );
			document.body.appendChild( WEBVR.getButton( effect ) );
			// stylizeWEBVRButton("Experience in VR"); 
		}

		window.addEventListener( 'resize', onWindowResize, false );

		Postprocessing.init();

		Audio.init();

		animate();

		// Page.init();
	};


	var onWindowResize = function() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		if(effect){
			effect.setSize( window.innerWidth, window.innerHeight );
		}
		else{
			renderer.setSize( window.innerWidth, window.innerHeight);
		}
	};


	var animate = function() {
		// console.log('rendering');
		if(effect){
			effect.requestAnimationFrame( animate );	
		}
		else{
			requestAnimationFrame(animate);
		}
		
		render();
	};

	var render = function() {

		for (var i = all_controls.length - 1; i >= 0; i--) {
			// console.log('calling update on controllers');
			all_controls[i].update();
		}

		// hacking device orientaiton to orbit around
		if(rotate_around){
			camera.position.set(0,0,0);
        	camera.translateZ( World.getMobileCameraStartingPoint().z);	
		}		

		Level.update();
		Postprocessing.update();

		if(effect){
			effect.render( scene, camera );
		}
		else{
			if(Postprocessing.getComposer()){
				var delta = clock.getDelta();
				Postprocessing.getComposer().render(delta);	
			}
			else{
				renderer.render( scene, camera );
			}
			
		}
	};


	var setupCamera = function(){		
		if(WEBVR.isAvailable()){
			camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, World.getWorldEdgeLength()*2 );

			// TODO needs to be changed
			// camera.position.x = World.getVRCameraStartingPoint().x;
			// camera.position.y = World.getVRCameraStartingPoint().y;
			// camera.position.z = World.getVRCameraStartingPoint().z;

			scene.add( camera );			
		}
		else{
			// no hard coding
			camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);

			camera.position.x = World.getNonVRCameraStartingPoint().x;
			camera.position.y = World.getNonVRCameraStartingPoint().y;
			camera.position.z = World.getNonVRCameraStartingPoint().z;
		}		
	};

	var setupRenderer = function(){
		renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setClearColor( 0x505050 );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.sortObjects = false;
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.renderReverseSided = false;
		container.appendChild( renderer.domElement );
	};

	var setupControls = function(){
		// make sure it is generic
		if(WEBVR.isAvailable()){
			controls = new THREE.VRControls( camera );
			controls.standing = true;

			all_controls.push(controls);
			// see if there can be hand controllers
			setupHandControllers();
		}
		else{
			// defer controller setup upon the event
			// what if this takes too much time
			window.addEventListener('deviceorientation', setupNonVRControls, true);
		}
	};


    var setupNonVRControls = function(event) {
    	// console.log(event);
    	if(event.alpha === null && event.beta === null && event.gamma === null) {
    		// alert('no accelormeter');

    		// fine tune damping, zoom limits and rotation....

    		controls = new THREE.OrbitControls( camera, renderer.domElement );
    		// controls.maxPolarAngle = Math.PI/2; 
			// controls.addEventListener( 'change', render ); // remove when using animation loop
			// enable animation loop when using damping or autorotation
			// controls.enableDamping = true;
			// controls.dampingFactor = 0.25;
			controls.enableZoom = false;

			all_controls.push(controls);
    	}
    	else {
    		window.removeEventListener('deviceorientation', setupNonVRControls, true);
    		// setup accelerometer controls
    		// what if non mobile devices with out accelerometers..

    		// figure out what to fine tune
    		rotate_around = true;
	        controls = new THREE.DeviceOrientationControlsLimits( camera );
	        // controls = new THREE.DeviceOrientationControlsLimitsOrientation(camera);
	        
	        all_controls.push(controls);
    	}       
    };

	var setupHandControllers = function(){

		/***************VIVE CONTROLLERS***************/
		controller1 = new THREE.ViveController( 0 );
		controller1.standingMatrix = controls.getStandingMatrix();
		scene.add( controller1 );

		controller2 = new THREE.ViveController( 1 );
		controller2.standingMatrix = controls.getStandingMatrix();
		scene.add( controller2 );

		all_controls.push(controller1);
		all_controls.push(controller2);

		var loader = new THREE.OBJLoader();
		loader.setPath( './js/three.js-dev/examples/models/obj/vive-controller/' );
		loader.load( 'vr_controller_vive_1_5.obj', function ( object ) {

			var loader = new THREE.TextureLoader();
			loader.setPath( './js/three.js-dev/examples/models/obj/vive-controller/' );

			var controller = object.children[ 0 ];
			controller.material.map = loader.load( 'onepointfive_texture.png' );
			controller.material.specularMap = loader.load( 'onepointfive_spec.png' );

			controller1.add( object.clone() );
			controller2.add( object.clone() );

		} );
	};

	var getScene = function(){
		return scene;
	};

	var getClock = function(){
		return clock;
	};

	var getControl = function(){
		return controls;
	};

	var getCamera = function(){
		return camera;
	};
	
	var getRenderer = function(){
		return renderer;
	};

	var getVREffect = function(){
		return effect;
	};

	var isDebug = function(){
		return false;
	};

	var stylizeWEBVRButton = function(new_label){
		//get the button
		var button = document.getElementsByTagName("button")[0];
		// console.log("new button text", new_label);
		button.innerHTML = new_label;//new_label;
		$(button).text(new_label);
		$(button).html(new_label);
		$(button).css({
			"width": "120px",
			"font-family": "Roboto",
			"border": "solid white 1px"

		});
		console.log('sty;lized', button);
		// console.log(button);
	};


	// public methods
	return{
		init: init,
		getScene: getScene,
		getClock: getClock,
		getRenderer: getRenderer,
		getVREffect: getVREffect,
		getControl: getControl,
		getCamera: getCamera,
		isDebug: isDebug
	}
}();
