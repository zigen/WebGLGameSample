var WIDTH = 640,
    HEIGHT = 480;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, WIDTH/HEIGHT, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();

var cnt  = 0,
    orbitRadius = 12,
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
    GROUND_LEVEL= 0,
    LEFT_BOUND = -5,
    RIGHT_BOUND = 5,
    SPAWN_POINT = {x:0, y:20}
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
var TETRIMINO_TYPES = ["I","O","S","Z","J","L","T"];

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
    this._moveInternalPos(0,-1);
  },
  moveRight: function(){
    for(i in this.cubes){
      this.cubes[i].position.x += unitLength;
    }
    this._moveInternalPos(1,0);
  },
  moveLeft : function(){
    for(i in this.cubes){
      this.cubes[i].position.x -= unitLength;
    }
    this._moveInternalPos(-1,0);
  },
  _moveInternalPos : function(dx,dy){
    for(i in this.cubes){
      this.cubes[i].userData.pos.x += dx;
      this.cubes[i].userData.pos.y += dy;
    }
  },
  rotate : function (clockwise){/* clockwise : boolean */

  },
  getPositions : function(){
    var positions = [];
    for(i in this.cubes){
      var pos = this.cubes[i].userData.pos;
      positions.push({x:pos.x, y:pos.y})
    }
    return positions;
  },
  isGroundLevel : function(){
    for(i in this.cubes){
      if(this.cubes[i].position.y - unitLength <= GROUND_LEVEL){
        return true;
      };
    }
    return false;
  },
  isOutOfRightBound: function(){
    for(i in this.cubes){
      if(this.cubes[i].position.x + unitLength >= RIGHT_BOUND ){
        return true;
      };
    }
    return false;
  },
  isOutOfLeftBound: function(){
    for(i in this.cubes){
      if(this.cubes[i].position.x - unitLength <= LEFT_BOUND ){
        return true;
      };
    }
    return false;
  }
};

function isHit(positions1, positions2){
  for(i in positions1){
    var p1 = positions1[i];
    for(j in positions2){
      var p2 = positions2[j];
      if(p1.x == p2.x && p1.y == p2.y)return true;
    }
  }
  return false;
}

function collisionCheck(dx,dy){
  var selected = tetriminoList[targetIndex].getPositions();
  for(i in selected){
    selected[i].x += dx;
    selected[i].y += dy;
  }
  if(targetIndex == 0)return false;
  for(i in tetriminoList){
    if(i != targetIndex){
      if(isHit(selected ,tetriminoList[i].getPositions()))return true;
    }
  }
  return false;
}

function isMoveableTo(dx,dy){
  var target = tetriminoList[targetIndex];

  if( dx > 0){ // move right
    if(target.isOutOfRightBound()){
      return false;
    }
  }

  if(dx < 0){// move left
    if(target.isOutOfLeftBound()){
      return false;
    }
  }

  if(collisionCheck(dx,dy))return false;
  return true;
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

function addCubes(positions, geometry, material){
  var cubes = [];
  for(i in positions){
    var pos = positions[i];
    var x = pos[0] * unitLength;
    var y = pos[1] * unitLength;
    var cube =  addCube(
      {x:x, y:y, z:1},
      geometry, material);
    cube.userData.pos = {x: pos[0], y:pos[1]};
    cubes.push(cube);
  }
  return cubes;
}

function addTetrimino(type){
  type = type || TETRIMINO_TYPES[Math.floor(Math.random()*TETRIMINO_TYPES.length)];
  tetriminoList.push(new Tetrimino(type, SPAWN_POINT));
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

  lookat= new THREE.Vector3(0,7,0);

  addTetrimino("I");

  scene.add(ground);
  scene.add(light);
  camera.position.z = 5;

}

function fixedUpdate(){
  if(!isRunning)return ;
  camera.position.x = Math.sin(cnt) * orbitRadius;
  camera.position.z = Math.cos(cnt) * orbitRadius;
  camera.position.y = Math.abs(Math.sin(cnt) * 0.5 * orbitRadius);
  camera.lookAt(lookat);


  updatePointView();
  cnt += 0.01;
}

function render(){
  fixedUpdate();
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
    if(isMoveableTo(-1,0))tetriminoList[targetIndex].moveLeft();
    break;
    case 39:
    if(isMoveableTo(1,0))tetriminoList[targetIndex].moveRight();
    break;
    case 38:
    break;
    case 40:
    if(tetriminoList[targetIndex].isGroundLevel() || !isMoveableTo(0,-1)){
      addTetrimino();
    }else{
      tetriminoList[targetIndex].fall();
    }
    break;
    default : 
    console.log(e.keyCode);
  }
}
