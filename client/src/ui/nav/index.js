import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

// NavView est un composant statique
// on ne fait que charger le template HTML
// en donnant la possibilité de l'avoir sous forme html ou bien de dom
let NavView = {
  html: function () {
    return template;
  },

  dom: function () {
    return htmlToFragment(template);
  }
};

export { NavView };
