import Particle from "./Particle";
import Vec2D from "./Vec2D";
import particleFragmentShader from "./shaders/particleFragmentShader.frag";
import particleVertexShader from "./shaders/particleVertexShader.vert";

import { back_ctx, ctx, foreground_canvas, particles, gridSize, pointerPosition, fieldSize, clicked, drawOutline, gravity, fps, applyConstraint, applyAttractorForces, grid } from "./script";
import { createProgram, createShader, initParticleShader, resizeCanvasToDisplaySize } from "./ShaderHelper";
import { particle_outline } from "./MenuManager";


var canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;
var gl = canvas.getContext("webgl");

if (!gl) {
  console.error("Unable to initialize WebGL. Your browser may not support it.");
}

//enalbing blending for proper alpha on the particles
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

//compiling the shaders with a helper function
var vertexShader = createShader(gl, gl.VERTEX_SHADER, particleVertexShader);
var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, particleFragmentShader);

//creating a WebGL program and attaching the shaders to it with a helper function
var program = createProgram(gl, vertexShader, fragmentShader);

//looking up uniform location and where the vertex data needs to go
var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
var colorUniformLocation = gl.getUniformLocation(program, "u_color");
var translationLocation = gl.getUniformLocation(program, "u_translation");
var radiusUniformLocation = gl.getUniformLocation(program, "u_radius");
var outlineUniformLocation = gl.getUniformLocation(program, "u_outline_black");
gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

function setRectangle(gl: WebGLRenderingContext, x:number, y:number, width:number, height:number) {
  var x1 = x - width / 2;
  var x2 = x + width / 2;
  var y1 = y - height / 2;
  var y2 = y + height / 2;
 
  // NOTE: gl.bufferData(gl.ARRAY_BUFFER, ...) will affect
  // whatever buffer is bound to the `ARRAY_BUFFER` bind point
  // but so far we only have one buffer. If we had more than one
  // buffer we'd want to bind that buffer to `ARRAY_BUFFER` first.
 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
     x1, y1,
     x2, y1,
     x1, y2,
     x1, y2,
     x2, y1,
     x2, y2]), gl.STATIC_DRAW);
}

export function setGeometry(){
  particles.forEach((particle) => {
    setRectangle(
      gl, 0, 0, gridSize, gridSize);
  });

}
export function drawParticles() {
  resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0); // Clear to transparent black
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Tell it to use program (pair of shaders)
  gl.useProgram(program);

  gl.enableVertexAttribArray(positionAttributeLocation);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  // Draw the rectangle.
  particles.forEach((particle) => {
      gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
      gl.uniform2f(translationLocation, particle.pos_curr.x, particle.pos_curr.y);
      gl.uniform3f(colorUniformLocation, particle.color.r,particle.color.g, particle.color.b);
      gl.uniform1f(radiusUniformLocation, gridSize/2)
      gl.uniform1f(outlineUniformLocation, particle_outline);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
  });

}

export function drawGrid() {

  back_ctx.clearRect(0, 0, foreground_canvas.width, foreground_canvas.height);

  back_ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--grid-color');
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
  //DEBUG
  //   for (let x = 0; x < grid.length; x += 1) {

  //   for (let y = 0; y < grid[0].length; y += 1) {
  //     back_ctx.font = "12px serif";

  //     back_ctx.fillText(`${grid[x][y].length}`, (x+1)*gridSize - gridSize/2 - 2, (y+1)*gridSize -gridSize/2 + 4);
  //     // back_ctx.fillText(`${x} ${y}`, (x+1)*gridSize - gridSize/2 - 2, (y+1)*gridSize -gridSize/2 + 4);
  //   }
  // }
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

function drawPredictedPath(startPos: Vec2D, vec: Vec2D) {
  let dotCount = 510;
  let predictedDot = new Particle(startPos, 15, vec, {r:0, g:0, b:0})
  for (let i = 1; i <= dotCount; i++) {

    predictedDot.accelerate(gravity);
    applyConstraint(predictedDot);
    applyAttractorForces(predictedDot);
    predictedDot.updatePosition(0.5 * 0.25);

    if (i % 15 == 0) {
      drawDot(predictedDot.pos_curr.x, predictedDot.pos_curr.y, 5, 255 - i / 2)
    }

  }

}

export function drawDot(dotX: number, dotY: number, dotSize: number, opacity: number) {
  ctx.beginPath();
  ctx.arc(
    dotX,
    dotY,
    dotSize,
    0,
    2 * Math.PI,
    false
  );

  ctx.fillStyle = `rgba(210, 210, 210, ${opacity / 255})`;
  ctx.fill();

  ctx.closePath();
}

export function drawLasso() {
  if (clicked) {
    const lineWidth = 3;
    ctx.beginPath();
    ctx.arc(pointerPosition.x, pointerPosition.y, fieldSize, 0, 2 * Math.PI);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--grid-color');
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