import { htmlToFragment, processTemplate } from "../../lib/utils.js";
import template from "./template.html?raw";

/**
 * EditPasswordModalView est un composant modal pour éditer le mot de passe de l'utilisateur
 */
let EditPasswordModalView = {
  html: function () {
    return processTemplate(template);
  },

  dom: function () {
    const fragment = htmlToFragment(processTemplate(template));
    
    // Add toggle password visibility functionality
    const oldPasswordInput = fragment.querySelector('#old-password-input');
    const newPasswordInput = fragment.querySelector('#new-password-input');
    const toggleOldBtn = fragment.querySelector('#toggle-old-password');
    const toggleNewBtn = fragment.querySelector('#toggle-new-password');
    
    if (toggleOldBtn && oldPasswordInput) {
      toggleOldBtn.addEventListener('click', () => {
        if (oldPasswordInput.type === 'password') {
          oldPasswordInput.type = 'text';
        } else {
          oldPasswordInput.type = 'password';
        }
      });
    }
    
    if (toggleNewBtn && newPasswordInput) {
      toggleNewBtn.addEventListener('click', () => {
        if (newPasswordInput.type === 'password') {
          newPasswordInput.type = 'text';
        } else {
          newPasswordInput.type = 'password';
        }
      });
    }
    
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

export { EditPasswordModalView };
