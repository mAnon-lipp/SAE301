import { ProductData } from "../../data/product.js";
import { ProductImageData } from "../../data/productImage.js";
import { htmlToFragment } from "../../lib/utils.js";
import { BreadcrumbView } from "../../ui/breadcrumb/index.js";
import { ImageGalleryView } from "../../ui/imagegallery/index.js";
import { ProductInfoView } from "../../ui/productinfo/index.js";
import template from "./template.html?raw";


let M = {
    products: [],
    productImages: []
};

M.getProductById = function(id){
    return M.products.find(product => product.id == id);
}


let C = {};

C.init = async function(params) {
    // Récupérer l'ID depuis les paramètres de route
    const productId = params.id;
    
    // Charger le produit depuis l'API
    M.products = await ProductData.fetchAll();
    
    let product = M.getProductById(productId);
    
    if (!product) {
        console.error("Product not found:", productId);
        return htmlToFragment("<div>Produit introuvable</div>");
    }
    
    // Charger les images du produit
    M.productImages = await ProductImageData.fetchByProductId(productId);
    
    console.log("Product loaded:", product);
    console.log("Product images loaded:", M.productImages);
    
    return V.init(product, M.productImages);
}


let V = {};

V.init = function(data, productImages = []) {
    let fragment = V.createPageFragment(data, productImages);
    return fragment;
}

V.createPageFragment = function(data, productImages = []) {
    // Créer le fragment depuis le template
    let pageFragment = htmlToFragment(template);
    
    // Construire le tableau d'images pour la galerie
    let images = [];

    // utilitaire: prefixe '/' uniquement si nécessaire
    function normalizeImagePath(path){
        if (!path) return path;
        if (typeof path !== 'string') return path;
        if (path.startsWith('http') || path.startsWith('/')) return path;
        return '/' + path;
    }
    
    // Ajouter l'image principale du produit en premier
    // Préfixer avec / si ce n'est pas déjà une URL complète
    if (data.image) {
        const imageUrl = normalizeImagePath(data.image);
        images.push({ url: imageUrl, alt: data.name });
    }
    
    // Ajouter les images de la galerie ProductImage
    if (productImages && productImages.length > 0) {
        productImages.forEach(img => {
            const imageUrl = normalizeImagePath(img.image_path || img.image || img.image_url);
            images.push({ url: imageUrl, alt: data.name });
        });
    }
    
    // Préparer les données pour la galerie
    const galleryData = {
        mainImage: images.length > 0 ? images[0].url : 'https://via.placeholder.com/468',
        productName: data.name,
        images: images
    };
    
    // Préparer les données pour les infos produit
    const productInfoData = {
        id: data.id,
        name: data.name,
        prix: data.prix,
        description: data.description || ''
    };
    
    // Insérer le breadcrumb
    const breadcrumbDOM = BreadcrumbView.dom();
    pageFragment.querySelector('slot[name="breadcrumb"]').replaceWith(breadcrumbDOM);
    
    // Insérer la galerie d'images
    const galleryDOM = ImageGalleryView.dom(galleryData);
    pageFragment.querySelector('slot[name="gallery"]').replaceWith(galleryDOM);
    
    // Insérer les informations produit
    const productInfoDOM = ProductInfoView.dom(productInfoData);
    pageFragment.querySelector('slot[name="productinfo"]').replaceWith(productInfoDOM);
    
    return pageFragment;
}

export function ProductDetailPage(params) {
    console.log("ProductDetailPage", params);
    return C.init(params);
}
