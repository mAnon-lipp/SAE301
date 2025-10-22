import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import "./style.css";

/**
 * ProfileFieldView est un composant pour afficher un champ de profil éditable
 */
let ProfileFieldView = {
  html: function () {
    return template;
  },

  dom: function (label, value, isPassword = false, hasValue = true, fieldName = '') {
    const fragment = htmlToFragment(template);
    
    // Replace label slot
    const labelSlot = fragment.querySelector('slot[name="label"]');
    const labelText = document.createElement('span');
    
    if (hasValue) {
      labelText.className = "profilefield_label_text";
    } else {
      labelText.className = "profilefield_label_text_black";
    }
    
    labelText.textContent = label;
    
    if (labelSlot) {
      labelSlot.replaceWith(labelText);
    }
    
    // Add data-field attribute to edit icon
    const editIcon = fragment.querySelector('img[alt="Edit"]');
    if (editIcon && fieldName) {
      editIcon.setAttribute('data-field', fieldName);
      editIcon.classList.add('profilefield_edit_icon');
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
  valueText.className = 'profilefield_value_text';
  valueText.style.fontVariationSettings = "'wdth' 100";
  valueText.textContent = '••••••••••';
  valueSlot.replaceWith(valueText);
      } else {
        // Display regular text value
  const valueText = document.createElement('p');
  valueText.className = 'profilefield_value_text';
  valueText.style.fontVariationSettings = "'wdth' 100";
  valueText.textContent = value;
  valueSlot.replaceWith(valueText);
      }
    }
    
    return fragment;
  }
};

export { ProfileFieldView };
