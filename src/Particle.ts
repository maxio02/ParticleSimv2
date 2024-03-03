import { createProgram, createShader } from "./ShaderHelper";
import Vec2D from "./Vec2D"
import { drawOutline, grid, gridSize } from "./script";
import particleFragmentShader from "./shaders/particleFragmentShader.frag";
import particleVertexShader from "./shaders/particleVertexShader.vert";
// back button
// Numbers in menu
// grid size adj
// ball randomness
export default class Particle {
    static canvas = document.getElementById('foreground-canvas') as HTMLCanvasElement;
    static gl = Particle.canvas!.getContext("2d");
    pos_curr: Vec2D
    pos_prev: Vec2D
    acceleration: Vec2D
    radius: number
    color: {r:number, g:number, b:number}
    gridCell: Vec2D
    


    constructor(pos: Vec2D, radius: number, acc: Vec2D, color: {r:number, g:number, b:number}) {
      this.pos_curr = pos;
      this.pos_prev = this.pos_curr;
      this.radius = radius;
      this.acceleration = acc;
      this.color = color;
      this.updateCell(new Vec2D(
                      Math.floor(this.pos_curr.x / gridSize),
                      Math.floor(this.pos_curr.y / gridSize)));
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

    updateCell(gridPos: Vec2D){
      this.gridCell = gridPos;
    }

    
  }