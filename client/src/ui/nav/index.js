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
    const fragment = htmlToFragment(template);
    // Mettre à jour explicitement le compteur du panier quand le nav est (re)créé.
    // Utiliser un import dynamique pour éviter tout risque de dépendance circulaire.
    import("../../data/cart.js")
      .then((m) => {
        if (m && m.CartModel && typeof m.CartModel.updateGlobalCount === 'function') {
          m.CartModel.updateGlobalCount();
        }
      })
      .catch(() => {
        // silent fail: si le modèle n'est pas disponible, on ne bloque pas le rendu
      });

    return fragment;
  }
};

export { NavView };
