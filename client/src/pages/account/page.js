import { ProfileCardView } from "../../ui/profilecard/index.js";
import { OrdersCardView } from "../../ui/orderscard/index.js";
import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let M = {
    user: null
};

let C = {};

C.init = async function(router){
    // Charger les données de l'utilisateur depuis sessionStorage ou l'API
    try {
        const userData = sessionStorage.getItem('auth_user');
        if (userData) {
            M.user = JSON.parse(userData);
        } else if (router && router.user) {
            M.user = router.user;
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
    
    return V.init();
}

let V = {};

V.init = function(){
    let fragment = V.createPageFragment();
    V.attachEvents(fragment);
    return fragment;
}

V.createPageFragment = function(){
   // Create page fragment from template
   let pageFragment = htmlToFragment(template);
   
   // Update welcome message with user's name
   const welcomeTitle = pageFragment.querySelector('h1');
   if (welcomeTitle && M.user) {
       // Utiliser le nom complet (name) ou l'email si pas de nom
       const displayName = M.user.name || M.user.email || 'Utilisateur';
       welcomeTitle.textContent = `Bienvenue ${displayName}`;
   }
   
   // Generate profile card
   let profileCardDOM = ProfileCardView.dom();
   let profileSlot = pageFragment.querySelector('slot[name="profile-card"]');
   if (profileSlot) {
       profileSlot.replaceWith(profileCardDOM);
   }
   
   // Generate orders card
   let ordersCardDOM = OrdersCardView.dom();
   let ordersSlot = pageFragment.querySelector('slot[name="orders-card"]');
   if (ordersSlot) {
       ordersSlot.replaceWith(ordersCardDOM);
   }
   
   return pageFragment;
}

V.attachEvents = function(pageFragment) {
    // No events for now
    return pageFragment;
}

/**
 * Page de profil basique / Mon Compte
 * @param {object} params - Paramètres de la route
 * @param {Router} router - Instance du routeur
 */
export function AccountPage(params, router) {
    console.log("AccountPage", params);
    return C.init(router);
}

