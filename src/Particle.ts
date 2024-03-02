import Vec2D from "./Vec2D"
import { drawOutline } from "./script";
// back button
// Numbers in menu
// grid size adj
// ball randomness
export default class Particle {
    static canvas = document.getElementById('foreground-canvas') as HTMLCanvasElement;
    static ctx = Particle.canvas!.getContext('2d');
    pos_curr: Vec2D
    pos_prev: Vec2D
    acceleration: Vec2D
    radius: number
    color: string
    


    constructor(pos: Vec2D, radius: number, acc: Vec2D, color: string) {
      this.pos_curr = pos
      this.pos_prev = this.pos_curr
      this.radius = radius;
      this.acceleration = acc
      this.color = color
    }
  
    draw() {
      let xpos: number = this.pos_curr.x
      let ypos: number = this.pos_curr.y
      Particle.ctx.beginPath();
      Particle.ctx.arc(
        xpos,
        ypos,
        this.radius,
        0,
        2 * Math.PI,
        false
      );
      Particle.ctx.fillStyle = this.color;
      Particle.ctx.fill();

      if(drawOutline){
        Particle.ctx.lineWidth = 2;
        Particle.ctx.strokeStyle = "black";
        Particle.ctx.stroke();
      }

      Particle.ctx.closePath();
    }

    updatePosition(dt: number){
      let velocity: Vec2D = new Vec2D(this.pos_curr.x - this.pos_prev.x, this.pos_curr.y - this.pos_prev.y);
      this.pos_prev = this.pos_curr.clone()

      this.pos_curr.add(velocity)
      this.acceleration.multiply(dt*dt)
      this.pos_curr.add(this.acceleration)

      this.acceleration.x = 0
      this.acceleration.y = 0
    }

    accelerate(acc:Vec2D){
      this.acceleration.add(acc)
    }

    
  }