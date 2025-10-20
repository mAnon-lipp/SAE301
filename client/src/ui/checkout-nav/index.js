import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

// CheckoutNavView est un composant statique pour la navigation lors du checkout
let CheckoutNavView = {
  html: function () {
    return template;
  },

  dom: function () {
    const fragment = htmlToFragment(template);
    return fragment;
  }
};

export { CheckoutNavView };
