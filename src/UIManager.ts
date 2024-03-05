import * as Config from './Config';

let fpsCounter = document.createElement('div');
fpsCounter.style.position = 'absolute';
fpsCounter.style.top = '10px';
fpsCounter.style.left = '10px';

let particleCounter = document.createElement('div');
particleCounter.style.position = 'absolute';
particleCounter.style.top = '30px';
particleCounter.style.left = '10px';

document.body.appendChild(fpsCounter);
document.body.appendChild(particleCounter);

export var fps = 0;

let lastTime = performance.now();

export function updateUI(){
    fps = calculateFPS();
    fpsCounter.innerText = `FPS: ${fps}`;
    particleCounter.innerText = `Particles: ${Config.getParticleNumber}`;
}

function calculateFPS() {
    const currentTime = performance.now() * 0.1;
    const timeDiff = currentTime - lastTime;
    const fps = Math.round(1000 / timeDiff);
    lastTime = currentTime;
    return fps;
  }