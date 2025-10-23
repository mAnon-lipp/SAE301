import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import { OrderSummaryItemView } from "../../ui/order-summary-item/index.js";
import { CheckoutButtonView } from "../../ui/checkout-button/index.js";
import { OrderData } from "../../data/order.js";

let M = {
    cartItems: [],
    total: 0
};

// Calcule le total du panier
M.calculateTotal = function() {
    let total = 0;
    for (let item of M.cartItems) {
        total += (item.prix || 0) * (item.quantity || 1);
    }
    return total;
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

C.handler_finalizeCheckout = async function(ev) {
    if (ev.type === 'checkout-finalize') {
        try {
            // Vérifier l'authentification (Critère d'acceptation 1)
            const router = window.router; // Accès au routeur global
            
            if (!router || !router.isAuthenticated) {
                // Rediriger vers la page de connexion si non connecté
                sessionStorage.setItem('redirectAfterLogin', '/checkout');
                window.history.pushState(null, null, '/login');
                window.dispatchEvent(new PopStateEvent('popstate'));
                return;
            }
            
            // Vérifier que le panier n'est pas vide
            if (!M.cartItems || M.cartItems.length === 0) {
                alert('Votre panier est vide.');
                window.history.pushState(null, null, '/');
                window.dispatchEvent(new PopStateEvent('popstate'));
                return;
            }
            
            // Désactiver le bouton pour éviter les double-clics
            const button = ev.target.closest('[data-checkout-button]');
            if (button) {
                button.disabled = true;
                button.textContent = 'Traitement en cours...';
            }
            
            // Créer la commande via l'API (Critère d'acceptation 3, 4, 5)
            console.log('Création de la commande avec:', M.cartItems, M.total);
            const order = await OrderData.create(M.cartItems, M.total);
            
            // Vérifier si c'est une erreur (US010 - validation stock)
            if (order && order.error) {
                if (button) {
                    button.disabled = false;
                    button.textContent = 'Finaliser la commande';
                }
                
                // Afficher le message d'erreur détaillé du serveur
                let errorMessage = order.message || 'Une erreur est survenue';
                
                // Si c'est une erreur de stock, afficher des détails clairs
                if (order.error === 'Stock insuffisant' && order.details) {
                    errorMessage = `⚠️ Quantité demandée supérieure au stock disponible !\n\n` +
                                 `Quantité demandée : ${order.details.requested_quantity}\n` +
                                 `Stock disponible : ${order.details.available_stock}\n\n` +
                                 `Veuillez réduire la quantité dans votre panier.`;
                } else if (order.error === 'Article épuisé') {
                    errorMessage = `⚠️ Article épuisé !\n\nCet article n'est plus disponible.\nVeuillez le retirer de votre panier.`;
                }
                
                alert(errorMessage);
                return;
            }
            
            if (order && order.id) {
                // Commande créée avec succès
                console.log('Commande créée:', order);
                
                // Générer le numéro de commande formaté
                const orderNumber = OrderData.formatOrderNumber(order.id);
                
                // Rediriger vers la page de confirmation (Critère d'acceptation 6)
                window.history.pushState(null, null, `/order-confirmation/${orderNumber}`);
                window.dispatchEvent(new PopStateEvent('popstate'));
            } else {
                // Erreur lors de la création
                if (button) {
                    button.disabled = false;
                    button.textContent = 'Finaliser la commande';
                }
                alert('Une erreur est survenue lors de la création de votre commande. Veuillez réessayer.');
            }
            
        } catch (error) {
            console.error('Erreur lors de la finalisation:', error);
            alert('Une erreur est survenue. Veuillez réessayer.');
            
            const button = ev.target.closest('[data-checkout-button]');
            if (button) {
                button.disabled = false;
                button.textContent = 'Finaliser la commande';
            }
        }
    }
};

C.init = async function() {
    try {
        // Importer le modèle du panier pour récupérer les items
        const { CartModel } = await import('../../data/cart.js');
        M.cartItems = CartModel.items; // Accès direct à la propriété items
        M.total = M.calculateTotal();
        
        console.log('Panier chargé:', M.cartItems, 'Total:', M.total);
        
        return V.init(M.cartItems, M.total);
    } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
        M.cartItems = [];
        M.total = 0;
        return V.init([], 0);
    }
};

let V = {};

V.init = function(items, total) {
    let fragment = V.createPageFragment(items, total);
    V.attachEvents(fragment);
    return fragment;
};

V.createPageFragment = function(items, total) {
    // Créer le fragment depuis le template
    let pageFragment = htmlToFragment(template);
    
    // Générer les items de commande
    let orderItemsDOM = OrderSummaryItemView.dom(items);
    let orderItemsSlot = pageFragment.querySelector('slot[name="order-items"]');
    if (orderItemsSlot) {
        orderItemsSlot.replaceWith(orderItemsDOM);
    }
    
    // Générer le bouton de checkout
    let checkoutButtonDOM = CheckoutButtonView.dom();
    let checkoutButtonSlot = pageFragment.querySelector('slot[name="checkout-button"]');
    if (checkoutButtonSlot) {
        checkoutButtonSlot.replaceWith(checkoutButtonDOM);
    }
    
    // Mettre à jour le prix total
    let totalElement = pageFragment.querySelector('[data-total-price]');
    if (totalElement) {
        totalElement.textContent = '$' + total.toFixed(2);
    }
    
    return pageFragment;
};

V.attachEvents = function(pageFragment) {
    let root = pageFragment.firstElementChild;
    if (root) {
        root.addEventListener('checkout-finalize', C.handler_finalizeCheckout);
    }
    return pageFragment;
};

export function CheckoutPage() {
    return C.init();
}
