import { backgroundCanvasCtx } from "./CanvasManager";
import Particle from "./Particle";
import { grid } from "./script";
import * as Config from './Config';
export class Grid {
    public cells: Particle[][][];
    public columns: number;
    public rows: number;
    public readonly pixelSize: number;
    private canvas: HTMLCanvasElement;
    private canvasCtx: CanvasRenderingContext2D;
    constructor(canvas: HTMLCanvasElement, gridPixelSize: number = Config.getGridSize()) {
        this.pixelSize = gridPixelSize;
        this.canvas = canvas;
        this.columns = Math.ceil(this.canvas.width / this.pixelSize);
        this.rows = Math.ceil(this.canvas.height / this.pixelSize);
        this.cells = this.initialize();
        this.canvasCtx = this.canvas.getContext("2d");
    }

    private initialize(): Particle[][][] {
        const cells: Particle[][][] = [];
        for (let i = 0; i < this.columns; i++) {
            cells[i] = [];
            for (let j = 0; j < this.rows; j++) {
                cells[i][j] = [];
            }
        }
        return cells;
    }

    public removeAll(): void {
        for (let i = 0; i < this.columns; i++) {
            for (let j = 0; j < this.rows; j++) {
                if(this.cells[i]== null){
                    break;
                }
                this.cells[i][j] = [];
            }
        }
    }

    public put(particle: Particle): void {
        const column = Math.floor(particle.currentPosition.x / this.pixelSize);
        const row = Math.floor(particle.currentPosition.y / this.pixelSize);
        
        if (column >= 0 && column < this.cells.length && row >= 0 && row < this.cells[column].length) {
            this.cells[column][row].push(particle);
            // console.log(`${column}   ${row}`);
        }
    }

    public updateSize():void {
        this.columns = Math.ceil(this.canvas.width / this.pixelSize);
        this.rows = Math.ceil(this.canvas.height / this.pixelSize);
        this.initialize();
    }

    public draw(){

            this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          
            this.canvasCtx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--grid-color');
            this.canvasCtx.lineWidth = 1;
            for (let x = this.pixelSize; x < this.canvas.width; x += this.pixelSize) {
              this.canvasCtx.beginPath();
              this.canvasCtx.moveTo(x, 0);
              this.canvasCtx.lineTo(x, this.canvas.height);
              this.canvasCtx.stroke();
            }
            for (let y = this.pixelSize; y < this.canvas.height; y += this.pixelSize) {
              this.canvasCtx.beginPath();
              this.canvasCtx.moveTo(0, y);
              this.canvasCtx.lineTo(this.canvas.width, y);
              this.canvasCtx.stroke();
            }
            // DEBUG
            //   for (let x = 0; x < grid.columns; x += 1) {
          
            //   for (let y = 0; y < grid.rows; y += 1) {
            //     backgroundCanvasCtx.font = "12px serif";
          
            //     backgroundCanvasCtx.fillText(`${grid.cells[x][y].length}`, (x+1)*this.pixelSize - this.pixelSize/2 - 2, (y+1)*this.pixelSize -this.pixelSize/2 + 4);
                // back_ctx.fillText(`${x} ${y}`, (x+1)*this.pixelSize - this.pixelSize/2 - 2, (y+1)*this.pixelSize -this.pixelSize/2 + 4);
            //   }
            // }
          }
    }