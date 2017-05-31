class ThreejsMagic {
	constructor(){
		const SCENE = new THREE.Scene();
		const CAMERA = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

		var renderer = new THREE.WebGLRenderer({antialias: true});
		renderer.setSize( window.innerWidth, window.innerHeight );
		// renderer.setClearColorHex( 0x004500, 1 );
		document.getElementById('threejs-magic').appendChild( renderer.domElement );

		var geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
		var material = new THREE.MeshPhongMaterial( { 
      color: 0xaa0000, 
      // wireframe: true,
      shading: THREE.FlatShading
    });
		var object = new THREE.Mesh(geometry, material);
		SCENE.add(object);

		CAMERA.position.z = 30;

    var lights = [];
    lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

    lights[ 0 ].position.set( 0, 200, 0 );
    lights[ 1 ].position.set( 100, 200, 100 );
    lights[ 2 ].position.set( - 100, - 200, - 100 );

    SCENE.add( lights[ 0 ] );
    // SCENE.add( lights[ 1 ] );
    SCENE.add( lights[ 2 ] );

		var render = function () {
			requestAnimationFrame( render );

			object.rotation.x += 0.01;
			object.rotation.y += 0.01;

			renderer.render(SCENE, CAMERA);
		};

		render();
	}
}
