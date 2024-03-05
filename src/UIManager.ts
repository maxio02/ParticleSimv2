import * as Config from './Config';

let fpsCounter = document.createElement('div');
fpsCounter.style.position = 'absolute';
fpsCounter.style.top = '10px';
fpsCounter.style.left = '10px';

document.body.appendChild(fpsCounter);

export var fps = 0;

let lastTime = performance.now();

export function updateUI(){
    fps = calculateFPS();
    fpsCounter.innerText = `FPS: ${fps}`;
}

function calculateFPS() {
    const currentTime = performance.now() * 0.1;
    const timeDiff = currentTime - lastTime;
    fps = Math.round((1000 / timeDiff)* 0.1);
    lastTime = currentTime;
    return fps;
  }