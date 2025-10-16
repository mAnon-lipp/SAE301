import { htmlToFragment, genericRenderer } from "../../lib/utils.js";
import template from "./template.html?raw";

export const ProductInfoView = {
  html(data) {
    // Traiter la description pour extraire les bullets
    let description = "";
    let featuresHTML = "";

    console.log("ProductInfo data:", data);
    console.log("Description brute:", data.description);

    if (data.description) {
      // Séparer par double saut de ligne pour avoir description principale + features
      const parts = data.description.split(/\r\n\r\n|\n\n/);
      console.log("Description parts:", parts);
      description = parts[0] || "";
      
      // Si il y a des parties suivantes, les splitter par simple saut de ligne
      if (parts.length > 1) {
        // Joindre toutes les parties après la première (au cas où il y aurait plusieurs doubles sauts)
        const featuresText = parts.slice(1).join('\n');
        // Splitter chaque ligne pour faire un bullet point
        const items = featuresText
          .split(/\r\n|\n/)
          .filter(line => line.trim())
          .map(line => line.trim());
        
        console.log("Feature items:", items);
        
        if (items.length > 0) {
          featuresHTML = '<ul class="text-sm text-gray-700 space-y-2">';
          items.forEach(item => {
            featuresHTML += `
              <li class="flex items-start gap-2">
                <span class="inline-block w-1 h-1 bg-black rounded-full mt-2"></span>
                <span>${item}</span>
              </li>
            `;
          });
          featuresHTML += '</ul>';
        }
      }
    }

    const renderedData = {
      name: data.name || '',
      prix: data.prix ? data.prix.toFixed(2) : '0.00',
      description: description,
      features: featuresHTML
    };
    
    console.log("Rendered data:", renderedData);

    return genericRenderer(template, renderedData);
  },

  dom(data) {
    const fragment = htmlToFragment(this.html(data));
    this.attachEvents(fragment, data);
    return fragment;
  },

  attachEvents(fragment, data) {
    let quantity = 1;
    const quantityDisplay = fragment.querySelector('[data-quantity-display]');
    
    // Gestion des boutons + et -
    fragment.querySelectorAll('[data-quantity-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.currentTarget.dataset.quantityAction;
        
        if (action === 'increase') {
          quantity++;
        } else if (action === 'decrease' && quantity > 1) {
          quantity--;
        }
        
        quantityDisplay.textContent = quantity;
      });
    });

    // Gestion du bouton ajouter au panier
    const addToCartBtn = fragment.querySelector('[data-add-to-cart]');
    addToCartBtn.addEventListener('click', () => {
      // Placeholder pour US006
      alert(`Ajouté au panier : ${quantity}x ${data.name}`);
      console.log('Add to cart:', { productId: data.id, quantity, name: data.name });
    });
  }
};
