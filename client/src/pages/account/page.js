import { ProfileCardView } from "../../ui/profilecard/index.js";
import { OrdersCardView } from "../../ui/orderscard/index.js";
import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let M = {
    // No dynamic data for now
};

let C = {};

C.init = async function(){
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
    return C.init();
}
