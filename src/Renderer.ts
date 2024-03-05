import Vec2D from "./Vec2D";
import * as Config from './Config';
import particleFragmentShader from "./shaders/particleFragmentShader.frag";
import particleVertexShader from "./shaders/particleVertexShader.vert";
import { createProgram, createShader, resizeCanvasToDisplaySize } from "./ShaderHelper";
import Attractor from "./Attractor";
import { backgroundCanvasCtx, foregroundCanvas, foregroundCanvasCtx } from "./CanvasManager";
import { applyAttractorForces, applyConstraint } from "./PhysicsEngine";
import { InputHandler } from "./InputHandler";
import { grid, particles } from "./script";
import Particle from "./Particle";


var webglCanvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;
var gl = webglCanvas.getContext("webgl");
webglCanvas!.width = webglCanvas.getBoundingClientRect().width;
webglCanvas!.height = webglCanvas.getBoundingClientRect().height;

const inputHandler = InputHandler.getInstance();

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
var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

function setRectangle(gl: WebGLRenderingContext, x:number, y:number, width:number, height:number) {
  var x1 = x - width / 2;
  var x2 = x + width / 2;
  var y1 = y - height / 2;
  var y2 = y + height / 2;
 
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
      gl, 0, 0, Config.getGridSize(), Config.getGridSize());
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
  var outlineColor = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--is-outline-dark'));
  var resolution = [gl.canvas.width, gl.canvas.height]
  // Draw the rectangle.
  particles.forEach((particle) => {
      gl.uniform2fv(resolutionUniformLocation, resolution);
      gl.uniform2f(translationLocation, particle.currentPosition.x, particle.currentPosition.y);
      gl.uniform3f(colorUniformLocation, particle.color.r,particle.color.g, particle.color.b);
      gl.uniform1f(radiusUniformLocation, particle.radius)
      gl.uniform1f(outlineUniformLocation, outlineColor);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
  });

}

function drawAttractors(attractors: Attractor[]) {
  attractors.forEach((attractor) => {
    attractor.animate();
  });
}


export function drawDottedLine(from: Vec2D, to: Vec2D, radius: number = 5, dotCount: number = 8) {
  if (inputHandler.clicked && from.x != to.x && from.y != to.y) {
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
      drawDot(dotX, dotY, radius, 255);
    }

  }
}

export function drawPredictedPath(startPos: Vec2D, AccelerationVector: Vec2D) {
  let dotCount = 255;
  let predictedDot = new Particle(startPos, Config.getGridSize()/2, AccelerationVector, {r:0, g:0, b:0},grid)
  for (let i = 1; i <= dotCount; i++) {

    predictedDot.accelerate(Config.getGravityDirection());
    applyConstraint(predictedDot);
    applyAttractorForces(predictedDot);
    predictedDot.updatePosition(0.8 * 0.25);
    if (i % 6 == 0) {
      drawDot(predictedDot.currentPosition.x, predictedDot.currentPosition.y, 5, 255 - i)
    }

  }

}

export function drawDot(dotX: number, dotY: number, dotSize: number, opacity: number) {
  foregroundCanvasCtx.beginPath();
  foregroundCanvasCtx.arc(
    dotX,
    dotY,
    dotSize,
    0,
    2 * Math.PI,
    false
  );

  foregroundCanvasCtx.fillStyle = `rgba(210, 210, 210, ${opacity / 255})`;
  foregroundCanvasCtx.fill();

  foregroundCanvasCtx.closePath();
}

export function drawLasso(lineWidth: number = 3) {
  if (inputHandler.clicked) {
    foregroundCanvasCtx.beginPath();
    foregroundCanvasCtx.arc(inputHandler.pointerPosition.x, inputHandler.pointerPosition.y, Config.getFieldSize(), 0, 2 * Math.PI);
    foregroundCanvasCtx.lineWidth = lineWidth;
    foregroundCanvasCtx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--grid-color');
    foregroundCanvasCtx.stroke();
    foregroundCanvasCtx.closePath();
  }
}

export function drawArrow(from: Vec2D, to: Vec2D) {
  if (inputHandler.clicked && from.x != to.x && from.y != to.y) {
    var angle = Math.atan2(to.y - from.y, to.x - from.x);
    const width = 10;
    var headlen = 10;
    var new_to = new Vec2D(to.x, to.y);
    // This makes it so the end of the arrow head is located at tox, toy, don't ask where 1.15 comes from
    new_to.x -= Math.cos(angle) * ((width * 1.15));
    new_to.y -= Math.sin(angle) * ((width * 1.15));



    //starting path of the arrow from the start square to the end square and drawing the stroke
    foregroundCanvasCtx.beginPath();
    foregroundCanvasCtx.moveTo(from.x, from.y);
    foregroundCanvasCtx.lineTo(new_to.x, new_to.y);
    foregroundCanvasCtx.strokeStyle = "#bbbbbb";
    foregroundCanvasCtx.lineWidth = width;
    foregroundCanvasCtx.stroke();

    //starting a new path from the head of the arrow to one of the sides of the point
    foregroundCanvasCtx.beginPath();
    foregroundCanvasCtx.moveTo(new_to.x, new_to.y);
    foregroundCanvasCtx.lineTo(new_to.x - headlen * Math.cos(angle - Math.PI / 7), new_to.y - headlen * Math.sin(angle - Math.PI / 7));

    //path from the side point of the arrow, to the other side point
    foregroundCanvasCtx.lineTo(new_to.x - headlen * Math.cos(angle + Math.PI / 7), new_to.y - headlen * Math.sin(angle + Math.PI / 7));

    //path from the side point back to the tip of the arrow, and then again to the opposite side point
    foregroundCanvasCtx.lineTo(new_to.x, new_to.y);
    foregroundCanvasCtx.lineTo(new_to.x - headlen * Math.cos(angle - Math.PI / 7), new_to.y - headlen * Math.sin(angle - Math.PI / 7));

    //draws the paths created above
    foregroundCanvasCtx.strokeStyle = "#bbbbbb";
    foregroundCanvasCtx.lineWidth = width;
    foregroundCanvasCtx.stroke();
    foregroundCanvasCtx.fillStyle = "#bbbbbb";
    foregroundCanvasCtx.fill();
    foregroundCanvasCtx.closePath();
  }
}

export function drawCursorFunction() {
  if (inputHandler.clicked) {
switch (Config.getPointerFunction()) {
  case 'field':
    drawLasso();
    break;
  case 'gravity':
    drawArrow(inputHandler.clickStartPosition, inputHandler.pointerPosition)
    break;
  case 'throw':
    drawDottedLine(inputHandler.clickStartPosition, inputHandler.pointerPosition)
    break;
}
  }
}