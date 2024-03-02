import Attractor from "./Attractor";
import { drawArrow, drawGrid, drawLasso, drawParticles, drawTail } from "./Drawer";
import { closeMenu, getPointerFunction } from "./MenuManager";
import Particle from "./Particle";
import Vec2D from "./Vec2D";
export const gridSize = 30;
export const grid: Particle[][][] = [];

export const particles: Particle[] = [];
var attractors: Attractor[] = [];
var particleCount = 100;
export const pointerPosition = new Vec2D(0, 0)
var click_start_position = new Vec2D(0, 0)
var pointer_function = 'field'
export var gravity = new Vec2D(0, 1)
export const foreground_canvas = document.getElementById('foreground-canvas') as HTMLCanvasElement;
const background_canvas = document.getElementById('background-canvas') as HTMLCanvasElement;
export var fieldSize = 100
export var drawOutline = true
var fieldStrength = 10
var substeps_amount = 4
foreground_canvas!.width = foreground_canvas.getBoundingClientRect().width;
foreground_canvas!.height = foreground_canvas.getBoundingClientRect().height;
background_canvas!.width = background_canvas.getBoundingClientRect().width;
background_canvas!.height = background_canvas.getBoundingClientRect().height;
export const ctx = Particle.canvas!.getContext('2d');
export const back_ctx = background_canvas.getContext('2d');
export var fps = 60;
export let clicked = false
let fpsCounter = document.createElement('div');
fpsCounter.style.position = 'absolute';
fpsCounter.style.top = '10px';
fpsCounter.style.left = '10px';
fpsCounter.style.color = 'black';

let particleCounter = document.createElement('div');
particleCounter.style.position = 'absolute';
particleCounter.style.top = '30px';
particleCounter.style.left = '10px';
particleCounter.style.color = 'black';

document.body.appendChild(fpsCounter);
document.body.appendChild(particleCounter);

export function setFieldStrength(value: number) {
  fieldStrength = value;
}

export function setFieldSize(value: number) {
  fieldSize = value;
}

export function setGravityStrength(value: number) {
  gravity = new Vec2D(0, value / 10);
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
  const columns = Math.ceil(foreground_canvas.width / gridSize);
  const rows = Math.ceil(foreground_canvas.height / gridSize);

  for (let i = 0; i < columns; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = [];
    }
  }
}

function removeFromGrid(particle: Particle) {
  const column = Math.floor(particle.pos_curr.x / gridSize);
  const row = Math.floor(particle.pos_curr.y / gridSize);

  if (column >= 0 && column < grid.length && row >= 0 && row < grid[column].length) {
    const particlesInCell = grid[column][row];
    const index = particlesInCell.indexOf(particle);
    if (index !== -1) {
      particlesInCell.splice(index, 1);
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
    applyAttractorForcesToAll();
    applyConstraintToAll();
    solveCollisions();
    updatePositions(sub_dt);
  }
}


function applyConstraintToAll() {
  particles.forEach((particle) => {
    applyConstraint(particle);
  });
}

function updatePositions(dt: number) {
  particles.forEach((particle) => {
    removeFromGrid(particle);
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

export function applyAttractorForces(particle: Particle){
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
  particles.forEach((particle1) => {
    const neighboringParticles = getNeighboringParticles(particle1);

    neighboringParticles.forEach((particle2) => {
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
}

function updateCanvasSize() {
  foreground_canvas.width = foreground_canvas.getBoundingClientRect().width;
  foreground_canvas.height = foreground_canvas.getBoundingClientRect().height;
  background_canvas.width = background_canvas.getBoundingClientRect().width;
  background_canvas.height = background_canvas.getBoundingClientRect().height;
  initializeGrid();
  drawGrid();
}

let frameCount = 0;
let lastTime = performance.now() / 10;

function calculateFPS() {
  const currentTime = performance.now() / 10;
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

function getRandomColor(): string {
  let red = Math.floor(Math.random() * 256);
  let green = Math.floor(Math.random() * 256);
  let blue = Math.floor(Math.random() * 256);
  return `rgb(${red}, ${green}, ${blue})`;
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
  drawAttractors();
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

  const mult = fps / 60
  if (i % Math.floor(8 * mult) == 0 && particles.length < particleCount) {
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
// attractors.push(new Attractor(new Vec2D(300, 300), 200, 400, true, 'black'))
// attractors.push(new Attractor(new Vec2D(900, 300), 280, 400, true, 'pink'))
requestAnimationFrame(animate);