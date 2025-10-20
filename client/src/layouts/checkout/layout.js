import template from "./template.html?raw";
import { htmlToFragment } from "../../lib/utils.js";
import { CheckoutNavView } from "../../ui/checkout-nav/index.js";

/**
 * Construit et retourne le layout pour la page de checkout.
 *
 * @function
 * @returns {DocumentFragment} Le fragment DOM représentant le layout checkout.
 *
 * @description
 * - Crée un fragment DOM à partir du template HTML.
 * - Génère le DOM de la navigation checkout via CheckoutNavView.dom().
 * - Remplace le slot nommé "checkout-nav" par le DOM de la navigation.
 * - Retourne le fragment DOM finalisé.
 */
export function CheckoutLayout() {
    let layout = htmlToFragment(template);
    let checkoutNav = CheckoutNavView.dom();
    layout.querySelector('slot[name="checkout-nav"]').replaceWith(checkoutNav);
    return layout;
}
