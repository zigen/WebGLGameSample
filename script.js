var WIDTH = 640,
    HEIGHT = 480;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, WIDTH/HEIGHT, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();

var cnt  = 0,
    orbitRadius = 9,
    isRunning = true,
    fallingCubes = [],
    RED = new THREE.Color(1,0,0),
    GREEN = new THREE.Color(0,1,0),
    point = 0,
    cubeSize = 0.5,
    cubeMargin = 0.05,
    pointView,
    tetriminoList = new Array(),
    targetIndex = -1 ,
    GROUND_LEVEL= 0
;
var unitLength = cubeMargin + cubeSize;

var TETRIMINO = {
  "I" : [[1,1],    [2,1],    [3,1],    [4,1]],
  "O" : [[1,1],    [1,2],    [2,1],    [2,2]],
  "S" : [[1,1],    [2,1],    [2,2],    [3,2]],
  "Z" : [[1,2],    [2,2],    [2,1],    [3,1]],
  "J" : [[1,2],    [1,1],    [2,1],    [3,1]],
  "L" : [[1,1],    [2,1],    [3,1],    [3,2]],
  "T" : [[1,1],    [2,1],    [2,2],    [3,1]]
};

var TETRIMINO_COLOR = {
  "I":"cyan",
  "O":"yellow",
  "S":"green",
  "Z":"red",
  "J":"blue",
  "L": "orange",
  "T":"purple"
};

function main(){
  document.body.onkeydown = onkeydown; 
  pointView = document.getElementById('point'); 
  init();
  render();
}


function Tetrimino(type,spawnPoint){
  var material = new THREE.MeshLambertMaterial( { color: TETRIMINO_COLOR[type]} );
  var cubeGeo = new THREE.BoxGeometry( cubeSize, cubeSize, cubeSize);
  var positions = TETRIMINO[type];
  for(i in positions){
    positions[i][0]+= spawnPoint.x;
    positions[i][1]+= spawnPoint.y;
  }
  this.cubes = addCubes(positions,cubeGeo, material);
  targetIndex++;
}

Tetrimino.prototype = {
  fall : function(){
    for(i in this.cubes){
      if(this.cubes[i].position.y - unitLength <= GROUND_LEVEL){
        console.log("Reach the Ground level"); 
        return ;
      };
    }
    for(i in this.cubes){
      this.cubes[i].position.y -= unitLength;
    }
  },
  moveRight: function(){
    for(i in this.cubes){
      this.cubes[i].position.x += unitLength;
    }
  },
  moveLeft : function(){
    for(i in this.cubes){
      this.cubes[i].position.x -= unitLength;
    }
  },
  rotate : function (clockwise){/* clockwise : boolean */

  },
  getPositions : function(){
    var positions = [];
    for(i in this.cubes){
      positions.push(this.cubes[i].position);
    }
    return positions;
  }
};

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

function addCubes(positions, geometry, material){
  var cubes = [];
  for(i in positions){
    var pos = positions[i];
    var x = pos[0] * unitLength;
    var y = pos[1] * unitLength;
    var cube =  addCube(
      {x:x, y:y, z:1},
      geometry, material);
    cube.userData = {x: pos[0], y:pos[1]};
    cubes.push(cube);
  }
  return cubes;
}

function init(){
  renderer.setSize( WIDTH, HEIGHT);
  document.body.appendChild( renderer.domElement );

  var geometry = new THREE.BoxGeometry( 1, 1, 1 );
  material = new THREE.MeshLambertMaterial( { color: 0xffffff } );

  var light  = new THREE.DirectionalLight( 0xffffff ,1.0);
  light.position.set(1,3,2);

  var groundGemetry = new THREE.PlaneGeometry(10,10);
  ground = new THREE.Mesh(groundGemetry, material);
  ground.rotateX(-Math.PI * 0.5);
  ground.position.set(0,-0.5,0);

  lookat= new THREE.Vector3(0,1,0);

  tetriminoList.push(new Tetrimino("T",{x:0,y:6}));

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
    tetriminoList[targetIndex].moveLeft();
    break;
    case 39:
    tetriminoList[targetIndex].moveRight();
    break;
    case 38:
    break;
    case 40:
    tetriminoList[targetIndex].fall();
    break;
    default : 
    console.log(e.keyCode);
  }
}
