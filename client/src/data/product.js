import {getRequest} from '../lib/api-request.js';


let ProductData = {};

let fakeProducts = [
    {
        id: 1,
        name: "Marteau",
        slug: "marteau",
        description: "Un marteau est un outil utilisé pour enfoncer des clous dans du bois ou d'autres matériaux. Il se compose d'une tête lourde en métal fixée à un manche en bois ou en fibre de verre.",
        prix: 9.99,
        image: "https://via.placeholder.com/520x520/CCCCCC/000000?text=Marteau",
        category: 1
    },
    {
        id: 2,
        name: "Tournevis",
        slug: "tournevis",
        description: "Un tournevis est un outil utilisé pour visser ou dévisser des vis. Il se compose d'une tige en métal avec une tête qui s'adapte à la fente de la vis.",
        prix: 5.99,
        image: "https://via.placeholder.com/520x520/CCCCCC/000000?text=Tournevis",
        category: 1
    },
    {
        id: 3,
        name: "Clé à molette",
        slug: "cle-a-molette",
        description: "Une clé à molette est un outil utilisé pour serrer ou desserrer des écrous et des boulons. Elle se compose d'une mâchoire réglable qui s'adapte à différentes tailles d'écrous.",
        prix: 12.99,
        image: "https://via.placeholder.com/520x520/CCCCCC/000000?text=Cle",
        category: 1
    },
    {
        id: 4,
        name: "Pince",
        slug: "pince",
        description: "Une pince est un outil utilisé pour saisir, tenir ou plier des objets. Elle se compose de deux bras articulés qui se rejoignent en un point de pivot.",
        prix: 7.99,
        image: "https://via.placeholder.com/520x520/CCCCCC/000000?text=Pince",
        category: 1
    },
    {
        id: 5,
        name: "Scie",
        slug: "scie",
        description: "Une scie est un outil utilisé pour couper des matériaux, généralement en bois. Elle se compose d'une lame dentée fixée à un manche.",
        prix: 14.99,
        image: "https://via.placeholder.com/520x520/CCCCCC/000000?text=Scie",
        category: 1
    },
    {
        id: 6,
        name: "Perceuse",
        slug: "perceuse",
        description: "Une perceuse est un outil utilisé pour percer des trous dans divers matériaux. Elle se compose d'un moteur qui fait tourner une mèche.",
        prix: 49.99,
        image: "https://via.placeholder.com/520x520/CCCCCC/000000?text=Perceuse",
        category: 1
    },
    {
        id: 7,
        name: "Ponceuse",
        slug: "ponceuse",
        description: "Une ponceuse est un outil utilisé pour lisser des surfaces en bois ou en métal. Elle se compose d'un moteur qui fait vibrer ou tourner un abrasif.",
        prix: 79.99,
        image: "https://via.placeholder.com/520x520/CCCCCC/000000?text=Ponceuse",
        category: 1
    },
    {
        id: 8,
        name: "Mètre",
        slug: "metre",
        description: "Un mètre est un outil utilisé pour mesurer des distances. Il se compose d'une bande graduée en métal ou en plastique.",
        prix: 19.99,
        image: "https://via.placeholder.com/520x520/CCCCCC/000000?text=Metre",
        category: 1
    },
    {
        id: 9,
        name: "Niveau à bulle",
        slug: "niveau-a-bulle",
        description: "Un niveau à bulle est un outil utilisé pour vérifier l'horizontalité ou la verticalité d'une surface. Il se compose d'un tube rempli de liquide avec une bulle d'air à l'intérieur.",
        prix: 9.99,
        image: "https://via.placeholder.com/520x520/CCCCCC/000000?text=Niveau",
        category: 1
    }
]

// Fonction pour normaliser les données des produits
ProductData.normalizeProduct = function(product) {
    // Générer un slug si absent
    if (!product.slug && product.name) {
        product.slug = product.name.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    
    // Normaliser le champ image
    if (!product.image) {
        // Chercher dans différents champs possibles
        if (product.image_url) {
            product.image = product.image_url;
        } else if (product.image_path) {
            product.image = product.image_path;
        } else if (product.picture) {
            product.image = product.picture;
        } else {
            // Image par défaut
            product.image = `https://via.placeholder.com/520x520/CCCCCC/000000?text=${encodeURIComponent(product.name || 'Product')}`;
        }
    }
    
    // S'assurer que l'image a le bon préfixe si c'est un chemin relatif
    if (product.image && !product.image.startsWith('http') && !product.image.startsWith('/')) {
        product.image = '/' + product.image;
    }
    
    return product;
}

ProductData.fetch = async function(id){
    let data = await getRequest('products/'+id);
    if (data == false) {
        return fakeProducts.pop();
    }
    return [ProductData.normalizeProduct(data)];
}

ProductData.fetchAll = async function(){
    let data = await getRequest('products');
    if (data == false) {
        return fakeProducts;
    }
    // Normaliser tous les produits
    let normalizedProducts = [];
    for (let i = 0; i < data.length; i++) {
        normalizedProducts.push(ProductData.normalizeProduct(data[i]));
    }
    return normalizedProducts;
}

ProductData.fetchByCategory = async function(categoryId){
    let data = await getRequest('products?category='+categoryId);
    if (data == false) {
        // Filter fake products by category
        let filteredProducts = [];
        for (let i = 0; i < fakeProducts.length; i++) {
            if (fakeProducts[i].category == categoryId) {
                filteredProducts.push(fakeProducts[i]);
            }
        }
        return filteredProducts;
    }
    // Normaliser tous les produits
    let normalizedProducts = [];
    for (let i = 0; i < data.length; i++) {
        normalizedProducts.push(ProductData.normalizeProduct(data[i]));
    }
    return normalizedProducts;
}


export {ProductData};