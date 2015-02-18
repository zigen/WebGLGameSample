
var WIDTH = 640,
    HEIGHT = 480;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, WIDTH/HEIGHT, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();

var cnt  = 0,
    orbitRadius = 5;

function main(){
  console.log("Hello world from javascript");
  draw3dCube();
}


function draw3dCube(){

  renderer.setSize( WIDTH, HEIGHT);
  document.body.appendChild( renderer.domElement );

  var geometry = new THREE.BoxGeometry( 1, 1, 1 );
  var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

  cube = new THREE.Mesh( geometry, material );
  cubePoint = new THREE.Vector3(0,-1,0);
  cube.position = cubePoint;

  scene.add( cube );
  camera.position.z = 5;

  render();
}

function update(){
  camera.position.x = Math.sin(cnt) * orbitRadius;
  camera.position.z = Math.cos(cnt) * orbitRadius;
  camera.position.y = Math.sin(cnt) * orbitRadius;
  camera.lookAt(cubePoint);
  cnt += 0.01;
}

function render(){
update();
 requestAnimationFrame( render );
 renderer.render( scene, camera );
}

