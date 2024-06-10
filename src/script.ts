import Attractor from "./Attractor";
import { drawArrow, drawLasso, drawParticles, drawDottedLine, setGeometry, drawCursorFunction } from "./Renderer";
import { closeMenu, updatePointerFunction } from "./MenuManager";
import Particle from "./Particle";
import Vec2D from "./Vec2D";
import { fps, getAverageFrameTime, updateUI } from "./UIManager";
import { backgroundCanvas, clearCanvas, foregroundCanvas } from "./CanvasManager";
import { tick } from "./PhysicsEngine";
import * as Config from './Config';
import { Grid } from "./Grid";
import { getRandomColor } from "./Utils";

export var particles: Particle[] = [];
export var attractors: Attractor[] = [];

let frameCount = 0;
export let grid = new Grid(backgroundCanvas);
function animate() {
  let frameTime = getAverageFrameTime()
  tick(frameTime/20);

  clearCanvas();
  drawParticles();
  drawCursorFunction();
  // drawGrid();
  // drawAttractors();
  updateUI();

  if (frameCount % 3 === 0 && particles.length < Config.getParticleNumber() && frameCount > 120) {
    particles.push(new Particle(new Vec2D(200, 200), grid.pixelSize/2, new Vec2D(27 , -12), getRandomColor(), grid));
    particles.push(new Particle(new Vec2D(200, 260), grid.pixelSize/2, new Vec2D(29 , -12), getRandomColor(), grid));
    particles.push(new Particle(new Vec2D(200, 320), grid.pixelSize/2, new Vec2D(24 , -12), getRandomColor(), grid));
    particles.push(new Particle(new Vec2D(200, 380), grid.pixelSize/2, new Vec2D(25 , -12), getRandomColor(), grid));
    particles.push(new Particle(new Vec2D(200, 440), grid.pixelSize/2, new Vec2D(24, -12 ), getRandomColor(), grid));
    setGeometry();
  }
  frameCount++;
  requestAnimationFrame(animate);
}

grid.draw();
requestAnimationFrame(animate);