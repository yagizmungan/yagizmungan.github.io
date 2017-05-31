var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
// renderer.setClearColorHex( 0x004500, 1 );
document.getElementById('threejs-magic').appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 6, 2, 2 );
var material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

var render = function () {
	requestAnimationFrame( render );

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render(scene, camera);
};

render();