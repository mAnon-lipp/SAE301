import { ProductData } from "../../data/product.js";
import { ProductImageData } from "../../data/productImage.js";
import { VariantData } from "../../data/variant.js";
import { OptionValueImageData } from "../../data/optionValueImage.js";
import { htmlToFragment } from "../../lib/utils.js";
import { BreadcrumbView } from "../../ui/breadcrumb/index.js";
import { ImageGalleryView } from "../../ui/imagegallery/index.js";
import { ProductInfoView } from "../../ui/productinfo/index.js";
import template from "./template.html?raw";


let M = {
    products: [],
    productImages: [],
    variants: [],
    optionValueImages: {} // Images par option_value_id
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
    
    // Charger les variants du produit (si disponibles dans product.variants ou via API)
    if (product.variants && product.variants.length > 0) {
        M.variants = product.variants;
    } else {
        // Fallback: charger depuis l'API variants si non inclus
        M.variants = await VariantData.fetchByProductId(productId);
    }
    
    // Charger les images par option (couleurs)
    try {
        M.optionValueImages = await OptionValueImageData.fetchByProductId(productId);
    } catch (error) {
        console.warn("Impossible de charger les images d'options:", error);
        M.optionValueImages = {}; // Tableau vide par défaut
    }
    
    return V.init(product, M.productImages, M.variants, M.optionValueImages);
}


let V = {};

V.init = function(data, productImages = [], variants = [], optionValueImages = {}) {
    let fragment = V.createPageFragment(data, productImages, variants, optionValueImages);
    return fragment;
}

V.createPageFragment = function(data, productImages = [], variants = [], optionValueImages = {}) {
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
    
    // Déterminer la première couleur disponible
    let firstColor = null;
    let firstColorOptionValueId = null;
    
    if (variants && variants.length > 0) {
        const colors = VariantData.extractColors(variants);
        if (colors && colors.length > 0) {
            firstColor = colors[0];
            firstColorOptionValueId = firstColor.optionValueId;
        }
    }
    
    // Vérifier s'il y a des images pour la première couleur
    const hasColorImages = firstColorOptionValueId && 
                          optionValueImages[firstColorOptionValueId] && 
                          optionValueImages[firstColorOptionValueId].length > 0;
    
    if (hasColorImages) {
        // Utiliser les images de la première couleur
        const colorImages = optionValueImages[firstColorOptionValueId];
        for (let k = 0; k < colorImages.length; k++) {
            const img = colorImages[k];
            const imageUrl = normalizeImagePath(img.image_path || img.image || img.image_url);
            images.push({ url: imageUrl, alt: `${data.name} - ${firstColor.name}` });
        }
    } else {
        // Fallback : utiliser l'image principale du produit et les ProductImages
        if (data.image) {
            const imageUrl = normalizeImagePath(data.image);
            images.push({ url: imageUrl, alt: data.name });
        }
        
        // Ajouter les images de la galerie ProductImage
        if (productImages && productImages.length > 0) {
            for (let k = 0; k < productImages.length; k++) {
                const img = productImages[k];
                const imageUrl = normalizeImagePath(img.image_path || img.image || img.image_url);
                images.push({ url: imageUrl, alt: data.name });
            }
        }
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
        description: data.description || '',
        variants: variants, // Passer les variants au composant
        optionValueImages: optionValueImages // Passer les images par option
    };
    
    // Extraire les options si des variants existent
    if (variants && variants.length > 0) {
        productInfoData.sizes = VariantData.extractSizes(variants);
        productInfoData.colors = VariantData.extractColors(variants);
    }
    
    // Insérer le breadcrumb
    const breadcrumbDOM = BreadcrumbView.dom();
    pageFragment.querySelector('slot[name="breadcrumb"]').replaceWith(breadcrumbDOM);
    
    // Insérer la galerie d'images
    const galleryDOM = ImageGalleryView.dom(galleryData);
    pageFragment.querySelector('slot[name="gallery"]').replaceWith(galleryDOM);
    
    // Insérer les informations produit
    // Passer le pageFragment entier pour permettre la recherche des éléments de la galerie
    const productInfoDOM = ProductInfoView.dom(productInfoData, pageFragment);
    pageFragment.querySelector('slot[name="productinfo"]').replaceWith(productInfoDOM);
    
    return pageFragment;
}

export function ProductDetailPage(params) {
    return C.init(params);
}
