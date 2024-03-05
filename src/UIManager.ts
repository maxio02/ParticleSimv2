import * as Config from './Config';

let fpsCounter = document.createElement('div');
fpsCounter.style.position = 'absolute';
fpsCounter.style.top = '10px';
fpsCounter.style.left = '10px';

document.body.appendChild(fpsCounter);

export var fps = 60;
export var frameTimes:number[] = [];
const maxFrames = 100; 

let lastTime = performance.now();

export function updateUI() {
    let averagedFPS = calculateFPS();
    fpsCounter.innerText = `FPS: ${Math.round(averagedFPS)}`;
}

function calculateFPS() {
    const currentTime = performance.now();
    const timeDiff = currentTime - lastTime;
    frameTimes.push(timeDiff);

    if (frameTimes.length > maxFrames) {
        frameTimes.shift();
    }


    const averageFPS = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;

    lastTime = currentTime;

    return 1000 / averageFPS;
}

export function getAverageFrameTime(){
    return frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
}
