import { htmlToFragment, processTemplate } from "../../lib/utils.js";
import template from "./template.html?raw";

/**
 * EmptyOrdersView est un composant pour afficher le message "Pas encore de commande"
 */
let EmptyOrdersView = {
  html: function () {
    return processTemplate(template);
  },

  dom: function () {
    return htmlToFragment(EmptyOrdersView.html());
  }
};

export { EmptyOrdersView };
