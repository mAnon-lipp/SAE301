import { htmlToFragment, processTemplate } from "../../lib/utils.js";
import template from "./template.html?raw";

/**
 * EditEmailModalView est un composant modal pour éditer l'adresse email de l'utilisateur
 */
let EditEmailModalView = {
  html: function () {
    return processTemplate(template);
  },

  dom: function (currentEmail = '') {
    const fragment = htmlToFragment(processTemplate(template));
    
    // Set current email in input if provided
    const input = fragment.querySelector('#email-input');
    if (input && currentEmail) {
      input.value = currentEmail;
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

export { EditEmailModalView };
