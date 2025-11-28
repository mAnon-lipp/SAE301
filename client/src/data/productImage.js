import { getRequest } from '../lib/api-request.js';
import { getAssetPath } from '../lib/utils.js';

let ProductImageData = {};

/**
 * Normalise un objet image pour s'assurer que le chemin est correct
 */
const normalizeImage = function(image) {
    if (image && image.image_path && !image.image_path.startsWith('http')) {
        // S'assurer que le chemin commence par /
        let path = image.image_path.startsWith('/') ? image.image_path : '/' + image.image_path;
        image.image_path = getAssetPath(path);
    }
    return image;
};

/**
 * Récupère toutes les images d'un produit
 * @param {number} productId - L'ID du produit
 * @returns {Promise<Array>} Liste des images
 */
ProductImageData.fetchByProductId = async function(productId) {
    try {
        const response = await getRequest(`productimages?product_id=${productId}`);
        const images = response || [];
        return Array.isArray(images) ? images.map(normalizeImage) : [];
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
        const images = response || [];
        return Array.isArray(images) ? images.map(normalizeImage) : [];
    } catch (error) {
        console.error('Error fetching all product images:', error);
        return [];
    }
};

export { ProductImageData };
