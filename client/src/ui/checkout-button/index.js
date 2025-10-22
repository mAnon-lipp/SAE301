import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let CheckoutButtonView = {
  html: function () {
    return template;
  },

  dom: function () {
    const fragment = htmlToFragment(this.html());
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

export { CheckoutButtonView };
