import { OrderDetailItemView } from "../../ui/order-detail-item/index.js";
import { htmlToFragment } from "../../lib/utils.js";
import { OrderData } from "../../data/order.js";
import template from "./template.html?raw";

let M = {
    order: null,
    orderId: null
};

let C = {};

C.init = async function(orderId){
    M.orderId = orderId;
    
    try {
        // US013 - Charger le détail de la commande depuis l'API
        M.order = await OrderData.fetch(orderId);
        console.log('US013 - Commande chargée:', M.order);
        
        if (!M.order) {
            // Rediriger vers 404 si la commande n'existe pas
            window.router.navigate('/404');
            return null;
        }
    } catch (error) {
        console.error('Erreur lors du chargement de la commande:', error);
        window.router.navigate('/404');
        return null;
    }
    
    return V.init();
}

C.formatDate = function(dateString) {
    // Format: "11 Octobre 2025" ou "11 OCTOBRE 2025"
    const date = new Date(dateString);
    const months = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
}

C.prepareItemsData = function(items) {
    // Transformer les items pour l'affichage
    return items.map(item => {
        // Extraire les informations de variant (taille/couleur)
        let variantInfo = '';
        if (item.product_details && item.product_details.sku) {
            variantInfo = item.product_details.sku;
        } else {
            variantInfo = `Variant #${item.variant_id}`;
        }
        
        // Construire le chemin de l'image
        let imagePath = '/placeholder.jpg';
        if (item.product_details && item.product_details.image) {
            imagePath = `/${item.product_details.image}`;
        }
        
        return {
            image: imagePath,
            name: item.product_details?.name || 'Produit',
            quantite: item.quantite,
            prix_unitaire: parseFloat(item.prix_unitaire).toFixed(2),
            variant: variantInfo
        };
    });
}

let V = {};

V.init = function(){
    let fragment = V.createPageFragment();
    return fragment;
}

V.createPageFragment = function(){
    // Générer le numéro de commande formaté
    const orderNumber = OrderData.formatOrderNumber(M.order.id);
    const formattedDate = C.formatDate(M.order.date_commande);
    
    // Remplacer les placeholders dans le template
    let templateString = template.replace('{{orderNumber}}', orderNumber);
    templateString = templateString.replace('{{date}}', formattedDate);
    
    // Create page fragment from template
    let pageFragment = htmlToFragment(templateString);
    
    // Préparer les données des items
    const itemsData = C.prepareItemsData(M.order.items || []);
    
    // Générer le DOM des items
    let itemsDOM = OrderDetailItemView.dom(itemsData);
    
    // Remplacer le slot
    let itemsSlot = pageFragment.querySelector('slot[name="order-items"]');
    if (itemsSlot) {
        itemsSlot.replaceWith(itemsDOM);
    }
    
    return pageFragment;
}

/**
 * US013 - Page de détail d'une commande
 * @param {object} params - Paramètres de la route (contient l'ID de la commande)
 * @param {Router} router - Instance du routeur
 */
export function OrderDetailPage(params, router) {
    console.log("US013 - OrderDetailPage", params);
    
    // Vérifier que l'ID est présent
    if (!params.id) {
        router.navigate('/404');
        return null;
    }
    
    return C.init(params.id);
}
