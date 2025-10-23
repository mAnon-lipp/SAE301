import {getRequest} from '../lib/api-request.js';

let VariantData = {};

/**
 * Récupère tous les variants d'un produit avec leurs options
 * @param {number} productId - L'ID du produit
 * @returns {Promise<Array>} - Tableau des variants avec leurs options
 */
VariantData.fetchByProductId = async function(productId) {
    let data = await getRequest('variants?product=' + productId);
    if (data == false) {
        return [];
    }
    return data;
}

/**
 * Récupère un variant spécifique par son ID
 * @param {number} variantId - L'ID du variant
 * @returns {Promise<Object|null>} - Le variant avec ses options
 */
VariantData.fetch = async function(variantId) {
    let data = await getRequest('variants/' + variantId);
    if (data == false) {
        return null;
    }
    return data;
}

/**
 * Extrait les tailles disponibles depuis un tableau de variants
 * @param {Array} variants - Tableau des variants
 * @returns {Array<string>} - Tableau des tailles uniques triées
 */
VariantData.extractSizes = function(variants) {
    const sizes = new Set();
    variants.forEach(variant => {
        if (variant.options) {
            variant.options.forEach(option => {
                // Accepter 'Size', 'size', 'Taille' ou 'taille'
                const type = option.type.toLowerCase();
                if (type === 'size' || type === 'taille') {
                    sizes.add(option.value);
                }
            });
        }
    });
    return Array.from(sizes).sort((a, b) => {
        // Tri numérique pour les tailles
        const aNum = parseInt(a);
        const bNum = parseInt(b);
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return aNum - bNum;
        }
        return a.localeCompare(b);
    });
}

/**
 * Extrait les couleurs disponibles depuis un tableau de variants
 * @param {Array} variants - Tableau des variants
 * @returns {Array<Object>} - Tableau des couleurs uniques avec {name, code, value, optionValueId}
 */
VariantData.extractColors = function(variants) {
    const colorsMap = new Map();
    variants.forEach(variant => {
        if (variant.options) {
            variant.options.forEach(option => {
                // Accepter 'Color', 'color', 'Couleur' ou 'couleur'
                const type = option.type.toLowerCase();
                if (type === 'color' || type === 'couleur') {
                    if (!colorsMap.has(option.label)) {
                        colorsMap.set(option.label, {
                            name: option.label,
                            value: option.value, // Le code couleur interne (ex: 'latte_blue')
                            code: option.hex_code || '#CCCCCC', // Le code couleur hex pour l'affichage
                            optionValueId: option.option_value_id // ID pour charger les images
                        });
                    }
                }
            });
        }
    });
    return Array.from(colorsMap.values());
}

/**
 * Trouve un variant correspondant à une combinaison d'options spécifique
 * @param {Array} variants - Tableau des variants
 * @param {Object} selectedOptions - Objet avec les options sélectionnées {size: "36", color: "White"}
 * @returns {Object|null} - Le variant correspondant ou null
 */
VariantData.findByOptions = function(variants, selectedOptions) {
    return variants.find(variant => {
        if (!variant.options) return false;
        
        // Créer un map des options du variant
        const variantOptions = {};
        variant.options.forEach(option => {
            const type = option.type.toLowerCase();
            // Normaliser 'taille' -> 'size' et 'couleur' -> 'color'
            const normalizedType = type === 'taille' ? 'size' : (type === 'couleur' ? 'color' : type);
            variantOptions[normalizedType] = option.label;
        });
        
        // Vérifier que toutes les options sélectionnées correspondent
        for (let key in selectedOptions) {
            const normalizedKey = key.toLowerCase();
            if (selectedOptions[key] && variantOptions[normalizedKey] !== selectedOptions[key]) {
                return false;
            }
        }
        
        return true;
    }) || null;
}

/**
 * Vérifie si une combinaison d'options est disponible en stock
 * @param {Array} variants - Tableau des variants
 * @param {Object} selectedOptions - Objet avec les options sélectionnées
 * @returns {boolean} - true si disponible, false sinon
 */
VariantData.isAvailable = function(variants, selectedOptions) {
    const variant = VariantData.findByOptions(variants, selectedOptions);
    return variant && variant.stock > 0;
}

/**
 * Récupère les options disponibles pour une sélection partielle
 * Par exemple, si size est sélectionnée, retourne les couleurs disponibles pour cette taille
 * @param {Array} variants - Tableau des variants
 * @param {Object} selectedOptions - Options déjà sélectionnées
 * @param {string} optionType - Type d'option à récupérer ('size' ou 'color')
 * @returns {Array} - Valeurs disponibles pour ce type d'option
 */
VariantData.getAvailableOptions = function(variants, selectedOptions, optionType) {
    const normalizedType = optionType.toLowerCase();
    const availableValues = new Set();
    
    variants.forEach(variant => {
        if (!variant.options || variant.stock <= 0) return;
        
        // Vérifier si le variant correspond aux options déjà sélectionnées
        let matches = true;
        const variantOptions = {};
        
        variant.options.forEach(option => {
            const type = option.type.toLowerCase();
            // Normaliser 'taille' -> 'size' et 'couleur' -> 'color'
            const normalizedOptionType = type === 'taille' ? 'size' : (type === 'couleur' ? 'color' : type);
            variantOptions[normalizedOptionType] = option.label;
        });
        
        // Vérifier les autres options sélectionnées
        for (let key in selectedOptions) {
            if (key !== optionType && selectedOptions[key]) {
                const normalizedKey = key.toLowerCase();
                if (variantOptions[normalizedKey] !== selectedOptions[key]) {
                    matches = false;
                    break;
                }
            }
        }
        
        // Si ça correspond, ajouter la valeur de l'option demandée
        if (matches && variantOptions[normalizedType]) {
            availableValues.add(variantOptions[normalizedType]);
        }
    });
    
    return Array.from(availableValues);
}

/**
 * Récupère TOUTES les options (même sans stock) pour une sélection partielle
 * @param {Array} variants - Tableau des variants
 * @param {Object} selectedOptions - Options déjà sélectionnées
 * @param {string} optionType - Type d'option à récupérer ('size' ou 'color')
 * @returns {Array<{value: string, inStock: boolean}>} - Valeurs avec leur statut de stock
 */
VariantData.getAllOptions = function(variants, selectedOptions, optionType) {
    const normalizedType = optionType.toLowerCase();
    const optionsMap = new Map();
    
    variants.forEach(variant => {
        if (!variant.options) return;
        
        // Vérifier si le variant correspond aux options déjà sélectionnées
        let matches = true;
        const variantOptions = {};
        
        variant.options.forEach(option => {
            const type = option.type.toLowerCase();
            const normalizedOptionType = type === 'taille' ? 'size' : (type === 'couleur' ? 'color' : type);
            variantOptions[normalizedOptionType] = option.label;
        });
        
        // Vérifier les autres options sélectionnées
        for (let key in selectedOptions) {
            if (key !== optionType && selectedOptions[key]) {
                const normalizedKey = key.toLowerCase();
                if (variantOptions[normalizedKey] !== selectedOptions[key]) {
                    matches = false;
                    break;
                }
            }
        }
        
        // Si ça correspond, ajouter la valeur de l'option demandée
        if (matches && variantOptions[normalizedType]) {
            const value = variantOptions[normalizedType];
            const hasStock = variant.stock > 0;
            
            // Si l'option existe déjà, mettre à jour son statut (si au moins un variant a du stock)
            if (optionsMap.has(value)) {
                const existing = optionsMap.get(value);
                existing.inStock = existing.inStock || hasStock;
            } else {
                optionsMap.set(value, { value, inStock: hasStock });
            }
        }
    });
    
    return Array.from(optionsMap.values());
}

export {VariantData};
