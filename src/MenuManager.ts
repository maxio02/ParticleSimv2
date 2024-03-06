import * as Config from './Config';
import { PointerFunctionType } from './InputHandler';
import Vec2D from "./Vec2D";
import { grid, particles } from './script';

const menuButton = document.getElementById("menu-button");
const menuElements: NodeListOf<HTMLElement> = document.querySelectorAll(".menu-element");

menuButton.addEventListener('click', function (event) {
  event.stopPropagation();
  openMenu();
});

const switchTheme = () => {
  const rootElem = document.documentElement
  let theme = rootElem.getAttribute('theme'), newTheme;
  newTheme = (theme === 'light') ? 'dark' : 'light';

  rootElem.setAttribute('theme', newTheme);
  grid.draw();
}


document.querySelector('#theme-switch').addEventListener('click', switchTheme);

export function openMenu() {
  if (menuButton.getAttribute("open") == "false") {
    menuButton.setAttribute("open", "true");
    menuButton.style.cursor = "auto";

    menuElements.forEach(element => {
      setTimeout(function () {
        element.style.display = "block";
      }, 300);
    });

  }
  else {

  }
}

export function closeMenu() {
  menuButton.setAttribute("open", "false");
  menuButton.style.cursor = "pointer";
  menuElements.forEach(element => {
    element.style.display = "none";
  });

}

var fieldSizeSlider = document.getElementById("field-size-slider") as HTMLInputElement;
var fieldStrengthSlider = document.getElementById("field-strength-slider") as HTMLInputElement;
var gravityStrengthSlider = document.getElementById("gravity-strength-slider") as HTMLInputElement;
var substepsAmountEntryBox = document.getElementById("substeps-amount-entry") as HTMLInputElement;
var particlesAmountEntryBox = document.getElementById("particles-amount-entry") as HTMLInputElement;
var gyroEnabledCheckBox = document.getElementById("gyro-toggle") as HTMLInputElement;

const radioButtons = document.getElementsByName('cursor-function') as NodeListOf<HTMLInputElement>;

  radioButtons.forEach(radioButton => {
    radioButton.addEventListener('change', () => {
      if (radioButton.checked) {
        Config.setPointerFunction(radioButton.value as PointerFunctionType);
      }
    });
  });

fieldSizeSlider.oninput = function () {
  Config.setFieldSize(parseInt(fieldSizeSlider.value));
}

fieldStrengthSlider.oninput = function () {
  Config.setFieldStrength(parseInt(fieldStrengthSlider.value));
}

gravityStrengthSlider.oninput = function () {
  setGravityStrength(parseInt(gravityStrengthSlider.value));
}

substepsAmountEntryBox.addEventListener('change', function () {
  Config.setPhysicsSubstepsAmount(parseInt(substepsAmountEntryBox.value));
});

gyroEnabledCheckBox.oninput = function () {
  if (typeof DeviceMotionEvent !== 'undefined' && typeof (DeviceMotionEvent as any).requestPermission === 'function') {
    (DeviceMotionEvent as any).requestPermission().then((response: string) => {
        if (response == 'granted') {
            toggleGyro();
        }
    }).catch(console.error);
} else {
    toggleGyro();
}



}

function toggleGyro(){
  if (gyroEnabledCheckBox.checked) {
    Config.setIsGyroEnabled(true);
    window.addEventListener('devicemotion', handleMotion, true);
  }
  else {
    Config.setIsGyroEnabled(false);
    window.removeEventListener('devicemotion', handleMotion);
  }
  console.log(Config.isGyroEnabled());
}

particlesAmountEntryBox.addEventListener('change', function () {
  Config.setParticleNumber(parseInt(particlesAmountEntryBox.value));
  let diff = particles.length - Config.getParticleNumber();
  while( diff > 0){
   particles.pop();
   diff--;
  }
});


function handleMotion(event: DeviceMotionEvent): void {
    
  if(Config.isGyroEnabled()){
  Config.setGravityDirection(new Vec2D(-event.accelerationIncludingGravity.x/20, event.accelerationIncludingGravity.y/20));
  }
}


export function updatePointerFunction() {
  var radioButtons = document.getElementsByName('cursor-function') as NodeListOf<HTMLInputElement>

  for (var i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked) {
      return radioButtons[i].value;
    }
  }
}

export function setGravityStrength(value: number) {
  Config.setGravityDirection(new Vec2D(0, value * 0.1));
}
