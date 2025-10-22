import {getRequest} from '../lib/api-request.js';

let OptionValueImageData = {};

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
    return data;
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
    return data;
}

export {OptionValueImageData};
