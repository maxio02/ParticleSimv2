import Attractor from "./Attractor";
import { drawArrow, drawGrid, drawLasso, drawParticles, drawTail } from "./Drawer";
import { closeMenu, getPointerFunction } from "./MenuManager";
import Particle from "./Particle";
import { initParticleShader } from "./ShaderHelper";
import Vec2D from "./Vec2D";
export const gridSize = 31;
export const grid: Particle[][][] = [];

export const particles: Particle[] = [];
var attractors: Attractor[] = [];
var particleCount = 100;
var number_of_collisions = 0;
export const pointerPosition = new Vec2D(0, 0)
var click_start_position = new Vec2D(0, 0)
var pointer_function = 'field'
export var gravity = new Vec2D(0, 1)
export const foreground_canvas = document.getElementById('foreground-canvas') as HTMLCanvasElement;
const background_canvas = document.getElementById('background-canvas') as HTMLCanvasElement;
const webgl_canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;

export var fieldSize = 1
export var drawOutline = true
var fieldStrength = 10
var substeps_amount = 4
var gridColumns = Math.ceil(foreground_canvas.width / gridSize);
var gridRows = Math.ceil(foreground_canvas.height / gridSize);
foreground_canvas!.width = foreground_canvas.getBoundingClientRect().width;
foreground_canvas!.height = foreground_canvas.getBoundingClientRect().height;
background_canvas!.width = background_canvas.getBoundingClientRect().width;
background_canvas!.height = background_canvas.getBoundingClientRect().height;
webgl_canvas!.width = webgl_canvas.getBoundingClientRect().width;
webgl_canvas!.height = webgl_canvas.getBoundingClientRect().height;
export const ctx = foreground_canvas.getContext('2d');
// export const ctx = Particle.canvas!.getContext('2d');
export const back_ctx = background_canvas.getContext('2d');
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
  substeps_amount = value;
}

export function setParticlesNum(value: number) {
  particleCount = value;
}

export function setDrawOutline(value: boolean) {
  drawOutline = value;
}

function initializeGrid() {
  gridColumns = Math.ceil(foreground_canvas.width / gridSize);
  gridRows = Math.ceil(foreground_canvas.height / gridSize);
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
  const column = Math.floor(particle.pos_curr.x / gridSize);
  const row = Math.floor(particle.pos_curr.y / gridSize);

  if (column >= 0 && column < grid.length && row >= 0 && row < grid[column].length) {
    grid[column][row].push(particle);
  }
}

function getNeighboringParticles(particle: Particle): Particle[] {
  const column = Math.floor(particle.pos_curr.x / gridSize);
  const row = Math.floor(particle.pos_curr.y / gridSize);
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
  var sub_steps = substeps_amount;
  var sub_dt = dt / sub_steps;

  for (var i = 0; i < sub_steps; i++) {
    if (gravity.y != 0) {
      applyGravity();
    }
    if (clicked) {
      switch (pointer_function) {
        case 'field':
          applyField(pointerPosition);
          break;
        case 'gravity':
          gravity = pointerPosition.difference(click_start_position)
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

  for (var col = 0; col < grid.length; col++) {
    for (var thickness = 0; thickness < 2; thickness++) {
      grid[col][thickness].forEach((particle) => {
        applyConstraint(particle);
      });

      grid[col][grid[0].length - thickness - 1].forEach((particle) => {
        applyConstraint(particle);
      });
    }
  }

  for (var row = 0; row < grid[0].length; row++) {
    for (var thickness = 0; thickness < 2; thickness++) {
      grid[thickness][row].forEach((particle) => {
        applyConstraint(particle);
      });

      grid[grid.length - thickness - 1][row].forEach((particle) => {
        applyConstraint(particle);
      });
    }
  }
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
    const pullDirection = fieldPos.difference(particle.pos_curr)
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
    const pullDirection = attractor.pos.difference(particle.pos_curr)
    const distance = pullDirection.length();

    if (distance < attractor.radius && distance > 10) {
      pullDirection.multiply(attractor.force);
      pullDirection.divide(distance * distance)
      particle.accelerate(pullDirection);
    }
  });
}

function solveCollisions() {
  number_of_collisions = 0;
  particles.forEach((particle1) => {
    const neighboringParticles = getNeighboringParticles(particle1);

    neighboringParticles.forEach((particle2) => {
      number_of_collisions++;
      let collision_direction = particle1.pos_curr.difference(particle2.pos_curr)

      let distance = collision_direction.length();
      if (distance != 0) {
        if (distance < particle1.radius + particle2.radius) {
          collision_direction.divide(distance);
          let delta = particle1.radius + particle2.radius - distance;
          collision_direction.multiply(delta * 0.5)

          particle1.pos_curr.add(collision_direction);
          particle2.pos_curr.subtract(collision_direction);
        }
      }
    });
  });
}

export function applyConstraint(particle: Particle) {
  // Apply floor constraint
  if (particle.pos_curr.y + particle.radius > foreground_canvas.height) {
    particle.pos_curr.y = foreground_canvas.height - particle.radius;
    particle.pos_prev.y = particle.pos_curr.y + particle.pos_curr.y - particle.pos_prev.y;
  }

  // Apply Ceiling constraint
  if (particle.pos_curr.y - particle.radius < 0) {
    particle.pos_curr.y = particle.radius;
    particle.pos_prev.y = particle.pos_curr.y + particle.pos_curr.y - particle.pos_prev.y;
  }


  // Apply left wall constraint
  if (particle.pos_curr.x - particle.radius < 0) {
    particle.pos_curr.x = particle.radius;
    particle.pos_prev.x = particle.pos_curr.x + particle.pos_curr.x - particle.pos_prev.x;
  }

  // Apply right wall constraint
  if (particle.pos_curr.x + particle.radius > foreground_canvas.width) {
    particle.pos_curr.x = foreground_canvas.width - particle.radius;

  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, foreground_canvas.width, foreground_canvas.height);
  // back_ctx.clearRect(0, 0, foreground_canvas.width, foreground_canvas.height);
}

function updateCanvasSize() {
  foreground_canvas.width = foreground_canvas.getBoundingClientRect().width;
  foreground_canvas.height = foreground_canvas.getBoundingClientRect().height;
  background_canvas.width = background_canvas.getBoundingClientRect().width;
  background_canvas.height = background_canvas.getBoundingClientRect().height;
  webgl_canvas.width = webgl_canvas.getBoundingClientRect().width;
  webgl_canvas.height = webgl_canvas.getBoundingClientRect().height;
  initParticleShader();
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
  pointer_function = getPointerFunction()

  if (event instanceof MouseEvent) {
    pointerPosition.x = event.clientX;
    pointerPosition.y = event.clientY;

  }
  else if (event instanceof TouchEvent) {
    pointerPosition.x = event.touches[0].clientX;
    pointerPosition.y = event.touches[0].clientY;
  }

  click_start_position.x = pointerPosition.x;
  click_start_position.y = pointerPosition.y;

}

function handleMouseUp(event: MouseEvent | TouchEvent) {
  event.stopPropagation()
  clicked = false;

  switch (pointer_function) {
    case 'field':
      break;
    case 'gravity':
      break;
    case 'throw':
      let launch_dir = click_start_position.difference(pointerPosition)
      launch_dir.multiply(fps / 60)
      particles.push(new Particle(click_start_position.clone(), 15, launch_dir, getRandomColor()));
      break;

  }
}

function getRandomColor(): {r:number, g:number, b:number} {
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
  switch (pointer_function) {
    case 'field':
      drawLasso();
      break;
    case 'gravity':
      drawArrow(click_start_position, pointerPosition)
      break;
    case 'throw':
      drawTail(click_start_position, pointerPosition)
      break;

  }

  const mult = fps * 0.016666;
  if (i % Math.floor(2 * mult) == 0 && particles.length < particleCount) {
    particles.push(new Particle(new Vec2D(200, 200), 15, new Vec2D(100 * mult, -150 * mult), getRandomColor()));
    particles.push(new Particle(new Vec2D(200, 260), 15, new Vec2D(90 * mult, -150 * mult), getRandomColor()));
    particles.push(new Particle(new Vec2D(200, 320), 15, new Vec2D(85 * mult, -150 * mult), getRandomColor()));
    particles.push(new Particle(new Vec2D(200, 380), 15, new Vec2D(90 * mult, -150 * mult), getRandomColor()));
    particles.push(new Particle(new Vec2D(200, 440), 15, new Vec2D(85 * mult, -150 * mult), getRandomColor()));
  }

  i++;


  frameCount++;
  if (frameCount % 10 === 0) {
    fps = calculateFPS();
    fpsCounter.innerText = `FPS: ${fps}`;
    particleCounter.innerText = `Particles: ${particles.length}`;
    collisionCounter.innerText = `Collisions: ${number_of_collisions}`;
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
initParticleShader();
initializeGrid();
drawGrid();
// attractors.push(new Attractor(new Vec2D(300, 300), 200, 400, true, 'black'))
// attractors.push(new Attractor(new Vec2D(900, 300), 280, 400, true, 'pink'))
requestAnimationFrame(animate);