import { EmptyOrdersView } from "../../ui/empty-orders/index.js";
import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let M = {
    // Orders data will be loaded here in the future
    orders: []
};

let C = {};

C.init = async function(){
    // TODO: Charger les commandes depuis l'API
    // Pour l'instant, orders reste vide
    return V.init();
}

let V = {};

V.init = function(){
    let fragment = V.createPageFragment();
    return fragment;
}

V.createPageFragment = function(){
   // Create page fragment from template
   let pageFragment = htmlToFragment(template);
   
   // Pour l'instant, toujours afficher le message vide
   // Plus tard, on pourra vérifier si M.orders.length === 0
   let ordersContentDOM = EmptyOrdersView.dom();
   let ordersSlot = pageFragment.querySelector('slot[name="orders-content"]');
   if (ordersSlot) {
       ordersSlot.replaceWith(ordersContentDOM);
   }
   
   return pageFragment;
}

/**
 * Page des commandes utilisateur
 * @param {object} params - Paramètres de la route
 * @param {Router} router - Instance du routeur
 */
export function OrdersPage(params, router) {
    console.log("OrdersPage", params);
    return C.init();
}
