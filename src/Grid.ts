import Particle from "./Particle";

export class Grid {
    public cells: Particle[][][];
    public columns: number;
    public rows: number;
    public readonly gridPixelSize: number;
    private canvas: HTMLCanvasElement;

    constructor(foregroundCanvas: HTMLCanvasElement, gridPixelSize: number = 30) {
        this.gridPixelSize = gridPixelSize;
        this.canvas = foregroundCanvas;
        this.columns = Math.ceil(this.canvas.width / this.gridPixelSize);
        this.rows = Math.ceil(this.canvas.height / this.gridPixelSize);
        this.cells = this.initialize();
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
                this.cells[i][j] = [];
            }
        }
    }

    public put(particle: Particle): void {
        const column = Math.floor(particle.currentPosition.x / this.gridPixelSize);
        const row = Math.floor(particle.currentPosition.y / this.gridPixelSize);

        if (column >= 0 && column < this.cells.length && row >= 0 && row < this.cells[column].length) {
            this.cells[column][row].push(particle);
        }
    }

    public updateSize():void {
        this.columns = Math.ceil(this.canvas.width / this.gridPixelSize);
        this.rows = Math.ceil(this.canvas.height / this.gridPixelSize);
        this.initialize();
    }
}