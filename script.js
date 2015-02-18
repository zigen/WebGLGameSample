function main(){
  console.log("Hello world from javascript");
  draw2dRect();
}

function draw2dRect(){
  var cvs = document.getElementById('cvs');
  var ctx = cvs.getContext('2d');
  ctx.fillStyle = "red";
  ctx.fillRect(20,20,50,50);
  ctx.fillStyle = "blue";
  ctx.fillRect(40,40,50,50);
}
