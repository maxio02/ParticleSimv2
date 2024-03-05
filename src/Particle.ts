import { Grid } from "./Grid";
import Vec2D from "./Vec2D"

export default class Particle {
  static canvas = document.getElementById('foreground-canvas') as HTMLCanvasElement;

  public currentPosition: Vec2D;
  public previousPosition: Vec2D;
  public acceleration: Vec2D;
  public radius: number;
  public color: { r: number, g: number, b: number };
  private grid: Grid;
  private cell: Vec2D;

  constructor(pos: Vec2D, radius: number, acc: Vec2D, color: { r: number, g: number, b: number }, grid: Grid) {
    this.currentPosition = pos;
    this.previousPosition = this.currentPosition;
    this.radius = radius;
    this.acceleration = acc;
    this.color = color;
    this.grid = grid;
    this.cell = new Vec2D(Math.floor(this.currentPosition.x / grid.pixelSize), Math.floor(this.currentPosition.y / grid.pixelSize));
  }

  updatePosition(dt: number) {
    let velocity: Vec2D = new Vec2D(this.currentPosition.x - this.previousPosition.x, this.currentPosition.y - this.previousPosition.y);
    this.previousPosition = this.currentPosition.clone();

    this.currentPosition.add(velocity);
    this.acceleration.multiply(dt * dt);
    this.currentPosition.add(this.acceleration);

    this.acceleration.x = 0;
    this.acceleration.y = 0;
    this.updateCell();
  }

  accelerate(acc: Vec2D) {
    this.acceleration.add(acc);
  }


  getNeighboringParticles(): Particle[] {
    const neighboringParticles: Particle[] = [];
  
    for (let i = this.cell.x - 1; i <= this.cell.x + 1; i++) {
      for (let j = this.cell.y - 1; j <= this.cell.y + 1; j++) {
        if (i >= 0 && i < this.grid.columns && j >= 0 && j < this.grid.rows) {
          neighboringParticles.push(...this.grid.cells[i][j]);
        }
      }
    }
    return neighboringParticles;
  }
  
  updateCell(){
    this.cell = new Vec2D(Math.floor(this.currentPosition.x / this.grid.pixelSize), Math.floor(this.currentPosition.y / this.grid.pixelSize));
  }



}