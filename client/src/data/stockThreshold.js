import { getRequest } from '../lib/api-request.js';

/**
 * Module de gestion des seuils de stock
 * Permet de récupérer les seuils configurables depuis l'API
 */

let StockThresholdData = {};

/**
 * Récupère les seuils de stock depuis l'API
 * @returns {Promise<Object>} Objet contenant les seuils { LOW_STOCK, LOW_VARIANT_COUNT, CRITICAL_VARIANT_STOCK }
 */
StockThresholdData.getThresholds = async function() {
    try {
        const response = await getRequest('/api/stockthresholds');
        
        if (response && !response.error) {
            return response;
        } else {
            console.warn('Erreur lors de la récupération des seuils de stock:', response?.error);
            // Retourner des valeurs par défaut en cas d'erreur
            return {
                LOW_STOCK: 5,
                LOW_VARIANT_COUNT: 2,
                CRITICAL_VARIANT_STOCK: 3
            };
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des seuils de stock:', error);
        // Retourner des valeurs par défaut en cas d'erreur
        return {
            LOW_STOCK: 5,
            LOW_VARIANT_COUNT: 2,
            CRITICAL_VARIANT_STOCK: 3
        };
    }
};

/**
 * Met à jour un seuil de stock (admin seulement)
 * @param {number} id - L'ID du seuil à mettre à jour
 * @param {number} value - La nouvelle valeur
 * @returns {Promise<Object>} Le seuil mis à jour ou un message d'erreur
 */
StockThresholdData.updateThreshold = async function(id, value) {
    try {
        const response = await fetch(`/api/stockthresholds/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ setting_value: value })
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du seuil:', error);
        return { error: error.message };
    }
};

export { StockThresholdData };
