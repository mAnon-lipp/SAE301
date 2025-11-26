import { htmlToFragment, processTemplate } from "../../lib/utils.js";
import template from "./template.html?raw";

/**
 * Composant AccountMainView
 * Affiche la page principale du compte utilisateur avec le message de bienvenue
 * et l'état des commandes
 */
let AccountMainView = {
  html: function () {
    return processTemplate(template);
  },

  dom: function () {
    return htmlToFragment(AccountMainView.html());
  }
};

export { AccountMainView };
