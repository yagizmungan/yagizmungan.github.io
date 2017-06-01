class ThreejsMagic {
	constructor(){
		const SCENE = new THREE.Scene();
		const CAMERA = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
		const RENDERER = new THREE.WebGLRenderer({antialias: true});
    const CLOCK = new THREE.Clock();

		RENDERER.setSize( window.innerWidth, window.innerHeight );
		// renderer.setClearColorHex( 0x004500, 1 );
		document.getElementById('threejs-magic').appendChild(RENDERER.domElement);

		let geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
		let material = new THREE.MeshPhongMaterial( { 
      color: 0xaa0000, 
      // wireframe: true,
      shading: THREE.FlatShading
    });
		let object = new THREE.Mesh(geometry, material);

    let default_vertices = [];
    let vertices = object.geometry.vertices
    for (var i = 0; i < vertices.length; i++) {
      default_vertices.push({
        x: 0,
        y: 0,
        z: 0
      })
      default_vertices[i].x=vertices[i].x;
      default_vertices[i].y=vertices[i].y;
      default_vertices[i].z=vertices[i].z;
    }

		SCENE.add(object);

    // var r = "textures/cube/"+id+"/";
    // var urls = [ r + "px."+res, r + "nx."+res,
    //        r + "py."+res, r + "ny."+res,
    //        r + "pz."+res, r + "nz." +res];

    // cube_texture = THREE.ImageUtils.loadTextureCube( urls );


    // var geometry2 = new THREE.SphereGeometry(60, 64, 64);
    // var materialPhongCube = new THREE.MeshPhongMaterial( { 
    //   shininess: 50, 
    //   color: 0xffffff, 
    //   specular: 0x999999, 
    //   // envMap: cube_texture; 
    // });
    // var material2 = new THREE.MeshPhongMaterial( { 
    //   shininess: 50, 
    //   color: 0xffffff, 
    //   specular: 0x999999,
    //   wireframe: true,
    //   shading: THREE.FlatShading,
    //   side: THREE.DoubleSide
    // });
    // var object2 = new THREE.Mesh(geometry2, material2);
    // SCENE.add(object2);

		CAMERA.position.z = 30;

    let lights = [];
    lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

    lights[ 0 ].position.set( 0, 200, 0 );
    lights[ 1 ].position.set( 100, 200, 100 );
    lights[ 2 ].position.set( - 100, - 200, - 100 );

    SCENE.add( lights[ 0 ] );
    SCENE.add( lights[ 1 ] );
    SCENE.add( lights[ 2 ] );

		const render = () => {
			requestAnimationFrame( render );

			object.rotation.x += 0.01;
			object.rotation.y += 0.01;

			RENDERER.render(SCENE, CAMERA);

      updateObject();
		};

    var updateObject = () => {
      let vertices = object.geometry.vertices;
      let multiplier = 1;
      let time = Date.now();//CLOCK.elapsedTime;
      // console.log(time);

      for(let i = 0; i < vertices.length; i++) {
        // vertices[i].x = default_vertices[i].x + Math.sin(time);
        // vertices[i].y = default_vertices[i].y + Math.sin(time);
        // vertices[i].z = default_vertices[i].z + Math.sin(time);

        // vertices[i].x = default_vertices[i].x + Math.sin(i + time/100);
        // vertices[i].y = default_vertices[i].y + Math.sin(i + time/90);
        // vertices[i].z = default_vertices[i].z + Math.sin(i + time/80);

        // vertices[i].x = default_vertices[i].x + Math.sin(i + time/(103 + i)) * multiplier;
        // vertices[i].y = default_vertices[i].y + Math.sin(i + time/(93 + i)) * multiplier;
        // vertices[i].z = default_vertices[i].z + Math.sin(i + time/(83 + i)) * multiplier;

        vertices[i].x = default_vertices[i].x + Math.sin(i + time/(103 + i/5)) * multiplier;
        vertices[i].y = default_vertices[i].y + Math.sin(i + time/(93 + i/5)) * multiplier;
        vertices[i].z = default_vertices[i].z + Math.sin(i + time/(83 + i/5)) * multiplier;

        // vertices[i].x = default_vertices[i].x + Math.sin(time * i) * multiplier;
        // vertices[i].y = default_vertices[i].y + Math.sin(time * i) * multiplier;
        // vertices[i].z = default_vertices[i].z + Math.sin(time * i) * multiplier;

        // vertices[i].x = default_vertices[i].x + Math.sin(time * i);
        // vertices[i].y = default_vertices[i].y + Math.sin(time * i);
        // vertices[i].z = default_vertices[i].z + Math.sin(time * i);

        // vertices[i].x = default_vertices[i].x + Math.random() * multiplier;
        // vertices[i].y = default_vertices[i].y + Math.random() * multiplier;
        // vertices[i].z = default_vertices[i].z + Math.random() * multiplier;

        // vertices[i].x = default_vertices[i].x + Math.sin(Math.random() * multiplier * Math.PI);
        // vertices[i].y = default_vertices[i].y + Math.sin(Math.random() * multiplier * Math.PI);
        // vertices[i].z = default_vertices[i].z + Math.sin(Math.random() * multiplier * Math.PI);

        // vertices[i].x = default_vertices[i].x + Math.sin(Math.random() * multiplier * i);
        // vertices[i].y = default_vertices[i].y + Math.sin(Math.random() * multiplier * i);
        // vertices[i].z = default_vertices[i].z + Math.sin(Math.random() * multiplier * i);
      }

      // var magn = .5;
      // // var time = Date.now();
      // var max=2;

      // for (var i = 0; i < vertices.length; i++) {
      //   // console.log(vert[i].ox, vert[i].oy, vert[i].oz);
      //   var mod=0.2;
      //   // if(default_vertices[i].z>-2)mod=1;
      //   vertices[i].x=default_vertices[i].x+mod*Math.max(-max,Math.min(max,Math.sin( i*.96+time/113)*magn))
      //   vertices[i].y=default_vertices[i].y+mod*Math.max(-max,Math.min(max,Math.sin( i*1.23+time/122)*magn))
      //   vertices[i].z=default_vertices[i].z+mod*Math.max(-max,Math.min(max,Math.sin(-i*1.4+time/135)*magn))
      // };  

      // for (var i = 0; i < vert.length; i++) {
      //   // console.log(vert[i].ox, vert[i].oy, vert[i].oz);
      //   var mod=0.2;
      //   if(vert[i].oz>-2)mod=1;
      //   vert[i].x=vert[i].ox+mod*Math.max(-max,Math.min(max,Math.sin( i*.96+time/113)*magn))
      //   vert[i].y=vert[i].oy+mod*Math.max(-max,Math.min(max,Math.sin( i*1.23+time/122)*magn))
      //   vert[i].z=vert[i].oz+mod*Math.max(-max,Math.min(max,Math.sin(-i*1.4+time/135)*magn))
      // };      

      object.geometry.verticesNeedUpdate = true;
      object.geometry.normalsNeedUpdate = true;
      object.geometry.computeFaceNormals();
      object.geometry.computeVertexNormals();
    };

    var updateObjectM = () => {
      var magn = .2;
      var time = Date.now();
      var max=2;
      var vert = object.geometry.vertices

      for (var i = 0; i < vert.length; i++) {
        // console.log(vert[i].ox, vert[i].oy, vert[i].oz);
        var mod=0.2;
        if(vert[i].oz>-2)mod=1;
        vert[i].x=vert[i].ox+mod*Math.max(-max,Math.min(max,Math.sin( i*.96+time/113)*magn))
        vert[i].y=vert[i].oy+mod*Math.max(-max,Math.min(max,Math.sin( i*1.23+time/122)*magn))
        vert[i].z=vert[i].oz+mod*Math.max(-max,Math.min(max,Math.sin(-i*1.4+time/135)*magn))
      };
      object.geometry.verticesNeedUpdate = true;
      object.geometry.normalsNeedUpdate=true;
      object.geometry.computeFaceNormals();
      object.geometry.computeVertexNormals();
    };

		render();
	}
}
