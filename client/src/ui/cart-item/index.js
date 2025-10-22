import { htmlToFragment, genericRenderer } from "../../lib/utils.js";
import template from "./template.html?raw";

let CartItemView = {
  html: function (data) {
    // Si c'est un tableau d'items, générer le HTML pour chacun
    if (Array.isArray(data)) {
      let htmlString = '';
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        htmlString += this.renderSingleItem(item);
      }
      return htmlString;
    }
    
    // Pour un seul item
    return this.renderSingleItem(data);
  },

  renderSingleItem: function (item) {
    console.log('renderSingleItem - item reçu:', item);
    
    // Pour les produits avec variants, on doit filtrer les tailles disponibles selon la couleur
    let availableSizes = item.sizes || [];
    
    console.log('Tailles initiales (item.sizes):', availableSizes);
    console.log('item.variants existe?', !!item.variants);
    console.log('item.color:', item.color);
    
    // Si le produit a des variants et une couleur sélectionnée, filtrer les tailles
    if (item.color && item.variants && Array.isArray(item.variants) && item.variants.length > 0) {
      console.log('Filtrage des tailles pour la couleur:', item.color);
      console.log('Variants disponibles:', item.variants);
      
      // Filtrer les tailles disponibles pour la couleur sélectionnée
      availableSizes = [];
      
      item.variants.forEach(v => {
        // Les variants ont une structure avec options (array)
        if (!v.options || v.stock <= 0) return;
        
        // Extraire la couleur et la taille depuis options
        let variantColor = null;
        let variantSize = null;
        
        v.options.forEach(opt => {
          const type = opt.type.toLowerCase();
          if (type === 'color' || type === 'couleur') {
            variantColor = opt.label;
          } else if (type === 'size' || type === 'taille') {
            variantSize = opt.label || opt.value;
          }
        });
        
        console.log('Variant:', variantColor, 'vs', item.color, 'taille:', variantSize, 'stock:', v.stock);
        
        // Si la couleur correspond et il y a du stock, ajouter la taille
        if (variantColor === item.color && variantSize && !availableSizes.includes(variantSize)) {
          availableSizes.push(variantSize);
        }
      });
      
      // Trier les tailles numériquement
      availableSizes.sort((a, b) => {
        const aNum = parseInt(a);
        const bNum = parseInt(b);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return aNum - bNum;
        }
        return a.localeCompare(b);
      });
      
      console.log('Tailles filtrées disponibles pour', item.color, ':', availableSizes);
    }
    
    // Générer le dropdown de taille
    let sizeDropdownHTML = "";
    if (item.size || availableSizes.length > 0) {
      const currentSize = item.size || (availableSizes && availableSizes[0]);
      
      console.log('Génération dropdown avec tailles:', availableSizes, 'currentSize:', currentSize);
      
      sizeDropdownHTML = `
        <div class="relative inline-block">
          <select 
            class="appearance-none bg-white border-[0.5px] border-[#cfcfcf] px-2 py-1 pr-6 text-xs tracking-[1.8px] leading-[41.6px] text-[#5f6368] cursor-pointer font-sans"
            data-size-select
            style="min-width: 36px;"
          >
            ${availableSizes.map(size => `
              <option value="${size}" ${size === currentSize ? 'selected' : ''}>${size}</option>
            `).join('')}
          </select>
          <svg class="absolute right-1 top-1/2 transform -translate-y-1/2 pointer-events-none" width="6" height="11" viewBox="0 0 6 11" fill="none">
            <path d="M0.5 0.5L5.5 5.5L0.5 10.5" stroke="#5f6368" stroke-width="1"/>
          </svg>
        </div>
      `;
    } else {
      console.log('Pas de dropdown de taille généré - conditions non remplies');
    }

    // Générer le dropdown de couleur
    let colorDropdownHTML = "";
    if (item.color || (item.colors && item.colors.length > 0)) {
      const currentColor = item.color || (item.colors && item.colors[0]);
      const availableColors = item.colors || [currentColor];
      
      colorDropdownHTML = `
        <div class="relative inline-block">
          <select 
            class="appearance-none bg-white border-[0.5px] border-[#cfcfcf] px-2 py-1 pr-6 text-xs tracking-[1.8px] leading-[41.6px] text-[#5f6368] uppercase cursor-pointer font-sans"
            data-color-select
            style="min-width: 65px;"
          >
            ${availableColors.map(color => {
              const colorValue = typeof color === 'string' ? color : color.name;
              const isSelected = (typeof currentColor === 'string' ? currentColor : currentColor.name) === colorValue;
              return `<option value="${colorValue}" ${isSelected ? 'selected' : ''}>${colorValue}</option>`;
            }).join('')}
          </select>
          <svg class="absolute right-1 top-1/2 transform -translate-y-1/2 pointer-events-none" width="6" height="11" viewBox="0 0 6 11" fill="none">
            <path d="M0.5 0.5L5.5 5.5L0.5 10.5" stroke="#5f6368" stroke-width="1"/>
          </svg>
        </div>
      `;
    }

    const renderedData = {
      image: item.image || '',
      name: item.name || '',
      prix: item.prix ? item.prix.toFixed(2) : '0.00',
      quantity: item.quantity || 1,
      id: item.id || '',
      sizeDropdown: sizeDropdownHTML,
      colorDropdown: colorDropdownHTML
    };
    
    return genericRenderer(template, renderedData);
  },

  dom: function (data) {
    const fragment = htmlToFragment(this.html(data));
    this.attachEvents(fragment, data);
    return fragment;
  },

  attachEvents: function (fragment, data) {
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

  attachItemEvents: function (element, itemData) {
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

    // Gestion du dropdown de taille
    const sizeSelect = element.querySelector('[data-size-select]');
    if (sizeSelect) {
      sizeSelect.addEventListener('change', (e) => {
        const selectedSize = e.target.value;
        
        // Dispatcher un événement personnalisé pour mettre à jour la taille
        const event = new CustomEvent('cart-size-change', {
          detail: {
            itemId: itemData.id,
            size: selectedSize
          },
          bubbles: true
        });
        element.dispatchEvent(event);
      });
    }

    // Gestion du dropdown de couleur
    const colorSelect = element.querySelector('[data-color-select]');
    if (colorSelect) {
      colorSelect.addEventListener('change', (e) => {
        const selectedColor = e.target.value;
        
        // Dispatcher un événement personnalisé pour mettre à jour la couleur
        const event = new CustomEvent('cart-color-change', {
          detail: {
            itemId: itemData.id,
            color: selectedColor
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

export { CartItemView };
