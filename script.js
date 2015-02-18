
var WIDTH = 640,
    HEIGHT = 480;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, WIDTH/HEIGHT, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();

function main(){
  console.log("Hello world from javascript");
  draw3dCube();
}


function draw3dCube(){

  renderer.setSize( WIDTH, HEIGHT);
  document.body.appendChild( renderer.domElement );

  var geometry = new THREE.BoxGeometry( 1, 1, 1 );
  var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  var cube = new THREE.Mesh( geometry, material );

  scene.add( cube );
  camera.position.z = 5;

  renderer.render( scene, camera );
}

function draw2dRect(){
  var cvs = document.getElementById('cvs');
  var ctx = cvs.getContext('2d');
  ctx.fillStyle = "red";
  ctx.fillRect(20,20,50,50);
  ctx.fillStyle = "blue";
  ctx.fillRect(40,40,50,50);
}
