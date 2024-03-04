import Vec2D from "./Vec2D"

export default class Particle {
  static canvas = document.getElementById('foreground-canvas') as HTMLCanvasElement;
  static gl = Particle.canvas!.getContext("2d");
  public currentPosition: Vec2D;
  public previousPosition: Vec2D;
  public acceleration: Vec2D;
  public radius: number;
  public color: { r: number, g: number, b: number };

  constructor(pos: Vec2D, radius: number, acc: Vec2D, color: { r: number, g: number, b: number }) {
    this.currentPosition = pos;
    this.previousPosition = this.currentPosition;
    this.radius = radius;
    this.acceleration = acc;
    this.color = color;
  }

  updatePosition(dt: number) {
    let velocity: Vec2D = new Vec2D(this.currentPosition.x - this.previousPosition.x, this.currentPosition.y - this.previousPosition.y);
    this.previousPosition = this.currentPosition.clone();

    this.currentPosition.add(velocity);
    this.acceleration.multiply(dt * dt);
    this.currentPosition.add(this.acceleration);

    this.acceleration.x = 0;
    this.acceleration.y = 0;
  }

  accelerate(acc: Vec2D) {
    this.acceleration.add(acc);
  }
}