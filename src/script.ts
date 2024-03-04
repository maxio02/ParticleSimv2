import Attractor from "./Attractor";
import { drawArrow, drawGrid, drawLasso, drawParticles, drawTail, setGeometry } from "./Drawer";
import { closeMenu, getPointerFunction } from "./MenuManager";
import Particle from "./Particle";
import Vec2D from "./Vec2D";
export const gridSize = 30;
export const grid: Particle[][][] = [];

export const particles: Particle[] = [];
var attractors: Attractor[] = [];
var particleCount = 500;
var numberOfCollisions = 0;
export const pointerPosition = new Vec2D(0, 0)
var clickStartPosition = new Vec2D(0, 0)
var pointerFunction = 'field'
export var gravity = new Vec2D(0, 1)
export const foregroundCanvas = document.getElementById('foreground-canvas') as HTMLCanvasElement;
const backgroundCanvas = document.getElementById('background-canvas') as HTMLCanvasElement;
const webglCanvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;

export var fieldSize = 100
export var drawOutline = true
var fieldStrength = 10
var physicsSubstepsAmount = 4
var gridColumns = Math.ceil(foregroundCanvas.width / gridSize);
var gridRows = Math.ceil(foregroundCanvas.height / gridSize);
foregroundCanvas!.width = foregroundCanvas.getBoundingClientRect().width;
foregroundCanvas!.height = foregroundCanvas.getBoundingClientRect().height;
backgroundCanvas!.width = backgroundCanvas.getBoundingClientRect().width;
backgroundCanvas!.height = backgroundCanvas.getBoundingClientRect().height;
webglCanvas!.width = webglCanvas.getBoundingClientRect().width;
webglCanvas!.height = webglCanvas.getBoundingClientRect().height;
export const foregroundCanvasCtx = foregroundCanvas.getContext('2d');
// export const ctx = Particle.canvas!.getContext('2d');
export const backgroundCanvasCtx = backgroundCanvas.getContext('2d');
export var fps = 60;
export let clicked = false
let fpsCounter = document.createElement('div');
fpsCounter.style.position = 'absolute';
fpsCounter.style.top = '10px';
fpsCounter.style.left = '10px';

let particleCounter = document.createElement('div');
particleCounter.style.position = 'absolute';
particleCounter.style.top = '30px';
particleCounter.style.left = '10px';

let collisionCounter = document.createElement('div');
collisionCounter.style.position = 'absolute';
collisionCounter.style.top = '50px';
collisionCounter.style.left = '10px';


document.body.appendChild(fpsCounter);
document.body.appendChild(particleCounter);
document.body.appendChild(collisionCounter);

export function setFieldStrength(value: number) {
  fieldStrength = value;
}

export function setFieldSize(value: number) {
  fieldSize = value;
}

export function setGravityStrength(value: number) {
  gravity = new Vec2D(0, value * 0.1);
}

export function setSubsteps(value: number) {
  physicsSubstepsAmount = value;
}

export function setParticlesNum(value: number) {
  particleCount = value;
}

export function setDrawOutline(value: boolean) {
  drawOutline = value;
}

function initializeGrid() {
  gridColumns = Math.ceil(foregroundCanvas.width / gridSize);
  gridRows = Math.ceil(foregroundCanvas.height / gridSize);
  console.log(gridColumns);
  console.log(gridRows);
  for (let i = 0; i < gridColumns; i++) {
    grid[i] = [];
    for (let j = 0; j < gridRows; j++) {
      grid[i][j] = [];
    }
  }
}

function removeFromGrid() {
  for (let i = 0; i < gridColumns; i++) {
    grid[i] = [];
    for (let j = 0; j < gridRows; j++) {
      grid[i][j] = [];
    }
  }
}

function addToGrid(particle: Particle) {
  const column = Math.floor(particle.currentPosition.x / gridSize);
  const row = Math.floor(particle.currentPosition.y / gridSize);

  if (column >= 0 && column < grid.length && row >= 0 && row < grid[column].length) {
    grid[column][row].push(particle);
  }
}

function getNeighboringParticles(particle: Particle): Particle[] {
  const column = Math.floor(particle.currentPosition.x / gridSize);
  const row = Math.floor(particle.currentPosition.y / gridSize);
  const neighboringParticles: Particle[] = [];

  for (let i = column - 1; i <= column + 1; i++) {
    for (let j = row - 1; j <= row + 1; j++) {
      if (i >= 0 && i < grid.length && j >= 0 && j < grid[i].length) {
        neighboringParticles.push(...grid[i][j]);
      }
    }
  }
  return neighboringParticles;
}

function tick(dt: number) {
  var sub_dt = dt / physicsSubstepsAmount;

  for (var i = 0; i < physicsSubstepsAmount; i++) {
    if (gravity.y != 0) {
      applyGravity();
    }
    if (clicked) {
      switch (pointerFunction) {
        case 'field':
          applyField(pointerPosition);
          break;
        case 'gravity':
          gravity = pointerPosition.difference(clickStartPosition)
          gravity.divide(200)
        case 'throw':
          break;

      }

    }
    // applyAttractorForcesToAll();
    applyConstraintToAllEdges();
    solveCollisions();
    updatePositions(sub_dt);
  }
}


function applyConstraintToAllEdges() {

  particles.forEach((particle) => {
    applyConstraint(particle);
  });
  // for (var col = 0; col < grid.length; col++) {
  //   for (var thickness = 0; thickness < 2; thickness++) {
  //     grid[col][thickness].forEach((particle) => {
  //       applyConstraint(particle);
  //     });

  //     grid[col][grid[0].length - thickness - 1].forEach((particle) => {
  //       applyConstraint(particle);
  //     });
  //   }
  // }

  // for (var row = 0; row < grid[0].length; row++) {
  //   for (var thickness = 0; thickness < 2; thickness++) {
  //     grid[thickness][row].forEach((particle) => {
  //       applyConstraint(particle);
  //     });

  //     grid[grid.length - thickness - 1][row].forEach((particle) => {
  //       applyConstraint(particle);
  //     });
  //   }
  // }
}

function updatePositions(dt: number) {
  removeFromGrid();
  particles.forEach((particle) => {

    particle.updatePosition(dt);
    addToGrid(particle);
  });
}

function applyGravity() {
  particles.forEach((particle) => {
    particle.accelerate(gravity);
  });
}

function applyField(fieldPos: Vec2D) {
  particles.forEach((particle) => {
    const pullDirection = fieldPos.difference(particle.currentPosition)
    const distance = pullDirection.length();

    if (distance < fieldSize && distance > 10) {
      pullDirection.multiply(fieldStrength * 100);
      pullDirection.divide(distance * distance)
      particle.accelerate(pullDirection);
    }
  });
}

function applyAttractorForcesToAll() {
  particles.forEach((particle) => {
    applyAttractorForces(particle)
  });
}

export function applyAttractorForces(particle: Particle) {
  attractors.forEach((attractor) => {
    const pullDirection = attractor.position.difference(particle.currentPosition)
    const distance = pullDirection.length();

    if (distance < attractor.radius && distance > 10) {
      pullDirection.multiply(attractor.force);
      pullDirection.divide(distance * distance)
      particle.accelerate(pullDirection);
    }
  });
}

function solveCollisions() {
  numberOfCollisions = 0;


  let tempCollisionDirection = new Vec2D(0, 0);
  let squaredDistance = 0;
  let radiiSum = 0;
  let squaredRadiiSum = 0;

  particles.forEach((particle1) => {
    const neighboringParticles = getNeighboringParticles(particle1);

    neighboringParticles.forEach((particle2) => {
      if (particle1 === particle2) return;

      tempCollisionDirection.set(particle1.currentPosition).subtract(particle2.currentPosition);
      squaredDistance = tempCollisionDirection.squaredLength();

      radiiSum = particle1.radius + particle2.radius;
      squaredRadiiSum = radiiSum * radiiSum;

      if (squaredDistance < squaredRadiiSum && squaredDistance != 0) {
        numberOfCollisions++;
          let distance = Math.sqrt(squaredDistance);
          tempCollisionDirection.divide(distance);
      
          let delta = radiiSum - distance;
          tempCollisionDirection.multiply(delta * 0.5);
      
          particle1.currentPosition.add(tempCollisionDirection);
          particle2.currentPosition.subtract(tempCollisionDirection);
      }
    });
  });
}

export function applyConstraint(particle: Particle) {
  // Apply floor constraint
  if (particle.currentPosition.y + particle.radius > foregroundCanvas.height) {
    particle.currentPosition.y = foregroundCanvas.height - particle.radius;
    particle.previousPosition.y = particle.currentPosition.y + particle.currentPosition.y - particle.previousPosition.y;
  }

  // Apply Ceiling constraint
  if (particle.currentPosition.y - particle.radius < 0) {
    particle.currentPosition.y = particle.radius;
    particle.previousPosition.y = particle.currentPosition.y + particle.currentPosition.y - particle.previousPosition.y;
  }


  // Apply left wall constraint
  if (particle.currentPosition.x - particle.radius < 0) {
    particle.currentPosition.x = particle.radius;
    particle.previousPosition.x = particle.currentPosition.x + particle.currentPosition.x - particle.previousPosition.x;
  }

  // Apply right wall constraint
  if (particle.currentPosition.x + particle.radius > foregroundCanvas.width) {
    particle.currentPosition.x = foregroundCanvas.width - particle.radius;

  }
}

function clearCanvas() {
  foregroundCanvasCtx.clearRect(0, 0, foregroundCanvas.width, foregroundCanvas.height);
  // back_ctx.clearRect(0, 0, foreground_canvas.width, foreground_canvas.height);
}

function updateCanvasSize() {
  foregroundCanvas.width = foregroundCanvas.getBoundingClientRect().width;
  foregroundCanvas.height = foregroundCanvas.getBoundingClientRect().height;
  backgroundCanvas.width = backgroundCanvas.getBoundingClientRect().width;
  backgroundCanvas.height = backgroundCanvas.getBoundingClientRect().height;
  webglCanvas.width = webglCanvas.getBoundingClientRect().width;
  webglCanvas.height = webglCanvas.getBoundingClientRect().height;
  initializeGrid();
  drawGrid();
}

let frameCount = 0;
let lastTime = performance.now() * 0.1;

function calculateFPS() {
  const currentTime = performance.now() * 0.1;
  const timeDiff = currentTime - lastTime;
  const fps = Math.round(1000 / timeDiff);
  lastTime = currentTime;
  return fps;
}

function handleMouseDown(event: MouseEvent | TouchEvent) {
  event.stopPropagation()
  clicked = true;
  pointerFunction = getPointerFunction()

  if (event instanceof MouseEvent) {
    pointerPosition.x = event.clientX;
    pointerPosition.y = event.clientY;

  }
  else if (event instanceof TouchEvent) {
    pointerPosition.x = event.touches[0].clientX;
    pointerPosition.y = event.touches[0].clientY;
  }

  clickStartPosition.x = pointerPosition.x;
  clickStartPosition.y = pointerPosition.y;

}

function handleMouseUp(event: MouseEvent | TouchEvent) {
  event.stopPropagation()
  clicked = false;

  switch (pointerFunction) {
    case 'field':
      break;
    case 'gravity':
      break;
    case 'throw':
      let launch_dir = clickStartPosition.difference(pointerPosition)
      launch_dir.multiply(fps / 60)
      particles.push(new Particle(clickStartPosition.clone(), 15, launch_dir, getRandomColor()));
      break;

  }
}

function getRandomColor(): { r: number, g: number, b: number } {
  return {
    r: Math.random(),
    g: Math.random(),
    b: Math.random()
  }
}

function handleMoveEvent(event: MouseEvent | TouchEvent) {
  event.stopPropagation()
  if (clicked) {
    if (event instanceof MouseEvent) {
      pointerPosition.x = event.clientX;
      pointerPosition.y = event.clientY;
    }
    else if (event instanceof TouchEvent) {
      pointerPosition.x = event.touches[0].clientX;
      pointerPosition.y = event.touches[0].clientY;
    }
  }
}

function drawAttractors() {
  attractors.forEach((attractor) => {
    attractor.animate();
  });
}


function animate() {
  tick(0.5 / fps * 60);
  clearCanvas();
  drawParticles();
  // drawGrid();
  // drawAttractors();
  switch (pointerFunction) {
    case 'field':
      drawLasso();
      break;
    case 'gravity':
      drawArrow(clickStartPosition, pointerPosition)
      break;
    case 'throw':
      drawTail(clickStartPosition, pointerPosition)
      break;

  }

  const mult = fps * 0.016666;
  if (i % Math.floor(2 * mult) == 0 && particles.length < particleCount && i > 120) {
    particles.push(new Particle(new Vec2D(200, 200), gridSize/2, new Vec2D(200 * mult, -80 * mult), getRandomColor()));
    particles.push(new Particle(new Vec2D(200, 260), gridSize/2, new Vec2D(180 * mult, -80 * mult), getRandomColor()));
    particles.push(new Particle(new Vec2D(200, 320), gridSize/2, new Vec2D(170 * mult, -80 * mult), getRandomColor()));
    particles.push(new Particle(new Vec2D(200, 380), gridSize/2, new Vec2D(180 * mult, -80 * mult), getRandomColor()));
    particles.push(new Particle(new Vec2D(200, 440), gridSize/2, new Vec2D(170 * mult, -80 * mult), getRandomColor()));
    setGeometry();
  }

  i++;


  frameCount++;
  if (frameCount % 10 === 0) {
    fps = calculateFPS();
    fpsCounter.innerText = `FPS: ${fps}`;
    particleCounter.innerText = `Particles: ${particles.length}`;
    collisionCounter.innerText = `Collisions: ${numberOfCollisions}`;
  }
  requestAnimationFrame(animate);
}

let i = 0;
const main_body = document.getElementById('main_container');
window.addEventListener("resize", updateCanvasSize);
main_body.addEventListener("mousedown", handleMouseDown);
main_body.addEventListener("mouseup", handleMouseUp);
main_body.addEventListener("mousemove", handleMoveEvent);
main_body.addEventListener("touchstart", handleMouseDown);
main_body.addEventListener("touchend", handleMouseUp);
main_body.addEventListener("touchmove", handleMoveEvent);
main_body.addEventListener("click", function (event) {
  event.stopPropagation();
  closeMenu();
});
initializeGrid();
drawGrid();

// const mult = fps * 0.016666;
// particles.push(new Particle(new Vec2D(200, 200), 15, new Vec2D(100 * mult, -150 * mult), getRandomColor()));

// attractors.push(new Attractor(new Vec2D(300, 300), 200, 400, true, 'black'))
// attractors.push(new Attractor(new Vec2D(900, 300), 280, 400, true, 'pink'))
requestAnimationFrame(animate);