import { htmlToFragment, genericRenderer } from "../../lib/utils.js";
import template from "./template.html?raw";

export const ProductInfoView = {
  html(data) {
    // Traiter la description pour extraire les bullets
    let description = "";
    let featuresHTML = "";

  // debug logs removed

    if (data.description) {
      // Séparer par double saut de ligne pour avoir description principale + features
      const parts = data.description.split(/\r\n\r\n|\n\n/);
  // debug logs removed
      description = parts[0] || "";
      
      // Si il y a des parties suivantes, les splitter par simple saut de ligne
      if (parts.length > 1) {
        // Joindre toutes les parties après la première (au cas où il y aurait plusieurs doubles sauts)
        const featuresText = parts.slice(1).join('\n');
        // Splitter chaque ligne pour faire un bullet point (sans utiliser .map)
        const rawLines = featuresText.split(/\r\n|\n/);
        const items = [];
        for (let i = 0; i < rawLines.length; i++) {
          const line = rawLines[i].trim();
          if (line) {
            items.push(line);
          }
        }
        
  // debug logs removed
        
        if (items.length > 0) {
          featuresHTML = '<ul class="text-sm text-gray-700 space-y-2">';
          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            featuresHTML += `
              <li class="flex items-start gap-2">
                <span class="inline-block w-1 h-1 bg-black rounded-full mt-2"></span>
                <span>${item}</span>
              </li>
            `;
          }
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
    
  // debug logs removed

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
    const qtyButtons = fragment.querySelectorAll('[data-quantity-action]');
    for (let i = 0; i < qtyButtons.length; i++) {
      const btn = qtyButtons[i];
      btn.addEventListener('click', (e) => {
        const action = e.currentTarget.dataset.quantityAction;
        
        if (action === 'increase') {
          quantity++;
        } else if (action === 'decrease' && quantity > 1) {
          quantity--;
        }
        
        quantityDisplay.textContent = quantity;
      });
    }

    // Gestion du bouton ajouter au panier
    const addToCartBtn = fragment.querySelector('[data-add-to-cart]');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => {
        // Placeholder pour US006
        alert(`Ajouté au panier : ${quantity}x ${data.name}`);
  // debug logs removed
      });
    }
  }
};
