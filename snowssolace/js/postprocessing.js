var Postprocessing = function(){
	var composer;

	shaderTime = 0;
	var filmPass = new THREE.ShaderPass(THREE.FilmShader);
	var filmParams = {
		count: 800,
		sIntensity: 0.9,
		nIntensity: 0.1
	};
	filmPass.uniforms[ 'sCount' ].value = filmParams.count;
	filmPass.uniforms[ 'sIntensity' ].value = filmParams.sIntensity;
	filmPass.uniforms[ 'nIntensity' ].value = filmParams.nIntensity;
		
		
	var staticPass = new THREE.ShaderPass(THREE.StaticShader);
	var staticParams = {
		amount: 0.1,
		size: 4.0
	};
	staticPass.uniforms[ 'amount' ].value = staticParams.amount;
	staticPass.uniforms[ 'size' ].value = staticParams.size;
		

	var init = function(){
		// if ( WEBVR.isAvailable() === true ) {
		// 	composer = new THREE.EffectComposer( App.getVREffect() );
		// }
		// else{
			composer = new THREE.EffectComposer( App.getRenderer() );
		// }
		composer.setSize(window.innerWidth, window.innerHeight);

		var renderPass = new THREE.RenderPass(App.getScene(), App.getCamera());
		composer.addPass(renderPass);

		// composer.addPass(filmPass);
		composer.addPass(staticPass);

		var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
		effectCopy.renderToScreen = true;
		
		composer.addPass(effectCopy);			

		// gui = new dat.GUI();
		// var f4 = gui.addFolder('Static');
		// f4.add(staticParams, 'amount', 0.0,1.0).step(0.01).listen().onChange(onParamsChange);
		// f4.add(staticParams, 'size', 1.0,100.0).step(1.0).onChange(onParamsChange);
		// f4.open();

		// var f3 = gui.addFolder('Scanlines');
		// f3.add(filmParams, 'count', 50, 1000).onChange(onParamsChange);
		// f3.add(filmParams, 'sIntensity', 0.0, 2.0).step(0.1).onChange(onParamsChange);
		// f3.add(filmParams, 'nIntensity', 0.0, 2.0).step(0.1).onChange(onParamsChange);
		// f3.open();		
	};

	var onParamsChange = function(){
			staticPass.uniforms[ 'amount' ].value = staticParams.amount;
			staticPass.uniforms[ 'size' ].value = staticParams.size;
			// rgbPass.uniforms[ 'angle' ].value = rgbParams.angle*Math.PI;
			// rgbPass.uniforms[ 'amount' ].value = rgbParams.amount;
			filmPass.uniforms[ 'sCount' ].value = filmParams.count;
			filmPass.uniforms[ 'sIntensity' ].value = filmParams.sIntensity;
			filmPass.uniforms[ 'nIntensity' ].value = filmParams.nIntensity;
		};

	var getComposer = function(){
		return composer;
	};

	var update = function (){
		shaderTime += 0.1;
		// filmPass.uniforms[ 'time' ].value =  shaderTime;
		staticPass.uniforms[ 'time' ].value =  shaderTime;
	};

	
	// public methods
	return{
		init: init,
		getComposer: getComposer,
		update: update
	}
}();