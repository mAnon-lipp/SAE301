import { AccountMainView } from "../../ui/account-main/index.js";
import { htmlToFragment } from "../../lib/utils.js";

/**
 * Page de profil basique / Mon Compte
 * @param {object} params - Paramètres de la route
 * @param {Router} router - Instance du routeur
 */
export function AccountPage(params, router) {
    if (!router.isAuthenticated) {
        // Le guard du router devrait empêcher d'arriver ici, mais par sécurité
        return htmlToFragment('<div>Redirection...</div>');
    }
    
    // Utiliser le composant AccountMainView
    return AccountMainView.dom();
}
