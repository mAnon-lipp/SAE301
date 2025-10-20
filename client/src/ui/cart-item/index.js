import { htmlToFragment, genericRenderer } from "../../lib/utils.js";
import template from "./template.html?raw";

export const CartItemView = {
  html(data) {
    // Si c'est un tableau d'items, générer le HTML pour chacun
    if (Array.isArray(data)) {
      let htmlString = '';
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const renderedData = {
          image: item.image || '',
          name: item.name || '',
          prix: item.prix ? item.prix.toFixed(2) : '0.00',
          quantity: item.quantity || 1,
          id: item.id || ''
        };
        htmlString += genericRenderer(template, renderedData);
      }
      return htmlString;
    }
    
    // Pour un seul item
    const renderedData = {
      image: data.image || '',
      name: data.name || '',
      prix: data.prix ? data.prix.toFixed(2) : '0.00',
      quantity: data.quantity || 1,
      id: data.id || ''
    };
    
    return genericRenderer(template, renderedData);
  },

  dom(data) {
    const fragment = htmlToFragment(this.html(data));
    this.attachEvents(fragment, data);
    return fragment;
  },

  attachEvents(fragment, data) {
    // Si c'est un tableau, attacher les événements pour chaque item en utilisant data-cart-item
    if (Array.isArray(data)) {
      const itemElements = fragment.querySelectorAll('[data-cart-item]');
      for (let i = 0; i < itemElements.length; i++) {
        const itemElement = itemElements[i];
        const itemDatum = data[i];
        this.attachItemEvents(itemElement, itemDatum);
      }
    } else {
      // Pour un seul item: trouver l'élément data-cart-item ou utiliser le fragment
      const itemElement = fragment.querySelector('[data-cart-item]') || fragment;
      this.attachItemEvents(itemElement, data);
    }
  },

  attachItemEvents(element, itemData) {
    // Synchroniser la quantité initiale depuis itemData (ou depuis CartModel si présent)
    let quantity = itemData && itemData.quantity ? itemData.quantity : 1;
    const quantityDisplay = element.querySelector('[data-quantity-display]');
    if (quantityDisplay) quantityDisplay.textContent = quantity;
    
    // Gestion des boutons + et -
    const qtyButtons = element.querySelectorAll('[data-quantity-action]');
    for (let i = 0; i < qtyButtons.length; i++) {
      const btn = qtyButtons[i];
      btn.addEventListener('click', (e) => {
        const action = e.currentTarget.dataset.quantityAction;
        
        if (action === 'increase') {
          quantity++;
        } else if (action === 'decrease') {
          quantity--;
        }

        // Si quantity est <= 0 -> supprimer l'item
        if (quantity <= 0) {
          const removeEvent = new CustomEvent('cart-item-remove', {
            detail: { itemId: itemData.id },
            bubbles: true
          });
          element.dispatchEvent(removeEvent);
          return;
        }

        // Mettre à jour l'affichage
        if (quantityDisplay) quantityDisplay.textContent = quantity;

        // Dispatcher un événement personnalisé pour mettre à jour le panier
        const event = new CustomEvent('cart-quantity-change', {
          detail: {
            itemId: itemData.id,
            quantity: quantity
          },
          bubbles: true
        });
        element.dispatchEvent(event);
      });
    }

    // Gestion du bouton retirer
    const removeBtn = element.querySelector('[data-remove-item]');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        // Dispatcher un événement personnalisé pour retirer l'item
        const event = new CustomEvent('cart-item-remove', {
          detail: {
            itemId: itemData.id
          },
          bubbles: true
        });
        element.dispatchEvent(event);
      });
    }
  }
};
