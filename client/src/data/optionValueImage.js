import {getRequest} from '../lib/api-request.js';
import { getAssetPath } from '../lib/utils.js';

let OptionValueImageData = {};

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
 * Récupère toutes les images pour une option value spécifique (ex: une couleur)
 * @param {number} optionValueId - L'ID de l'option value
 * @returns {Promise<Array>} - Tableau des images
 */
OptionValueImageData.fetchByOptionValueId = async function(optionValueId) {
    let data = await getRequest('optionvalueimages?option_value_id=' + optionValueId);
    if (data == false) {
        return [];
    }
    return Array.isArray(data) ? data.map(normalizeImage) : [];
}

/**
 * Récupère toutes les images groupées par option pour un produit
 * @param {number} productId - L'ID du produit
 * @returns {Promise<Object>} - Objet avec {option_value_id: [images]}
 */
OptionValueImageData.fetchByProductId = async function(productId) {
    let data = await getRequest('optionvalueimages?product_id=' + productId);
    if (data == false) {
        return {};
    }
    // Normaliser les images dans chaque groupe
    if (typeof data === 'object' && !Array.isArray(data)) {
        for (let key in data) {
            if (Array.isArray(data[key])) {
                data[key] = data[key].map(normalizeImage);
            }
        }
    }
    return data;
}

/**
 * Récupère une image spécifique par son ID
 * @param {number} imageId - L'ID de l'image
 * @returns {Promise<Object|null>} - L'image
 */
OptionValueImageData.fetch = async function(imageId) {
    let data = await getRequest('optionvalueimages/' + imageId);
    if (data == false) {
        return null;
    }
    return normalizeImage(data);
}

export {OptionValueImageData};
