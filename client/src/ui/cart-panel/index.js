import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
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
      itemsContainer.innerHTML = `\n        <div class="text-center py-12 text-lg text-muted">Votre panier est vide.</div>\n      `;
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
