import { getRequest } from '../lib/api-request.js';

let CategoryData = {};

// Catégories fake en cas d'échec de l'API
let fakeCategories = [
    { id: 1, name: "Mobilier" },
    { id: 2, name: "Électronique" },
    { id: 3, name: "Bureautique" },
    { id: 4, name: "Cuisine" },
    { id: 5, name: "Extérieur" }
];

/**
 * Récupère toutes les catégories
 */
CategoryData.fetchAll = async function() {
    let data = await getRequest('categories');
    return data == false ? fakeCategories : data;
}

/**
 * Récupère une catégorie par son ID
 */
CategoryData.fetch = async function(id) {
    let data = await getRequest('categories/' + id);
    if (data == false) {
        // Chercher dans les fake categories
        return fakeCategories.find(cat => cat.id == id) || null;
    }
    return data;
}

export { CategoryData };
