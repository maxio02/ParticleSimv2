import * as Config from './Config';
import { drawGrid } from "./Renderer";
import Vec2D from "./Vec2D";

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
  drawGrid();
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

particlesAmountEntryBox.addEventListener('change', function () {
  Config.setParticleNumber(parseInt(particlesAmountEntryBox.value));
});


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
