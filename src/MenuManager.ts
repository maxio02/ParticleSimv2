import { setFieldSize, setFieldStrength, setGravityStrength, setSubsteps, setParticlesNum, setDrawOutline} from "./script";

const menu_button = document.getElementById("menu-button");
const menu_elements: NodeListOf<HTMLElement> =  document.querySelectorAll(".menu-element");

menu_button.addEventListener('click', function(event){
    event.stopPropagation();
    openMenu();
});


export function openMenu() {
    if (menu_button.getAttribute("open") == "false") {
        // menu_button.removeEventListener('click', openMenu)
        menu_button.setAttribute("open", "true");
        menu_button.style.cursor = "auto";
        // setTimeout(function () {
        //     menu_elements.item(0).style.display= "inline-block";
        // }, 300);

        menu_elements.forEach(element => {
            setTimeout(function () {
                element.style.display = "block";
            }, 300);
        });

    }
    else {
        
    }
}

export function closeMenu() {
    menu_button.setAttribute("open", "false");
    menu_button.style.cursor = "pointer";
    menu_elements.forEach(element => {
        element.style.display = "none";
    });

}

var field_size_slider = document.getElementById("field-size-slider")  as HTMLInputElement;
var field_strength_slider = document.getElementById("field-strength-slider")  as HTMLInputElement;
var gravity_strength_slider = document.getElementById("gravity-strength-slider")  as HTMLInputElement;
var substeps_amount_entry = document.getElementById("substeps-amount-entry") as HTMLInputElement;
var particles_amount_entry = document.getElementById("particles-amount-entry") as HTMLInputElement;
var outline_checkbox = document.getElementById("drawOutline") as HTMLInputElement;

field_size_slider.oninput = function() {
    setFieldSize(parseInt(field_size_slider.value));
  }

field_strength_slider.oninput = function() {
    setFieldStrength(parseInt(field_strength_slider.value));
  }

gravity_strength_slider.oninput = function() {
    setGravityStrength(parseInt(gravity_strength_slider.value));
  }

substeps_amount_entry.addEventListener('change', function() {
    setSubsteps(parseInt(substeps_amount_entry.value));
});

particles_amount_entry.addEventListener('change', function() {
    setParticlesNum(parseInt(particles_amount_entry.value));
});

outline_checkbox.oninput = function() {
    setDrawOutline(outline_checkbox.checked)
}

export function getPointerFunction() {
    var radioButtons = document.getElementsByName('cursor-function') as NodeListOf<HTMLInputElement>
  
    for (var i = 0; i < radioButtons.length; i++) {
      if (radioButtons[i].checked) {
        return radioButtons[i].value;
      }
    }
  }

