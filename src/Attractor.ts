import { fps } from "./UIManager";
import Vec2D from "./Vec2D"
export default class Attractor {
    static canvas = document.getElementById('foreground-canvas') as HTMLCanvasElement;
    static ctx = Attractor.canvas!.getContext('2d');
    position: Vec2D
    radius: number
    color: string
    dt: number = 0
    force: number
    attracts: boolean


    constructor(pos: Vec2D, radius: number, force: number, attracts: boolean, color: string) {
        this.position = pos;
        this.radius = radius;
        this.color = color;
        this.attracts = attracts;
        attracts ? this.force = force : this.force = -force

    }

    animate() {
        let i = 0;
        this.attracts ? i = 1 : i = 0;
        this.attracts ? this.dt += 0.03*(60/fps) : this.dt -= 0.03*(60/fps)
        let xpos: number = this.position.x;
        let ypos: number = this.position.y;
        let ringsNum = 6;
        Attractor.ctx.lineWidth = 2;
        
        for(i; i <= ringsNum; i++)
        {
            Attractor.ctx.strokeStyle = `rgba(0, 0, 0, ${(ringsNum-i + this.dt%1)/ringsNum})`;
            Attractor.ctx.beginPath();
            Attractor.ctx.arc(
                xpos,
                ypos,
                (i-this.dt%1)*this.radius/ringsNum,
                0,
                2 * Math.PI,
                false
            );

            Attractor.ctx.stroke();
        }

        Attractor.ctx.closePath();
    }
}
