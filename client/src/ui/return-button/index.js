import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

export const ReturnButtonView = {
  html() {
    return template;
  },

  dom() {
    const fragment = htmlToFragment(template);
    const button = fragment.querySelector('[data-return-button]');
    
    if (button) {
      button.addEventListener('click', () => {
        // Naviguer vers la page d'accueil
        window.history.pushState(null, null, '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
      });
    }
    
    return fragment;
  }
};
