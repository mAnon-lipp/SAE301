import { getRequest } from '../lib/api-request.js';

let CategoryData = {};

// Catégories fake en cas d'échec de l'API
let fakeCategories = [
    { id: 1, name: "Mobilier", slug: "mobilier" },
    { id: 2, name: "Électronique", slug: "electronique" },
    { id: 3, name: "Bureautique", slug: "bureautique" },
    { id: 4, name: "Cuisine", slug: "cuisine" },
    { id: 5, name: "Extérieur", slug: "exterieur" }
];

/**
 * Récupère toutes les catégories
 */
CategoryData.fetchAll = async function() {
    let data = await getRequest('categories');
    if (data == false) return fakeCategories;
    if (Array.isArray(data)) return data;
    return [data];
}

/**
 * Récupère une catégorie par son ID
 */
CategoryData.fetch = async function(id) {
    let data = await getRequest('categories/' + id);
    if (data == false) {
        // Chercher dans les fake categories
        const found = fakeCategories.find(cat => cat.id == id) || null;
        return found || null;
    }
    return data;
}

export { CategoryData };
