
var WIDTH = 640,
    HEIGHT = 480;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, WIDTH/HEIGHT, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();

var cnt  = 0,
    orbitRadius = 5,
    isRunning = false;

var cuttingHeight = 0,
    cuttingHeightOffset = -0.5;
var cuttingPlane = new THREE.Plane(new THREE.Vector3(0,-1,0), 0);
var lines = [];

function main(){
  document.body.onkeydown = onkeydown; 
  init();
  render();
}

function setCuttingHeight(h){
  cuttingHeight = h;
  cuttingPlane = new THREE.Plane(new THREE.Vector3(0,-1,0), cuttingHeight + cuttingHeightOffset);
}

function init(){
  renderer.setSize( WIDTH, HEIGHT);
  document.body.appendChild( renderer.domElement );

  //var geometry = new THREE.BoxGeometry( 1, 1, 1 );
  //var geometry = new THREE.TorusGeometry( 9, 3, 14, 86 );
  var geometry = new THREE.CylinderGeometry( 2, 3, 2, 32 );
  var material = new THREE.MeshLambertMaterial( { color: 0xffffff } );

  var light  = new THREE.DirectionalLight( 0xffffff ,1.0);
  light.position.set(1,3,1);

  var groundGemetry = new THREE.PlaneGeometry(10,10);
  ground = new THREE.Mesh(groundGemetry, material);

  ground.rotateX(-Math.PI * 0.5);
  ground.position.set(0,-0.5,0);

  cube = new THREE.Mesh( geometry, material );
  cubePoint = new THREE.Vector3(0,1.5,0);
  cube.position.set(0,0,0);

  scene.add( cube );
  scene.add(ground);
  scene.add(light);
  camera.position.z = 5;
  var axisHelper = new THREE.AxisHelper( 5 );
  scene.add( axisHelper );

  edges = new THREE.EdgesHelper( cube, 0x00ff00 );
  scene.add(edges);
  computeIntersectEdge(cube);
}

function genLine(v1,v2,color){

  var material = new THREE.LineBasicMaterial({
    color: color || 0xff0000
  });

  var geometry = new THREE.Geometry();
  geometry.vertices.push(v1,v2);

  var line = new THREE.Line( geometry, material );
  lines.push(line);
  scene.add( line );
}


function getIntersectPointWithPlane(v1,v2,plane){
  var dir = v2.clone();
  var ray = new THREE.Ray(v1.clone(),dir.sub(v1).normalize());
  return ray.intersectPlane(plane);
}

function genLineOnPlaneAndTriangle(v0,v1,v2,plane){
  var _res = [];
  _res.push(getIntersectPointWithPlane(v0,v1,plane));
  _res.push(getIntersectPointWithPlane(v1,v2,plane));
  _res.push(getIntersectPointWithPlane(v0,v2,plane));
  return remove_if(_res, function(a){ return a != null; }); 
}

function remove_if (ar,fn){
  var _res = [];
  for(i in ar){
    if(fn(ar[i])){
      _res.push(ar[i]);
    } 
  }
  return _res;
}

function computeIntersectEdge(obj){
  var vertices = obj.geometry.vertices,
      faces = obj.geometry.faces
        ;
  for(faceIndex = 0; faceIndex < faces.length; faceIndex++){
    var _vertices = [];
      _vertices.push( vertices[faces[faceIndex].a] );
      _vertices.push( vertices[faces[faceIndex].b] );
      _vertices.push( vertices[faces[faceIndex].c] );
      genLine(_vertices[0],_vertices[1]);
      genLine(_vertices[1],_vertices[2]);
      genLine(_vertices[2],_vertices[0]);

      setCuttingHeight(cuttingHeight = 0);
      while(cuttingHeight < 10){
        setCuttingHeight(cuttingHeight += 0.05);
        var _intersectPoints = genLineOnPlaneAndTriangle(_vertices[0],_vertices[1],_vertices[2],cuttingPlane);
        if(_intersectPoints.length == 2){
          genLine(_intersectPoints[0], _intersectPoints[1], 0x0000ff);
        }
      }
  }
}

function update(){
  if(!isRunning)return ;
  camera.position.x = Math.sin(cnt) * orbitRadius;
  camera.position.z = Math.cos(cnt) * orbitRadius;
  camera.position.y = Math.abs(Math.sin(cnt) * 0.5 * orbitRadius);
  camera.lookAt(cubePoint);
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
      isRunning = !isRunning;
      break;
    default : 
      console.log(e.keyCode);
  }
}
