import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let ReturnButtonView = {
  html: function () {
    return template;
  },

  dom: function () {
    const fragment = htmlToFragment(this.html());
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

export { ReturnButtonView };
