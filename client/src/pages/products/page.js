import { ProductData } from "../../data/product.js";
import { CategoryData } from "../../data/category.js";
import { SmallCardView } from "../../ui/smallcard/index.js";
import { SideNavView } from "../../ui/sidenav/index.js";
import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";


let M = {
    products: [],
    categories: [],
    selectedCategoryId: null,
    totalProductsCount: 0
};


let C = {};

C.handler_clickOnProduct = function(ev){
    if (ev.target.dataset.buy!==undefined){
        let id = ev.target.dataset.buy;
        alert(`Le produit d'identifiant ${id} ? Excellent choix !`);
    }
}

C.handler_clickAllProducts = function(ev) {
    if (ev.target.hasAttribute('data-all-products')) {
        ev.preventDefault();
        // Navigate to products page without category filter
        window.history.pushState({}, '', '/products');
        // Trigger route change
        window.dispatchEvent(new PopStateEvent('popstate'));
    }
}

C.init = async function(categoryId = null){
    M.selectedCategoryId = categoryId;
    
    // Fetch categories
    M.categories = await CategoryData.fetchAll();
    
    // Fetch products based on category filter
    if (categoryId) {
        M.products = await ProductData.fetchByCategory(categoryId);
    } else {
        M.products = await ProductData.fetchAll();
    }
    
    M.totalProductsCount = M.products.length;
    
    return V.init(M.products, M.categories, M.selectedCategoryId, M.totalProductsCount);
}


let V = {};

V.init = function(products, categories, selectedCategoryId, productCount){
    let fragment = V.createPageFragment(products, categories, selectedCategoryId, productCount);
    V.attachEvents(fragment);
    return fragment;
}

V.createPageFragment = function(products, categories, selectedCategoryId, productCount){
   // Créer le fragment depuis le template
   let pageFragment = htmlToFragment(template);
   
   // Update product count
   let countElement = pageFragment.querySelector('[data-product-count]');
   if (countElement) {
       countElement.textContent = `${productCount} PRODUIT${productCount > 1 ? 'S' : ''}`;
   }
   
   // Générer la sidenav
   let sidenavDOM = SideNavView.dom(categories, selectedCategoryId);
   let sidenavSlot = pageFragment.querySelector('slot[name="sidenav"]');
   if (sidenavSlot) {
       sidenavSlot.replaceWith(sidenavDOM);
       // Attach sidenav events after inserting it
       let sidenavElement = pageFragment.querySelector('.flex.flex-col.gap-\\[8px\\]');
       if (sidenavElement) {
           SideNavView.attachEvents(sidenavElement);
       }
   }
   
   // Générer les produits avec SmallCardView
   let productsDOM = SmallCardView.dom(products);
   
   // Remplacer le slot par les produits
   pageFragment.querySelector('slot[name="products"]').replaceWith(productsDOM);
   
   return pageFragment;
}

V.attachEvents = function(pageFragment) {
    let root = pageFragment.firstElementChild;
    root.addEventListener("click", C.handler_clickOnProduct);
    root.addEventListener("click", C.handler_clickAllProducts);
    return pageFragment;
}

export function ProductsPage(params) {
    console.log("ProductsPage", params);
    
    // Get category from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category');
    
    return C.init(categoryId);
}
