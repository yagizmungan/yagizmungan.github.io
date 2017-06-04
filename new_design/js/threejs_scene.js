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
      color: 0xffffff, 
      shininess: 50, 
      // wireframe: true,
      specular: 0x999999,
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
    lights[ 0 ] = new THREE.PointLight( 0xff0000, 1, 0 );
    lights[ 1 ] = new THREE.PointLight( 0x00ff00, 1, 0 );
    lights[ 2 ] = new THREE.PointLight( 0x0000ff, 1, 0 );

    lights[ 0 ].position.set( 0, 200, 0 );
    lights[ 0 ].theta = {
      modes: [0,0,0],
      r: 200
    };
    lights [0].change_color = {
      r: 1,
      g: 0,
      b: 0,
      direction: 0
    };
    lights[ 1 ].position.set( 200, 0, 0 );
    lights[ 1 ].theta = {
      modes: [0,0,0],
      r: 200
    };
    lights [1].change_color = {
      r: 0,
      g: 1,
      b: 0,
      direction: 0
    };
    lights[ 2 ].position.set( 0, 0, - 200 );
    lights[ 2 ].theta = {
      modes: [0,0,0],
      r: 200
    };
    lights [2].change_color = {
      r: 0,
      g: 0,
      b: 1,
      direction: 0
    };

    SCENE.add( lights[ 0 ] );
    SCENE.add( lights[ 1 ] );
    SCENE.add( lights[ 2 ] );

		const render = () => {
			requestAnimationFrame( render );

			object.rotation.x += 0.01;
			object.rotation.y += 0.01;

			RENDERER.render(SCENE, CAMERA);

      updateObject();
      rotateLight(lights[0], 2, 0.003);
      rotateLight(lights[1], 1, 0.01);
      rotateLight(lights[2], 0, 0.03);
      changeColor(lights[0], 0, 0.003, 0.7, 1);
      changeColor(lights[1], 1, 0.001, 0, 0.3);
      changeColor(lights[2], 2, 0.002, 0, 1);
      window.addEventListener( 'resize', onWindowResize, false );
		};

    


    var onWindowResize = () => {
      CAMERA.aspect = window.innerWidth / window.innerHeight;
      CAMERA.updateProjectionMatrix();
      RENDERER.setSize( window.innerWidth, window.innerHeight );
    }


    var updateObject = () => {
      let vertices = object.geometry.vertices;
      let multiplier = 1;
      let sin_multiplier = 1;
      let time = Date.now();//CLOCK.elapsedTime;
      // console.log(time);
      let scale = 2 * Math.PI/vertices.length;

      for(let i = 0; i < vertices.length; i++) {

        // best so far
        vertices[i].x = default_vertices[i].x + Math.sin(i + sin_multiplier * time/(103 + i/5)) * multiplier;
        vertices[i].y = default_vertices[i].y + Math.sin(i + sin_multiplier * time/(93 + i/5)) * multiplier;
        vertices[i].z = default_vertices[i].z + Math.sin(i + sin_multiplier * time/(83 + i/5)) * multiplier; 
      }

      object.geometry.verticesNeedUpdate = true;
      object.geometry.normalsNeedUpdate = true;
      object.geometry.computeFaceNormals();
      object.geometry.computeVertexNormals();
    };

    var rotateLight = (light_object, mode, speed) => {
      // console.log(light_object.theta.modes[mode]);
      if(mode == 2) {
        light_object.position.y = light_object.theta.r * Math.sin(light_object.theta.modes[mode]);
        light_object.position.z = light_object.theta.r * Math.cos(light_object.theta.modes[mode]);

        light_object.theta.modes[mode] += speed;
      }
      else if(mode == 1) {
        light_object.position.x = light_object.theta.r * Math.sin(light_object.theta.modes[mode]);
        light_object.position.z = light_object.theta.r * Math.cos(light_object.theta.modes[mode]);

        light_object.theta.modes[mode] += speed;
      }
      else if(mode == 0) {
        light_object.position.x = light_object.theta.r * Math.sin(light_object.theta.modes[mode]);
        light_object.position.y = light_object.theta.r * Math.cos(light_object.theta.modes[mode]);

        light_object.theta.modes[mode] += speed;
      }
    }

    var changeColor = (light_object, mode, speed, min, max) => {
      if(mode == 0) {
        if(light_object.change_color.direction == 0) {
          light_object.change_color.r += speed;
          if(light_object.change_color.r > max) {
            light_object.change_color.r = max;
            light_object.change_color.direction = 1;
          }
        }  
        else {
          light_object.change_color.r -= speed;
          if(light_object.change_color.r < min) {
            light_object.change_color.r = min;
            light_object.change_color.direction = 0;
          }
        }      
      }
      else if(mode == 1) {
        if(light_object.change_color.direction == 0) {
          light_object.change_color.g += speed;
          if(light_object.change_color.g > max) {
            light_object.change_color.g = max;
            light_object.change_color.direction = 1;
          }
        }  
        else {
          light_object.change_color.g -= speed;
          if(light_object.change_color.g < min) {
            light_object.change_color.g = min;
            light_object.change_color.direction = 0;
          }
        }      
      }
      else if(mode == 2) {
        if(light_object.change_color.direction == 0) {
          light_object.change_color.b += speed;
          if(light_object.change_color.b > max) {
            light_object.change_color.b = max;
            light_object.change_color.direction = 1;
          }
        }  
        else {
          light_object.change_color.b -= speed;
          if(light_object.change_color.b < min) {
            light_object.change_color.b = min;
            light_object.change_color.direction = 0;
          }
        }      
      }
      // console.log(light_object.change_color.r, light_object.change_color.g, light_object.change_color.b);
      light_object.color.setRGB(light_object.change_color.r, light_object.change_color.g, light_object.change_color.b);
    };

		render();
	}
}
