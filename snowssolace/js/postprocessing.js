var Postprocessing = function(){

	var init = function(){
		// var bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);//1.0, 9, 0.5, 512);
		// // var bloomPass = new THREE.BloomPass();
		// var copyShader = new THREE.ShaderPass(THREE.CopyShader);
		// copyShader.renderToScreen = true;

		// composer = new THREE.EffectComposer(App.getRenderer());
  //   	composer.setSize(window.innerWidth, window.innerHeight);
  //   	// composer.addPass(renderScene);
		// // composer.addPass(effectFXAA);
  //   	composer.addPass(bloomPass);
		// composer.addPass(copyShader);
	};

	
	// public methods
	return{
		init: init
	}
}();