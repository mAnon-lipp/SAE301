import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import "./style.css";
import { CartModel } from "../../data/cart.js";
import { CartItemView } from "../cart-item/index.js";

let CartPanelView = {
  html: function () {
    return template;
  },

  dom: function () {
    const fragment = htmlToFragment(template);
    this.updatePanel(fragment);
    this.attachEvents(fragment);
    return fragment;
  },

  updatePanel(root) {
    const itemsContainer = root.querySelector('[data-cart-items]');
    const totalElement = root.querySelector('[data-cart-total]');
    if (!itemsContainer || !totalElement) return;

    itemsContainer.innerHTML = '';
    const items = CartModel.items;
    if (!items || items.length === 0) {
      itemsContainer.innerHTML = `\n        <div class="cart-panel__empty">Votre panier est vide.</div>\n      `;
      totalElement.textContent = '$0.00';
      return;
    }

    // Générer les CartItemViews
    const itemsFragment = CartItemView.dom(items);
    itemsContainer.appendChild(itemsFragment);

    // Mettre à jour le total
    totalElement.textContent = `$${CartModel.getTotal().toFixed(2)}`;
  },

  attachEvents(fragment) {
    const panel = fragment.querySelector('[data-cart-panel]');

    // Fermeture du panneau
    const closeButton = fragment.querySelector('[data-close-cart]');
    if (closeButton) {
      closeButton.addEventListener('click', () => this.close());
    }

    // Délégation des événements custom depuis CartItemView
    if (panel) {
      panel.addEventListener('cart-quantity-change', (e) => {
        const { itemId, quantity } = e.detail;
        
        // US010 - Vérifier le stock avant de mettre à jour la quantité
        const item = CartModel.items.find(i => i.id == itemId);
        if (item && item.variants) {
          // Trouver le variant correspondant
          const selectedVariant = item.variants.find(v => {
            if (!v.options) return false;
            
            let matchSize = !item.size;
            let matchColor = !item.color;
            
            v.options.forEach(opt => {
              const type = opt.type.toLowerCase();
              if ((type === 'size' || type === 'taille') && item.size) {
                matchSize = (opt.label || opt.value) === item.size;
              }
              if ((type === 'color' || type === 'couleur') && item.color) {
                matchColor = opt.label === item.color;
              }
            });
            
            return matchSize && matchColor;
          });
          
          // Si la quantité demandée dépasse le stock, ajuster automatiquement
          if (selectedVariant && quantity > selectedVariant.stock) {
            alert(`⚠️ Stock limité !\n\n` +
                  `Stock disponible : ${selectedVariant.stock}\n\n` +
                  `Quantité ajustée automatiquement à ${selectedVariant.stock}.`);
            CartModel.setQuantity(itemId, selectedVariant.stock);
            this.updatePanel(panel);
            return;
          }
        }
        
        CartModel.setQuantity(itemId, quantity);
        this.updatePanel(panel);
      });

      panel.addEventListener('cart-item-remove', (e) => {
        const { itemId } = e.detail;
        CartModel.removeItem(itemId);
        this.updatePanel(panel);
      });

      // Gestion du changement de taille
      panel.addEventListener('cart-size-change', async (e) => {
        const { itemId, size } = e.detail;
        const item = CartModel.items.find(i => i.id == itemId);
        if (item) {
          const success = await CartModel.updateItemOptions(itemId, size, item.color);
          if (success) {
            this.updatePanel(panel);
          }
        }
      });

      // Gestion du changement de couleur
      panel.addEventListener('cart-color-change', async (e) => {
        const { itemId, color } = e.detail;
        const item = CartModel.items.find(i => i.id == itemId);
        if (item) {
          const success = await CartModel.updateItemOptions(itemId, item.size, color);
          if (success) {
            this.updatePanel(panel);
          }
        }
      });
    }

    const checkoutBtn = fragment.querySelector('[data-checkout]');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        // US010 - Vérifier les stocks avant de passer au checkout
        let stockError = false;
        
        for (let i = 0; i < CartModel.items.length; i++) {
          const item = CartModel.items[i];
          
          // Si le produit a des variants, vérifier le stock
          if (item.variants && item.variants.length > 0) {
            // Trouver le variant correspondant
            const selectedVariant = item.variants.find(v => {
              if (!v.options) return false;
              
              let matchSize = !item.size;
              let matchColor = !item.color;
              
              v.options.forEach(opt => {
                const type = opt.type.toLowerCase();
                if ((type === 'size' || type === 'taille') && item.size) {
                  matchSize = (opt.label || opt.value) === item.size;
                }
                if ((type === 'color' || type === 'couleur') && item.color) {
                  matchColor = opt.label === item.color;
                }
              });
              
              return matchSize && matchColor;
            });
            
            // Vérifier si la quantité demandée dépasse le stock
            if (selectedVariant && item.quantity > selectedVariant.stock) {
              alert(`⚠️ Quantité demandée supérieure au stock disponible !\n\n` +
                    `Article : ${item.name}\n` +
                    `Quantité demandée : ${item.quantity}\n` +
                    `Stock disponible : ${selectedVariant.stock}\n\n` +
                    `Veuillez réduire la quantité dans votre panier.`);
              stockError = true;
              break;
            }
            
            // Vérifier si le produit est épuisé
            if (selectedVariant && selectedVariant.stock <= 0) {
              alert(`⚠️ Article épuisé !\n\n` +
                    `Article : ${item.name}\n\n` +
                    `Cet article n'est plus disponible.\n` +
                    `Veuillez le retirer de votre panier.`);
              stockError = true;
              break;
            }
          }
        }
        
        // Si erreur de stock, ne pas continuer
        if (stockError) {
          return;
        }
        
        // Fermer le panneau du panier
        this.close();
        // Naviguer vers la page de checkout
        window.history.pushState(null, null, '/checkout');
        window.dispatchEvent(new PopStateEvent('popstate'));
      });
    }
  },

  open() {
    const panel = document.querySelector('[data-cart-panel]');
    const overlay = document.querySelector('[data-cart-overlay]');

    if (panel && overlay) {
      panel.classList.remove('translate-x-full');
      overlay.classList.remove('hidden');
      this.updatePanel(panel);
    }
  },

  close() {
    const panel = document.querySelector('[data-cart-panel]');
    const overlay = document.querySelector('[data-cart-overlay]');

    if (panel && overlay) {
      panel.classList.add('translate-x-full');
      overlay.classList.add('hidden');
    }
  }
};

export { CartPanelView };
