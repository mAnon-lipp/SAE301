import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import { ConfirmationMessageView } from "../../ui/confirmation-message/index.js";
import { ReturnButtonView } from "../../ui/return-button/index.js";

let M = {
    orderNumber: null
};

// Génère un numéro de commande aléatoire
M.generateOrderNumber = function() {
    const prefix = 'LU';
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const suffix = String.fromCharCode(65 + Math.floor(Math.random() * 26), 65 + Math.floor(Math.random() * 26));
    const year = new Date().getFullYear().toString().slice(-2);
    return `${prefix}${randomNum}${suffix}${year}`;
};

let C = {};

C.init = function(orderNumber = null) {
    // Si pas de numéro fourni, en générer un
    M.orderNumber = orderNumber || M.generateOrderNumber();
    
    // Vider le panier après confirmation
    import('../../data/cart.js')
        .then((m) => {
            if (m && m.CartModel) {
                m.CartModel.items = [];
                m.CartModel.save();
                m.CartModel.updateGlobalCount();
            }
        })
        .catch(() => {
            console.warn('Impossible de vider le panier');
        });
    
    return V.init(M.orderNumber);
};

let V = {};

V.init = function(orderNumber) {
    let fragment = V.createPageFragment(orderNumber);
    return fragment;
};

V.createPageFragment = function(orderNumber) {
    // Créer le fragment depuis le template
    let pageFragment = htmlToFragment(template);
    
    // Générer le message de confirmation
    let confirmationMessageDOM = ConfirmationMessageView.dom(orderNumber);
    let confirmationMessageSlot = pageFragment.querySelector('slot[name="confirmation-message"]');
    if (confirmationMessageSlot) {
        confirmationMessageSlot.replaceWith(confirmationMessageDOM);
    }
    
    // Générer le bouton de retour
    let returnButtonDOM = ReturnButtonView.dom();
    let returnButtonSlot = pageFragment.querySelector('slot[name="return-button"]');
    if (returnButtonSlot) {
        returnButtonSlot.replaceWith(returnButtonDOM);
    }
    
    return pageFragment;
};

export function OrderConfirmationPage(params) {
    // Récupérer le numéro de commande depuis les paramètres de route si disponible
    const orderNumber = params?.orderNumber || null;
    return C.init(orderNumber);
}
