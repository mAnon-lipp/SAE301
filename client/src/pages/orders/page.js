import { EmptyOrdersView } from "../../ui/empty-orders/index.js";
import { OrderListView } from "../../ui/order-list/index.js";
import { htmlToFragment } from "../../lib/utils.js";
import { OrderData } from "../../data/order.js";
import { CartModel } from "../../data/cart.js";
import { VariantData } from "../../data/variant.js";
import template from "./template.html?raw";

let M = {
    orders: [],
    filteredOrders: [],
    currentFilter: 'all' // 'all', 'en cours', 'disponible', 'retirée'
};

let C = {};

C.init = async function(){
    try {
        // US012 - Charger les commandes depuis l'API (Critère 1: par date décroissante)
        M.orders = await OrderData.fetchAll();
        M.filteredOrders = M.orders;
        console.log('US012 - Commandes chargées:', M.orders);
    } catch (error) {
        console.error('Erreur lors du chargement des commandes:', error);
        M.orders = [];
        M.filteredOrders = [];
    }
    
    return V.init();
}

C.handler_filterChange = function(ev) {
    const filterValue = ev.target.value;
    C.filterOrders(filterValue);
}

C.filterOrders = function(status) {
    M.currentFilter = status;
    
    // US012 - Critère 5: Filtrer par statut
    if (status === 'all') {
        M.filteredOrders = M.orders;
    } else {
        M.filteredOrders = M.orders.filter(order => order.statut === status);
    }
    
    // Rerender la liste
    C.updateOrdersList();
}

C.updateOrdersList = function() {
    const container = document.querySelector('#orders-list-container');
    if (container) {
        // Préparer les données pour l'affichage
        const ordersData = C.prepareOrdersData(M.filteredOrders);
        
        if (ordersData.length === 0) {
            container.innerHTML = '';
            container.appendChild(EmptyOrdersView.dom());
        } else {
            container.innerHTML = '';
            const ordersListDOM = OrderListView.dom(ordersData);
            container.appendChild(ordersListDOM);
            
            // US013 - Attacher les événements pour les boutons "Recommander"
            C.attachReorderEvents(container);
        }
    }
}

C.attachReorderEvents = function(container) {
    // US013 - Critère 1: Gérer le clic sur "Commander à nouveau"
    const reorderButtons = container.querySelectorAll('[data-reorder]');
    reorderButtons.forEach(button => {
        button.addEventListener('click', C.handler_reorderClick);
    });
}

C.handler_reorderClick = async function(ev) {
    ev.preventDefault();
    const orderId = ev.target.dataset.reorder;
    
    if (!orderId) return;
    
    console.log('US013 - Recommander la commande:', orderId);
    
    // Trouver la commande complète avec tous les items
    const order = M.orders.find(o => o.id == orderId);
    
    if (!order || !order.items || order.items.length === 0) {
        alert('Impossible de recommander cette commande.');
        return;
    }
    
    // US013 - Critère 2: Transférer tous les produits vers le panier
    await C.reorderToCart(order);
}

C.reorderToCart = async function(order) {
    // US013 - Critère 3: Vérifier la disponibilité avant le transfert
    let addedCount = 0;
    let unavailableItems = [];
    let modifiedItems = [];
    
    // Charger le panier
    CartModel.load();
    
    for (const item of order.items) {
        try {
            const variantId = item.variant_id;
            const productId = item.product_details?.product_id;
            
            if (!productId) {
                // US013 - Critère 5: Gestion des produits supprimés
                unavailableItems.push(item.product_details?.name || 'Produit inconnu');
                continue;
            }
            
            // Vérifier la disponibilité du variant
            const variant = await VariantData.fetch(variantId);
            
            if (!variant) {
                // US013 - Critère 4: Produit supprimé ou modifié
                unavailableItems.push(item.product_details?.name || 'Produit inconnu');
                continue;
            }
            
            if (variant.stock <= 0) {
                // US013 - Critère 4: Informer si produit non disponible
                unavailableItems.push(`${item.product_details?.name || 'Produit'} (rupture de stock)`);
                continue;
            }
            
            if (variant.stock < item.quantite) {
                // Stock insuffisant, ajuster la quantité
                modifiedItems.push({
                    name: item.product_details?.name || 'Produit',
                    requestedQty: item.quantite,
                    availableQty: variant.stock
                });
            }
            
            // US013 - Critère 5: Conservation des options sélectionnées
            const variantData = {
                variantId: variantId,
                size: null,
                color: null
            };
            
            // Extraire taille et couleur depuis les options du variant
            if (variant.options) {
                variant.options.forEach(opt => {
                    const type = opt.type.toLowerCase();
                    if (type === 'size' || type === 'taille') {
                        variantData.size = opt.label;
                    } else if (type === 'color' || type === 'couleur') {
                        variantData.color = opt.label;
                    }
                });
            }
            
            // Ajouter au panier avec la quantité disponible
            const qtyToAdd = Math.min(item.quantite, variant.stock);
            const success = await CartModel.addItem(productId, qtyToAdd, variantData);
            
            if (success) {
                addedCount++;
            }
            
        } catch (error) {
            console.error('US013 - Erreur lors de l\'ajout de l\'item:', error);
            unavailableItems.push(item.product_details?.name || 'Produit inconnu');
        }
    }
    
    // US013 - Critère 6: Message de confirmation du transfert
    C.showReorderConfirmation(addedCount, unavailableItems, modifiedItems);
    
    // Mettre à jour le compteur du panier
    CartModel.updateGlobalCount();
}

C.showReorderConfirmation = function(addedCount, unavailableItems, modifiedItems) {
    // US013 - DoD: Messages informatifs clairs
    let message = '';
    
    if (addedCount > 0) {
        message += `✅ ${addedCount} produit(s) ajouté(s) au panier.\n\n`;
    }
    
    if (modifiedItems.length > 0) {
        message += '⚠️ Quantités ajustées :\n';
        modifiedItems.forEach(item => {
            message += `• ${item.name}: ${item.requestedQty} demandé(s), ${item.availableQty} disponible(s)\n`;
        });
        message += '\n';
    }
    
    if (unavailableItems.length > 0) {
        message += '❌ Produits non disponibles :\n';
        unavailableItems.forEach(name => {
            message += `• ${name}\n`;
        });
    }
    
    if (addedCount === 0 && unavailableItems.length > 0) {
        message = '❌ Aucun produit n\'a pu être ajouté au panier.\nTous les produits sont soit supprimés, soit en rupture de stock.';
    }
    
    alert(message);
}

C.prepareOrdersData = function(orders) {
    // US012 - Transformer les données pour l'affichage (Critères 2, 3, 4, 6)
    return orders.map(order => {
        // Format date: dd/mm/yyyy
        const date = new Date(order.date_commande);
        const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        
        // US012 - Critère 6: Afficher les options sélectionnées (taille/couleur)
        let variantInfo = '';
        if (order.items && order.items.length > 0) {
            // Construire une chaîne avec tous les items et leurs détails
            const itemsInfo = order.items.map(item => {
                // Utiliser les options complètes au lieu du SKU
                if (item.product_details && item.product_details.options && item.product_details.options.length > 0) {
                    const optionsText = item.product_details.options.map(opt => opt.label).join(' / ');
                    return optionsText;
                } else if (item.product_details && item.product_details.sku) {
                    // Fallback sur le SKU si pas d'options
                    return item.product_details.sku;
                } else if (item.product_details && item.product_details.name) {
                    // Afficher au moins le nom du produit
                    return item.product_details.name;
                }
                return `Variant #${item.variant_id}`;
            });
            
            // Si plusieurs items, les joindre, sinon afficher le premier
            if (itemsInfo.length > 1) {
                variantInfo = itemsInfo.join(', ');
            } else {
                variantInfo = itemsInfo[0] || '';
            }
        }
        
        return {
            id: order.id,
            date: formattedDate,
            status: order.statut, // US012 - Critère 2: Statut visible
            amount: parseFloat(order.montant_total).toFixed(2), // US012 - Critère 3: Montant total
            variant: variantInfo
        };
    });
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
   
   let ordersContentDOM;
   
   // US012 - Si aucune commande, afficher le message vide
   if (!M.filteredOrders || M.filteredOrders.length === 0) {
       ordersContentDOM = EmptyOrdersView.dom();
   } else {
       // Préparer les données pour l'affichage
       const ordersData = C.prepareOrdersData(M.filteredOrders);
       ordersContentDOM = OrderListView.dom(ordersData);
   }
   
   let ordersSlot = pageFragment.querySelector('slot[name="orders-content"]');
   if (ordersSlot) {
       ordersSlot.replaceWith(ordersContentDOM);
   }
   
   // US013 - Attacher les événements pour "Recommander" après insertion
   setTimeout(() => {
       const container = document.querySelector('#orders-list-container');
       if (container) {
           C.attachReorderEvents(container);
       }
   }, 0);
   
   return pageFragment;
}

V.attachEvents = function(pageFragment) {
    // US012 - Critère 5: Attacher les événements pour les filtres
    const filterSelect = pageFragment.querySelector('#status-filter');
    if (filterSelect) {
        filterSelect.addEventListener('change', C.handler_filterChange);
    }
    
    return pageFragment;
}

/**
 * US012 - Page de l'historique des commandes
 * US013 - Réutilisation des commandes
 * @param {object} params - Paramètres de la route
 * @param {Router} router - Instance du routeur
 */
export function OrdersPage(params, router) {
    console.log("US012/US013 - OrdersPage", params);
    return C.init();
}
