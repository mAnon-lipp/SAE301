import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

export const CheckoutButtonView = {
  html() {
    return template;
  },

  dom() {
    const fragment = htmlToFragment(template);
    const button = fragment.querySelector('[data-checkout-button]');
    
    if (button) {
      button.addEventListener('click', () => {
        // Dispatcher un événement personnalisé pour finaliser la commande
        const event = new CustomEvent('checkout-finalize', {
          bubbles: true
        });
        button.dispatchEvent(event);
      });
    }
    
    return fragment;
  }
};
