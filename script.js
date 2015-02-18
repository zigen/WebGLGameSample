var WIDTH = 640,
    HEIGHT = 480;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, WIDTH/HEIGHT, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();

var cnt  = 0,
    orbitRadius = 5,
    isRunning = true,
    fallingCubes = [],
    player
;

function main(){
  document.body.onkeypress = onkeydown; 
  init();
  render();
}

function addCube(position,geometry,material){
  var cube =  new THREE.Mesh( geometry, material );
  scene.add(cube);
  cube.position.x = position.x;
  cube.position.y = position.y;
  cube.position.z = position.z;
  return cube;
}

function addFallingCube(geometry,material){
  var position = generateRandomPosition();
  var cube =  new THREE.Mesh( geometry, material );
  scene.add(cube);
  fallingCubes.push(cube);
  cube.position.x = position.x;
  cube.position.y = position.y;
  cube.position.z = position.z;
}


function generateRandomPosition(){
  var min = -4, max = 4;
  return new THREE.Vector3(rand(),rand(),rand());
  function rand(){
    return Math.random()*(max-min)+ min;
  }
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

  for(i = 0;i < 20;i ++)addFallingCube(geometry,material);

  playerMaterial =new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
  player = new THREE.Mesh(geometry,playerMaterial);
  scene.add(player);


  lookat= new THREE.Vector3(0,0,0);

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

  for(i = 0; i < fallingCubes.length ; i++){
    var cube = fallingCubes[i];
    cube.position.y -= 0.05;
    if(cube.position.y < -1)cube.position.y = 5;
  }
  cnt += 0.01;
}

function render(){
  update();
  requestAnimationFrame( render );
  renderer.render( scene, camera );
}

function onkeydown(e){
  e.preventDefault();
  switch (e.keyCode){
    case 32:
    isRunning = !isRunning;
    break;
    case 37:
    player.position.x += 0.5; 
    break;
    case 39:
    player.position.x +D= 0.5; 
    break;
    case 38:
    player.position.z += 0.5; 
    break;
    case 40:
    player.position.z -= 0.5; 
    break;
    default : 
    console.log(e.keyCode);
  }
}
