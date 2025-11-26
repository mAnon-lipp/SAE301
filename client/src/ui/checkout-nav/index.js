import { htmlToFragment, processTemplate } from "../../lib/utils.js";
import template from "./template.html?raw";

// CheckoutNavView est un composant statique pour la navigation lors du checkout
let CheckoutNavView = {
  html: function () {
    return processTemplate(template);
  },

  dom: function () {
    const fragment = htmlToFragment(processTemplate(template));
    return fragment;
  }
};

export { CheckoutNavView };
