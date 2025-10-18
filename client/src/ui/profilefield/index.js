import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

/**
 * ProfileFieldView est un composant pour afficher un champ de profil éditable
 */
let ProfileFieldView = {
  html: function () {
    return template;
  },

  dom: function (label, value, isPassword = false, hasValue = true) {
    const fragment = htmlToFragment(template);
    
    // Replace label slot
    const labelSlot = fragment.querySelector('slot[name="label"]');
    const labelText = document.createElement('span');
    
    if (hasValue) {
      labelText.className = "text-[#5f6368]";
    } else {
      labelText.className = "text-black";
    }
    
    labelText.textContent = label;
    
    if (labelSlot) {
      labelSlot.replaceWith(labelText);
    }
    
    // Replace value slot
    const valueSlot = fragment.querySelector('slot[name="value"]');
    if (valueSlot) {
      if (!hasValue) {
        // No value to display, remove the value container
        valueSlot.parentElement.remove();
      } else if (isPassword) {
        // Display password dots (bullets)
        const valueText = document.createElement('p');
        valueText.className = "font-['Instrument_Sans',_sans-serif] font-normal text-[14px] text-[#5f6368] leading-[23.1px] whitespace-nowrap";
        valueText.style.fontVariationSettings = "'wdth' 100";
        valueText.textContent = '••••••••••';
        valueSlot.replaceWith(valueText);
      } else {
        // Display regular text value
        const valueText = document.createElement('p');
        valueText.className = "font-['Instrument_Sans',_sans-serif] font-normal text-[14px] text-[#5f6368] leading-[23.1px] whitespace-nowrap";
        valueText.style.fontVariationSettings = "'wdth' 100";
        valueText.textContent = value;
        valueSlot.replaceWith(valueText);
      }
    }
    
    return fragment;
  }
};

export { ProfileFieldView };
