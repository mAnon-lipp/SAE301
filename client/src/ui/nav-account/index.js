import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

/**
 * NavAccountView est le composant de navigation pour la page compte
 * Il inclut le logo, les liens de navigation et un menu utilisateur avec dropdown
 */
let NavAccountView = {
  html: function () {
    return template;
  },

  dom: function () {
    const fragment = htmlToFragment(template);
    
    // Ajouter la fonctionnalité de toggle du dropdown
    const toggle = fragment.querySelector('#account-menu-toggle');
    const dropdown = fragment.querySelector('#account-dropdown');
    
    if (toggle && dropdown) {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('hidden');
      });
      
      // Fermer le dropdown si on clique ailleurs
      document.addEventListener('click', () => {
        dropdown.classList.add('hidden');
      });
      
      // Empêcher la fermeture si on clique dans le dropdown
      dropdown.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
    
    return fragment;
  }
};

export { NavAccountView };
