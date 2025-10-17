import { ProductData } from "../../data/product.js";
import { CategoryData } from "../../data/category.js";
import { SmallCardView } from "../../ui/smallcard/index.js";
import { SideNavView } from "../../ui/sidenav/index.js";
import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";


let M = {
    allProducts: [], // Tous les produits chargés une fois (comme M.recipes dans script.js)
    products: [], // Produits filtrés actuellement affichés
    categories: [],
    selectedCategoryId: null,
    totalProductsCount: 0
};

// Filtre les produits par catégorie (comme M.filterRecipes dans script.js)
M.filterProducts = function(categoryId) {
    if (categoryId === null || categoryId === undefined || categoryId === 'all') {
        return M.allProducts;
    } else {
        return M.allProducts.filter(p => p.category == categoryId);
    }
}

// Récupère un produit par son ID (comme M.getRecipeById dans script.js)
M.getProductById = function(id) {
    for (let p of M.allProducts) {
        if (p.id == id) {
            return p;
        }
    }
    return undefined;
}


let C = {};

C.handler_clickOnProduct = function(ev){
    if (ev.target.dataset.buy!==undefined){
    if (ev.target.dataset.buy !== undefined){
        let id = ev.target.dataset.buy;
        alert(`Le produit d'identifiant ${id} ? Excellent choix !`);
    }
}

// Handler pour le bouton "Tous les produits" (comme C.handler_clickOnFilter dans script.js)
C.handler_clickAllProducts = function(ev) {
    if (ev.target.hasAttribute('data-all-products')) {
        ev.preventDefault();
        // Navigate to products page without category filter
        
        // Filtrer les produits (afficher tous)
        M.selectedCategoryId = null;
        M.products = M.filterProducts(null);
        
        // Re-render la vue des produits
        V.updateProductsView(M.products);
        V.updateSidenavSelection(null);
        
        // Mise à jour de l'URL sans recharger
        window.history.pushState({}, '', '/products');
        // Trigger route change
        window.dispatchEvent(new PopStateEvent('popstate'));
    }
}

// Handler pour les clics sur les catégories (comme C.handler_clickOnRecipe dans script.js)
C.handler_clickOnCategory = function(ev) {
    let link = ev.target.closest('[data-category-id]');
    if (link && link.dataset.categoryId !== undefined) {
        ev.preventDefault();
        let categoryId = link.dataset.categoryId;
        
        // Filtrer les produits par catégorie
        M.selectedCategoryId = categoryId;
        M.products = M.filterProducts(categoryId);
        
        // Re-render la vue des produits
        V.updateProductsView(M.products);
        V.updateSidenavSelection(categoryId);
        
        // Mise à jour de l'URL sans recharger
        window.history.pushState({}, '', `/products?category=${categoryId}`);
    }
}

C.init = async function(categoryId = null){
    M.selectedCategoryId = categoryId;
    
    // Fetch categories
    // Charger TOUS les produits une seule fois
    M.allProducts = await ProductData.fetchAll();
    M.categories = await CategoryData.fetchAll();

    // Fetch products based on category filter
    if (categoryId) {
        M.products = await ProductData.fetchByCategory(categoryId);
    } else {
        M.products = await ProductData.fetchAll();
    }
    
    // Filtrer selon la catégorie initiale (depuis l'URL)
    M.selectedCategoryId = categoryId;
    M.products = M.filterProducts(categoryId);
    M.totalProductsCount = M.products.length;

    return V.init(M.products, M.categories, M.selectedCategoryId, M.totalProductsCount);
@@ -91,19 +134,62 @@
   return pageFragment;
}

// Met à jour uniquement la grille de produits (comme V.renderRecipe dans script.js)
V.updateProductsView = function(products) {
    let productCount = products.length;
    
    // Mettre à jour le compteur
    let countElement = document.querySelector('[data-product-count]');
    if (countElement) {
        countElement.textContent = `${productCount} PRODUIT${productCount > 1 ? 'S' : ''}`;
    }
    
    // Générer le nouveau HTML des produits
    let productsDOM = SmallCardView.dom(products);
    
    // Trouver le conteneur <main> et remplacer son contenu
    let mainElement = document.querySelector('.max-w-\\[1440px\\] main');
    if (mainElement) {
        // Vider le conteneur
        while (mainElement.firstChild) {
            mainElement.removeChild(mainElement.firstChild);
        }
        // Ajouter le nouveau contenu
        mainElement.appendChild(productsDOM);
    }
}

// Met à jour la sélection visuelle dans la sidenav
V.updateSidenavSelection = function(selectedCategoryId) {
    // Retirer le soulignement de tous les liens
    const categoryLinks = document.querySelectorAll('[data-category-id]');
    categoryLinks.forEach(link => {
        link.classList.remove('underline');
    });
    
    // Ajouter le soulignement à la catégorie sélectionnée
    if (selectedCategoryId) {
        const selectedLink = document.querySelector(`[data-category-id="${selectedCategoryId}"]`);
        if (selectedLink) {
            selectedLink.classList.add('underline');
        }
    }
}

V.attachEvents = function(pageFragment) {
    let root = pageFragment.firstElementChild;
    root.addEventListener("click", C.handler_clickOnProduct);
    root.addEventListener("click", C.handler_clickAllProducts);
    root.addEventListener("click", C.handler_clickOnCategory);
    return pageFragment;
}

export function ProductsPage(params) {
    console.log("ProductsPage", params);

    // Get category from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category');

    return C.init(categoryId);
}
