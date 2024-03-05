import Attractor from "./Attractor";
import { drawArrow, drawLasso, drawParticles, drawDottedLine, setGeometry } from "./Renderer";
import { closeMenu, updatePointerFunction } from "./MenuManager";
import Particle from "./Particle";
import Vec2D from "./Vec2D";
import { updateUI } from "./UIManager";
import { backgroundCanvas, clearCanvas, foregroundCanvas } from "./CanvasManager";
import { tick } from "./PhysicsEngine";
import * as Config from './Config';
import { Grid } from "./Grid";
import { getRandomColor } from "./Utils";

export var particles: Particle[] = [];
export var attractors: Attractor[] = [];


var fps = 60;

let frameCount = 0;
export let grid = new Grid(backgroundCanvas);


function animate() {
  tick(0.5 / fps * 60);
  clearCanvas();
  drawParticles();
  // drawGrid();
  // drawAttractors();
  updateUI();
  const mult = fps * 0.016666;
  if (frameCount % Math.floor(2 * mult) == 0 && particles.length < Config.getParticleNumber() && frameCount > 120) {
    particles.push(new Particle(new Vec2D(200, 200), grid.pixelSize/2, new Vec2D(200 * mult, -80 * mult), getRandomColor(), grid));
    particles.push(new Particle(new Vec2D(200, 260), grid.pixelSize/2, new Vec2D(180 * mult, -80 * mult), getRandomColor(), grid));
    particles.push(new Particle(new Vec2D(200, 320), grid.pixelSize/2, new Vec2D(170 * mult, -80 * mult), getRandomColor(), grid));
    particles.push(new Particle(new Vec2D(200, 380), grid.pixelSize/2, new Vec2D(180 * mult, -80 * mult), getRandomColor(), grid));
    particles.push(new Particle(new Vec2D(200, 440), grid.pixelSize/2, new Vec2D(170 * mult, -80 * mult), getRandomColor(), grid));
    setGeometry();
  }
  frameCount++;
  requestAnimationFrame(animate);
}

grid.draw();
requestAnimationFrame(animate);