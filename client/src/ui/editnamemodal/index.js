import { htmlToFragment, processTemplate } from "../../lib/utils.js";
import template from "./template.html?raw";

/**
 * EditNameModalView est un composant modal pour éditer le nom de l'utilisateur
 */
let EditNameModalView = {
  html: function () {
    return processTemplate(template);
  },

  dom: function (currentName = '') {
    const fragment = htmlToFragment(processTemplate(template));
    
    // Set current name in input if provided
    const input = fragment.querySelector('#name-input');
    if (input && currentName) {
      input.value = currentName;
    }
    
    // Add close button event (will be handled by parent)
    const closeButton = fragment.querySelector('#close-modal');
    const saveButton = fragment.querySelector('#save-button');
    
    // Close on backdrop click
    const backdrop = fragment.querySelector('.fixed.inset-0');
    if (backdrop) {
      backdrop.addEventListener('click', () => {
        // Will be handled by parent to remove modal
      });
    }
    
    return fragment;
  }
};

export { EditNameModalView };
