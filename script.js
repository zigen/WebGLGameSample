var WIDTH = 640,
    HEIGHT = 480;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, WIDTH/HEIGHT, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();

var cnt  = 0,
    orbitRadius = 7,
    isRunning = true,
    fallingCubes = [],
    player,
    RED = new THREE.Color(1,0,0),
    GREEN = new THREE.Color(0,1,0),
    point = 0,
    pointView
;

function main(){
  document.body.onkeydown = onkeydown; 
  pointView = document.getElementById('point'); 
  init();
  render();
}

  

function addCube(position,geometry,material){
  var cube =  new THREE.Mesh( geometry, material.clone() );
  scene.add(cube);
  cube.position.x = position.x;
  cube.position.y = position.y;
  cube.position.z = position.z;
  return cube;
}

function updatePointView(){
  pointView.innerHTML = point + " hit";
}

function respawn(cube){
  cube.userData.hit = false;
  var pos = generateRandomPosition();
  cube.position.x = pos.x;
  cube.position.y = 5;
  cube.position.z = pos.z;
  cube.material.color = GREEN;
}

function init(){
  renderer.setSize( WIDTH, HEIGHT);
  document.body.appendChild( renderer.domElement );

  var geometry = new THREE.BoxGeometry( 1, 1, 1 );
  var material = new THREE.MeshLambertMaterial( { color: 0xffffff } );

  var light  = new THREE.DirectionalLight( 0xffffff ,1.0);
  light.position.set(1,3,1);

  var groundGemetry = new THREE.PlaneGeometry(10,10);
  ground = new THREE.Mesh(groundGemetry, material);
  ground.rotateX(-Math.PI * 0.5);
  ground.position.set(0,-0.5,0);


  lookat= new THREE.Vector3(0,0,0);

  addCube({x:0,y:1,z:0},geometry, material);
  addCube(new THREE.Vector3(1.5, 0.50,0),geometry, material);
  

  scene.add(ground);
  scene.add(light);
  camera.position.z = 5;

}

function update(){
  if(!isRunning)return ;
  camera.position.x = Math.sin(cnt) * orbitRadius;
  camera.position.z = Math.cos(cnt) * orbitRadius;
  camera.position.y = Math.abs(Math.sin(cnt) * 0.5 * orbitRadius);
  camera.lookAt(lookat);


  updatePointView();
  cnt += 0.01;
}

function render(){
  update();
  requestAnimationFrame( render );
  renderer.render( scene, camera );
}

function onkeydown(e){
  switch (e.keyCode){
    case 32:
    e.preventDefault();
    isRunning = !isRunning;
    break;
    case 37:
    break;
    case 39:
    break;
    case 38:
    break;
    case 40:
    break;
    default : 
    console.log(e.keyCode);
  }
}
