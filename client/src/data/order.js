import { getRequest, postRequest } from '../lib/api-request.js';

/**
 * OrderData - Gère les opérations liées aux commandes
 * US007 - Validation de commande
 */
let OrderData = {};

/**
 * Crée une nouvelle commande
 * @param {Array} items - Liste des items du panier avec variantId, quantite, prix_unitaire
 * @param {number} montantTotal - Montant total de la commande
 * @returns {Promise<Object|boolean>} - La commande créée ou false en cas d'erreur
 */
OrderData.create = async function(items, montantTotal) {
    try {
        // Préparer les données de la commande
        // Construire manuellement le tableau d'items (éviter map/forEach)
        const mappedItems = [];
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            
            const mappedItem = {
                quantite: item.quantity || 1,
                prix_unitaire: item.prix || 0
            };
            
            // Si variantId existe et n'est pas null, l'utiliser
            // Sinon utiliser produit_id (pour les produits sans variants)
            if (item.variantId && item.variantId !== null) {
                mappedItem.variant_id = item.variantId;
            } else {
                mappedItem.produit_id = item.productId;
            }
            
            console.log('Item à envoyer:', mappedItem, 'depuis:', item);
            mappedItems.push(mappedItem);
        }

        const orderData = {
            items: mappedItems,
            montant_total: montantTotal
        };
        
        console.log('Données de commande à envoyer:', orderData);
        
        // Envoyer la requête POST à l'API
        const response = await postRequest('orders', orderData);
        
        if (response && response.id) {
            return response;
        }
        
        return false;
    } catch (error) {
        console.error('Erreur lors de la création de la commande:', error);
        return false;
    }
};

/**
 * Récupère toutes les commandes de l'utilisateur connecté
 * @returns {Promise<Array|boolean>} - Liste des commandes ou false en cas d'erreur
 */
OrderData.fetchAll = async function() {
    try {
        const data = await getRequest('orders');
        
        if (data === false) {
            return [];
        }
        
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
        return [];
    }
};

/**
 * Récupère une commande spécifique par son ID
 * @param {number} id - ID de la commande
 * @returns {Promise<Object|boolean>} - La commande ou false en cas d'erreur
 */
OrderData.fetch = async function(id) {
    try {
        const data = await getRequest('orders/' + id);
        
        if (data === false) {
            return false;
        }
        
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération de la commande:', error);
        return false;
    }
};

/**
 * Génère un numéro de commande formaté
 * Le vrai numéro vient de la BDD (auto_increment) mais on peut formater l'affichage
 * @param {number} orderId - ID de la commande depuis la BDD
 * @returns {string} - Numéro de commande formaté (ex: LU0001DS25)
 */
OrderData.formatOrderNumber = function(orderId) {
    const prefix = 'LU';
    const paddedId = String(orderId).padStart(4, '0');
    const suffix = String.fromCharCode(65 + Math.floor(Math.random() * 26), 65 + Math.floor(Math.random() * 26));
    const year = new Date().getFullYear().toString().slice(-2);
    return `${prefix}${paddedId}${suffix}${year}`;
};

export { OrderData };
