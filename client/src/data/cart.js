import { ProductData } from "./product.js";

const STORAGE_KEY = 'app_cart';

let CartModel = {
    /**
     * @type {Array<{id: number, quantity: number, name: string, prix: number, image: string}>}
     */
    items: [],

    load() {
        try {
            const storedCart = localStorage.getItem(STORAGE_KEY);
            this.items = storedCart ? JSON.parse(storedCart) : [];
        } catch (e) {
            console.error("Erreur de chargement du panier local:", e);
            this.items = [];
        }
    },

    save() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
            this.updateGlobalCount();
        } catch (e) {
            console.error("Erreur de sauvegarde du panier local:", e);
        }
    },

    async addItem(productId, quantity = 1) {
        // Récupérer les données complètes du produit
        try {
            const productData = (await ProductData.fetch(productId))[0];
            if (!productData) {
                console.error(`Produit ID ${productId} non trouvé.`);
                return false;
            }

            const existingItem = this.items.find(item => item.id == productId);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                this.items.push({
                    id: productData.id,
                    name: productData.name,
                    prix: productData.prix,
                    image: productData.image,
                    quantity: quantity
                });
            }

            this.save();
            return true;
        } catch (e) {
            console.error('Erreur lors de addItem:', e);
            return false;
        }
    },

    setQuantity(itemId, quantity) {
        const item = this.items.find(i => i.id == itemId);
        if (!item) return;
        if (quantity < 1) {
            // retirer l'item si la quantité tombe à 0
            this.removeItem(itemId);
            return;
        }
        item.quantity = quantity;
        this.save();
    },

    removeItem(itemId) {
        this.items = this.items.filter(item => item.id != itemId);
        this.save();
    },

    getTotal() {
        return this.items.reduce((total, item) => total + (item.prix * item.quantity), 0);
    },

    updateGlobalCount() {
        const totalItems = this.items.reduce((count, item) => count + item.quantity, 0);
        const countElement = document.querySelector('[data-cart-count]');
        if (countElement) {
            countElement.textContent = totalItems > 99 ? '99+' : totalItems;
            countElement.classList.toggle('hidden', totalItems === 0);
        }
    }
};

// Charge le panier au moment de l'import
CartModel.load();

export { CartModel };
