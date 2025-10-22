import { ProductData } from "./product.js";

const STORAGE_KEY = 'app_cart';

let CartModel = {
    /**
     * @type {Array<{id: number, productId: number, variantId: number|null, quantity: number, name: string, prix: number, image: string, size: string|null, color: string|null, sizes: Array|null, colors: Array|null}>}
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

    async addItem(productId, quantity = 1, variantData = null) {
        // Récupérer les données complètes du produit
        try {
            const productData = (await ProductData.fetch(productId))[0];
            if (!productData) {
                console.error(`Produit ID ${productId} non trouvé.`);
                return false;
            }

            // Si un variant est fourni, chercher l'item correspondant au variant_id
            // Sinon chercher par product_id (pour produits sans variants)
            const itemKey = variantData && variantData.variantId 
                ? variantData.variantId 
                : productId;
            
            const existingItem = this.items.find(item => {
                if (variantData && variantData.variantId) {
                    return item.variantId == variantData.variantId;
                } else {
                    return item.productId == productId && !item.variantId;
                }
            });

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                // Extraire sizes et colors du produit pour le dropdown
                let sizes = null;
                let colors = null;
                let variants = null;
                
                if (productData.variants && productData.variants.length > 0) {
                    const { VariantData } = await import('./variant.js');
                    sizes = VariantData.extractSizes(productData.variants);
                    colors = VariantData.extractColors(productData.variants);
                    variants = productData.variants; // Stocker les variants complets
                }
                
                const newItem = {
                    id: itemKey, // ID unique pour le cart item
                    productId: productData.id,
                    variantId: variantData?.variantId || null,
                    name: productData.name,
                    prix: variantData?.variantId && productData.variants 
                        ? productData.variants.find(v => v.id == variantData.variantId)?.price || productData.prix
                        : productData.prix,
                    image: productData.image,
                    quantity: quantity,
                    size: variantData?.size || null,
                    color: variantData?.color || null,
                    sizes: sizes,
                    colors: colors,
                    variants: variants // Ajouter les variants complets
                };
                
                this.items.push(newItem);
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

    /**
     * Met à jour les options (size ou color) d'un item du panier
     * et recalcule le prix basé sur le nouveau variant
     */
    async updateItemOptions(itemId, newSize, newColor) {
        const item = this.items.find(i => i.id == itemId);
        if (!item) return false;

        try {
            // Charger les variants du produit
            const { VariantData } = await import('./variant.js');
            const productData = (await ProductData.fetch(item.productId))[0];
            
            if (!productData || !productData.variants) {
                console.error('Pas de variants disponibles pour ce produit');
                return false;
            }

            // Chercher le variant correspondant aux nouvelles options
            const newVariant = VariantData.findByOptions(productData.variants, {
                size: newSize || item.size,
                color: newColor || item.color
            });

            if (!newVariant) {
                console.error('Variant non trouvé pour ces options');
                return false;
            }

            // Vérifier le stock
            if (newVariant.stock < item.quantity) {
                alert(`Seulement ${newVariant.stock} article(s) disponible(s) pour ces options.`);
                return false;
            }

            // Mettre à jour l'item
            item.variantId = newVariant.id;
            item.size = newSize || item.size;
            item.color = newColor || item.color;
            item.prix = newVariant.price;
            item.id = newVariant.id; // Mettre à jour l'ID unique
            item.variants = productData.variants; // Mettre à jour les variants complets

            this.save();
            return true;
        } catch (e) {
            console.error('Erreur lors de updateItemOptions:', e);
            return false;
        }
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
