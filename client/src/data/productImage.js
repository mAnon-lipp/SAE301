import { getRequest } from '../lib/api-request.js';

let ProductImageData = {};

/**
 * Récupère toutes les images d'un produit
 * @param {number} productId - L'ID du produit
 * @returns {Promise<Array>} Liste des images
 */
ProductImageData.fetchByProductId = async function(productId) {
    try {
        const response = await getRequest(`productimages?product_id=${productId}`);
        return response || [];
    } catch (error) {
        console.error('Error fetching product images:', error);
        return [];
    }
};

/**
 * Récupère toutes les images
 * @returns {Promise<Array>} Liste de toutes les images
 */
ProductImageData.fetchAll = async function() {
    try {
        const response = await getRequest('productimages');
        return response || [];
    } catch (error) {
        console.error('Error fetching all product images:', error);
        return [];
    }
};

export { ProductImageData };
