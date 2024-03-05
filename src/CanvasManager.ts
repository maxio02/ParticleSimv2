import { grid } from "./script";

export const foregroundCanvas = document.getElementById('foreground-canvas') as HTMLCanvasElement;
export const backgroundCanvas = document.getElementById('background-canvas') as HTMLCanvasElement;
const webglCanvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;

foregroundCanvas!.width = foregroundCanvas.getBoundingClientRect().width;
foregroundCanvas!.height = foregroundCanvas.getBoundingClientRect().height;
backgroundCanvas!.width = backgroundCanvas.getBoundingClientRect().width;
backgroundCanvas!.height = backgroundCanvas.getBoundingClientRect().height;

export const foregroundCanvasCtx = foregroundCanvas.getContext('2d');
export const backgroundCanvasCtx = backgroundCanvas.getContext('2d');


window.addEventListener("resize", updateCanvasSize);

export function clearCanvas() {
    foregroundCanvasCtx.clearRect(0, 0, foregroundCanvas.width, foregroundCanvas.height);
  }
  
export function updateCanvasSize() {
    foregroundCanvas.width = foregroundCanvas.getBoundingClientRect().width;
    foregroundCanvas.height = foregroundCanvas.getBoundingClientRect().height;
    backgroundCanvas.width = backgroundCanvas.getBoundingClientRect().width;
    backgroundCanvas.height = backgroundCanvas.getBoundingClientRect().height;
    webglCanvas.width = webglCanvas.getBoundingClientRect().width;
    webglCanvas.height = webglCanvas.getBoundingClientRect().height;
    grid.updateSize();
    grid.draw();
  }
  