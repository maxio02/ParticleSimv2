import { Grid } from "./Grid";
import Vec2D from "./Vec2D"

export default class Particle {
  static canvas = document.getElementById('foreground-canvas') as HTMLCanvasElement;

  public position: Vec2D;
  public acceleration: Vec2D;
  public velocity: Vec2D;
  public radius: number;
  public color: { r: number, g: number, b: number };
  private grid: Grid;
  private cell: Vec2D;

  constructor(pos: Vec2D, radius: number, velocity: Vec2D, color: { r: number, g: number, b: number }, grid: Grid) {
    this.position = pos;
    this.velocity = velocity;
    this.acceleration = new Vec2D(0,0);
    this.radius = radius;
    this.color = color;
    this.grid = grid;
    this.cell = new Vec2D(Math.floor(this.position.x / grid.pixelSize), Math.floor(this.position.y / grid.pixelSize));
  }

  updatePosition(dt: number) {
    // let velocity: Vec2D = new Vec2D(this.currentPosition.x - this.previousPosition.x, this.currentPosition.y - this.previousPosition.y);

    //let sq = this.velocity.squaredLength()
    // let drag = this.velocity.clone().multiply(-1 * sq * 0.0000005)
    // this.velocity.add(drag)


    let moveDelta = this.velocity.add(this.acceleration.multiply((dt))).clone()
    
    moveDelta.multiply(dt)

    


    this.position.add(moveDelta);

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
    this.cell = new Vec2D(Math.floor(this.position.x / this.grid.pixelSize), Math.floor(this.position.y / this.grid.pixelSize));
  }



}