import template from "./template.html?raw";
import { htmlToFragment } from "../../lib/utils.js";
import { NavAccountView } from "../../ui/nav-account/index.js";
import { FooterView } from "../../ui/footer/index.js";

/**
 * Construit et retourne le layout pour la page compte de l'utilisateur.
 *
 * @function
 * @returns {DocumentFragment} Le fragment DOM représentant le layout de la page compte.
 *
 * @description
 * - Crée un fragment DOM à partir du template HTML.
 * - Génère le DOM de la navigation compte via NavAccountView.dom().
 * - Génère le DOM du pied de page via FooterView.dom().
 * - Remplace le slot nommé "nav-account" par le DOM de la navigation.
 * - Remplace le slot nommé "footer" par le DOM du pied de page.
 * - Retourne le fragment DOM finalisé.
 */
export function AccountLayout() {
    let layout = htmlToFragment(template);
    let navAccount = NavAccountView.dom();
    let footer = FooterView.dom();
    layout.querySelector('slot[name="nav-account"]').replaceWith(navAccount);
    layout.querySelector('slot[name="footer"]').replaceWith(footer);
    return layout;
}
