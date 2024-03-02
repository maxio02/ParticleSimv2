import Particle from "./Particle";
import Vec2D from "./Vec2D";
import { back_ctx, ctx, foreground_canvas, particles, gridSize, pointerPosition, fieldSize, clicked, drawOutline, gravity, fps, applyConstraint, applyAttractorForces } from "./script";


export function drawParticles() {
  particles.forEach((particle) => {
    particle.draw();
  });
}

export function drawGrid() {
  back_ctx.clearRect(0, 0, foreground_canvas.width, foreground_canvas.height)
  back_ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  back_ctx.lineWidth = 1;
  for (let x = gridSize; x < foreground_canvas.width; x += gridSize) {
    back_ctx.beginPath();
    back_ctx.moveTo(x, 0);
    back_ctx.lineTo(x, foreground_canvas.height);
    back_ctx.stroke();
  }
  for (let y = gridSize; y < foreground_canvas.height; y += gridSize) {
    back_ctx.beginPath();
    back_ctx.moveTo(0, y);
    back_ctx.lineTo(foreground_canvas.width, y);
    back_ctx.stroke();
  }
}

export function drawTail(from: Vec2D, to: Vec2D) {
  if (clicked && from.x != to.x && from.y != to.y) {
    const dotSize = 5;
    const dotCount = 8;
    const distance = from.difference(to);
    drawPredictedPath(from.clone(), distance.clone())
    distance.divide(dotCount);
    var angle = Math.atan2(to.y - from.y, to.x - from.x);
    var new_to = new Vec2D(to.x, to.y);

    new_to.x -= Math.cos(angle);
    new_to.y -= Math.sin(angle);

    for (let i = 0; i <= dotCount; i++) {
      var dotX = from.x - distance.x * i;
      var dotY = from.y - distance.y * i;
      drawDot(dotX, dotY, dotSize, 255);
    }
    
  }
}

function drawPredictedPath(startPos: Vec2D, vec: Vec2D){
  let dotCount = 510;
  let predictedDot = new Particle(startPos, 15, vec, 'black')
  for (let i = 1; i <= dotCount; i++) {

    predictedDot.accelerate(gravity);
    applyConstraint(predictedDot);
    applyAttractorForces(predictedDot);
    predictedDot.updatePosition(0.5 * 0.25);
    
    if(i%15 == 0){
      drawDot(predictedDot.pos_curr.x, predictedDot.pos_curr.y, 5, 255-i/2)
    }

  }

}

export function drawDot(dotX: number, dotY: number, dotSize: number, opacity:number) {
  ctx.beginPath();
  ctx.arc(
    dotX,
    dotY,
    dotSize,
    0,
    2 * Math.PI,
    false
  );

  ctx.fillStyle = `rgba(210, 210, 210, ${opacity/255})`;
  ctx.fill();

  ctx.closePath();
}

export function drawLasso() {
  if (clicked) {
    const lineWidth = 3;
    ctx.beginPath();
    ctx.arc(pointerPosition.x, pointerPosition.y, fieldSize, 0, 2 * Math.PI);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.stroke();
    ctx.closePath();
  }
}
export function drawArrow(from: Vec2D, to: Vec2D) {
  if (clicked && from.x != to.x && from.y != to.y) {
    var angle = Math.atan2(to.y - from.y, to.x - from.x);
    const width = 10;
    var headlen = 10;
    var new_to = new Vec2D(to.x, to.y);
    // This makes it so the end of the arrow head is located at tox, toy, don't ask where 1.15 comes from
    new_to.x -= Math.cos(angle) * ((width * 1.15));
    new_to.y -= Math.sin(angle) * ((width * 1.15));



    //starting path of the arrow from the start square to the end square and drawing the stroke
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(new_to.x, new_to.y);
    ctx.strokeStyle = "#bbbbbb";
    ctx.lineWidth = width;
    ctx.stroke();

    //starting a new path from the head of the arrow to one of the sides of the point
    ctx.beginPath();
    ctx.moveTo(new_to.x, new_to.y);
    ctx.lineTo(new_to.x - headlen * Math.cos(angle - Math.PI / 7), new_to.y - headlen * Math.sin(angle - Math.PI / 7));

    //path from the side point of the arrow, to the other side point
    ctx.lineTo(new_to.x - headlen * Math.cos(angle + Math.PI / 7), new_to.y - headlen * Math.sin(angle + Math.PI / 7));

    //path from the side point back to the tip of the arrow, and then again to the opposite side point
    ctx.lineTo(new_to.x, new_to.y);
    ctx.lineTo(new_to.x - headlen * Math.cos(angle - Math.PI / 7), new_to.y - headlen * Math.sin(angle - Math.PI / 7));

    //draws the paths created above
    ctx.strokeStyle = "#bbbbbb";
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.fillStyle = "#bbbbbb";
    ctx.fill();
    ctx.closePath();
  }
}