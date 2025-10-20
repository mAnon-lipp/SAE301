import { EmptyOrdersView } from "../../ui/empty-orders/index.js";
import { OrdersCardView } from "../../ui/orderscard/index.js";
import { htmlToFragment } from "../../lib/utils.js";
import { OrderData } from "../../data/order.js";
import template from "./template.html?raw";

let M = {
    orders: []
};

let C = {};

C.init = async function(){
    try {
        // Charger les commandes depuis l'API (US007)
        M.orders = await OrderData.fetchAll();
        console.log('Commandes chargées:', M.orders);
    } catch (error) {
        console.error('Erreur lors du chargement des commandes:', error);
        M.orders = [];
    }
    
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
   
   let ordersContentDOM;
   
   // Si aucune commande, afficher le message vide
   if (!M.orders || M.orders.length === 0) {
       ordersContentDOM = EmptyOrdersView.dom();
   } else {
       // Sinon, afficher les cartes de commandes
       ordersContentDOM = OrdersCardView.dom(M.orders);
   }
   
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
