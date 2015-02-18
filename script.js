
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
  var material = new THREE.MeshLambertMaterial( { color: 0xffffff } );

  var directionalLight = new THREE.DirectionalLight( 0xfffff ,2.0);
  directionalLight.position.set(1,3,1);

  var groundGemetry = new THREE.PlaneGeometry(10,10);
  ground = new THREE.Mesh(groundGemetry, material);

  ground.rotateX(-Math.PI * 0.5);
  ground.position.set(0,-0.5,0);

  cube = new THREE.Mesh( geometry, material );
  cubePoint = new THREE.Vector3(0,0,0);
  cube.position = cubePoint;

  scene.add( cube );
  scene.add(ground);
  scene.add(directionalLight);


  camera.position.z = 5;

  render();
}

function update(){
  camera.position.x = Math.sin(cnt) * orbitRadius;
  camera.position.z = Math.cos(cnt) * orbitRadius;
  camera.position.y = Math.sin(cnt) * 0.5 * orbitRadius;
  camera.lookAt(cubePoint);
  cnt += 0.01;
}

function render(){
update();
 requestAnimationFrame( render );
 renderer.render( scene, camera );
}

