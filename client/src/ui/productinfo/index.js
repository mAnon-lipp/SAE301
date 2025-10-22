import { htmlToFragment, genericRenderer } from "../../lib/utils.js";
import { VariantData } from "../../data/variant.js";
import template from "./template.html?raw";

let ProductInfoView = {
  html: function (data) {
    // Traiter la description pour extraire les bullets
    let description = "";
    let featuresHTML = "";

    if (data && data.description) {
      // Séparer par double saut de ligne pour avoir description principale + features
      const parts = data.description.split(/\r\n\r\n|\n\n/);
      description = parts[0] || "";
      
      // Si il y a des parties suivantes, les splitter par simple saut de ligne
      if (parts.length > 1) {
        // Joindre toutes les parties après la première (au cas où il y aurait plusieurs doubles sauts)
        const featuresText = parts.slice(1).join('\n');
        // Splitter chaque ligne pour faire un bullet point
        const rawLines = featuresText.split(/\r\n|\n/);
        const items = [];
        for (let i = 0; i < rawLines.length; i++) {
          const line = rawLines[i].trim();
          if (line) items.push(line);
        }

        if (items.length > 0) {
          featuresHTML = '<ul class="text-sm text-gray-700 space-y-2">';
          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            featuresHTML += `\n              <li class="flex items-start gap-2">\n                <span class="inline-block w-1 h-1 bg-black mt-2"></span>\n                <span>${item}</span>\n              </li>\n            `;
          }
          featuresHTML += '</ul>';
        }
      }
    }

    // Générer le sélecteur de taille (ne générer que le conteneur, les tailles seront ajoutées dynamiquement)
    let sizeSelectorHTML = "";
    if (data && data.variants && data.variants.length > 0) {
      sizeSelectorHTML = `
        <div class="flex flex-col gap-3">
          <label class="text-sm text-black">Shoe size:</label>
          <div class="flex flex-wrap gap-2" data-size-selector>
            <!-- Les tailles seront insérées dynamiquement en fonction de la couleur sélectionnée -->
          </div>
        </div>
      `;
    }

    // Générer le sélecteur de couleur (si des couleurs sont disponibles)
    let colorSelectorHTML = "";
    if (data && data.colors && data.colors.length > 0) {
      // On prend la première couleur comme sélectionnée par défaut
      const defaultColor = data.colors[0];
      
      colorSelectorHTML = `
        <div class="flex flex-col gap-3">
          <div class="text-sm text-black">
            Color : <span data-selected-color-name>${defaultColor.name}</span>
          </div>
          <div class="flex gap-3" data-color-selector>
            ${data.colors.map((color, index) => `
              <button 
                class="color-option w-10 h-10 border border-black flex items-center justify-center transition-all ${index === 0 ? 'ring-2 ring-black ring-offset-2' : ''}"
                data-color-name="${color.name}"
                data-color-hex="${color.code}"
                data-option-value-id="${color.optionValueId || ''}"
                style="background-color: ${color.code};"
                aria-label="${color.name}"
              >
              </button>
            `).join('')}
          </div>
        </div>
      `;
    }

    const renderedData = {
      name: (data && data.name) || '',
      prix: data && data.prix ? data.prix.toFixed(2) : '0.00',
      description: description,
      features: featuresHTML,
      sizeSelector: sizeSelectorHTML,
      colorSelector: colorSelectorHTML
    };

    return genericRenderer(template, renderedData);
  },

  dom: function (data, pageFragment = null) {
    const fragment = htmlToFragment(this.html(data));
    this.attachEvents && this.attachEvents(fragment, data, pageFragment);
    return fragment;
  },

  attachEvents: function (fragment, data, pageFragment = null) {
    let quantity = 1;
    let selectedSize = null;
    let selectedColor = null;
    let selectedVariant = null;
    let basePrice = (data && data.prix) || 0;
    
    const quantityDisplay = fragment.querySelector('[data-quantity-display]');
    const priceDisplay = fragment.querySelector('[data-price]');
    
    // Stocker la référence au sizeSelector pour l'utiliser plus tard
    const sizeSelector = fragment.querySelector('[data-size-selector]');
    
    // Fonction pour mettre à jour le prix et la disponibilité
    const updateVariantInfo = () => {
      if (!data.variants || data.variants.length === 0) {
        // Pas de variants, utiliser les données de base
        return;
      }
      
      // Chercher le variant correspondant aux options sélectionnées
      const options = {};
      if (selectedSize) options.size = selectedSize;
      if (selectedColor) {
        options.color = selectedColor; // selectedColor contient maintenant directement le nom
      }
      
      selectedVariant = VariantData.findByOptions(data.variants, options);
      
      if (selectedVariant) {
        // Mettre à jour le prix si le variant a un prix spécifique
        if (selectedVariant.price && priceDisplay) {
          priceDisplay.textContent = selectedVariant.price.toFixed(2);
        }
      }
    };
    
    // Fonction pour mettre à jour les tailles disponibles en fonction de la couleur sélectionnée
    const updateAvailableSizes = () => {
      console.log('📍 updateAvailableSizes appelée');
      if (!data.variants || data.variants.length === 0) return;
      
      if (!sizeSelector) {
        console.log('❌ sizeSelector introuvable');
        return;
      }
      
      console.log('🔍 Couleur sélectionnée:', selectedColor);
      
      // Obtenir les tailles disponibles pour la couleur sélectionnée
      const availableSizes = selectedColor 
        ? VariantData.getAvailableOptions(data.variants, { color: selectedColor }, 'size')
        : [];
      
      console.log('📏 Tailles disponibles:', availableSizes);
      
      // Vider le conteneur
      sizeSelector.innerHTML = '';
      
      // Créer les boutons de taille uniquement pour les tailles disponibles (en stock)
      availableSizes.forEach(size => {
        const btn = document.createElement('button');
        btn.className = 'size-option w-9 h-9 border border-black flex items-center justify-center text-sm hover:bg-gray-100 transition-colors';
        btn.dataset.size = size;
        btn.textContent = size;
        
        // Si c'était la taille sélectionnée précédemment, la réappliquer
        if (selectedSize === size) {
          btn.classList.add('bg-black', 'text-white');
        }
        
        // Ajouter l'event listener
        btn.addEventListener('click', (e) => {
          // Retirer la sélection de tous les boutons
          const allSizeButtons = sizeSelector.querySelectorAll('.size-option');
          allSizeButtons.forEach(b => b.classList.remove('bg-black', 'text-white'));
          
          // Ajouter la sélection au bouton cliqué
          e.currentTarget.classList.add('bg-black', 'text-white');
          selectedSize = e.currentTarget.dataset.size;
          
          // Mettre à jour le variant
          updateVariantInfo();
        });
        
        sizeSelector.appendChild(btn);
      });
      
      // Si la taille sélectionnée n'est plus disponible, la déselectionner
      if (selectedSize && !availableSizes.includes(selectedSize)) {
        selectedSize = null;
        updateVariantInfo();
      }
    };
    
    // Fonction pour désactiver les options non disponibles
    const updateAvailableOptions = () => {
      if (!data.variants || data.variants.length === 0) return;
      
      const colorButtons = fragment.querySelectorAll('.color-option');
      
      // Mettre à jour les couleurs disponibles si une taille est sélectionnée
      if (selectedSize) {
        const availableColors = VariantData.getAvailableOptions(
          data.variants,
          { size: selectedSize },
          'color'
        );
        
        for (let i = 0; i < colorButtons.length; i++) {
          const btn = colorButtons[i];
          const colorName = btn.dataset.colorName;
          if (availableColors.includes(colorName)) {
            btn.disabled = false;
            btn.classList.remove('opacity-50', 'cursor-not-allowed');
          } else {
            btn.disabled = true;
            btn.classList.add('opacity-50', 'cursor-not-allowed');
          }
        }
      } else {
        // Si aucune taille n'est sélectionnée, toutes les couleurs sont disponibles
        for (let i = 0; i < colorButtons.length; i++) {
          colorButtons[i].disabled = false;
          colorButtons[i].classList.remove('opacity-50', 'cursor-not-allowed');
        }
      }
    };
    
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
        
        if (quantityDisplay) quantityDisplay.textContent = quantity;
      });
    }

    // Gestion de la sélection de couleur
    const colorButtons = fragment.querySelectorAll('.color-option');
    const colorNameDisplay = fragment.querySelector('[data-selected-color-name]');
    
    // Initialiser la première couleur comme sélectionnée
    if (colorButtons.length > 0) {
      selectedColor = colorButtons[0].dataset.colorName;
      // Mettre à jour les tailles disponibles pour cette couleur
      updateAvailableSizes();
      updateVariantInfo();
      updateAvailableOptions();
    }
    
    for (let i = 0; i < colorButtons.length; i++) {
      const btn = colorButtons[i];
      btn.addEventListener('click', (e) => {
        // Retirer la sélection de tous les boutons
        for (let j = 0; j < colorButtons.length; j++) {
          colorButtons[j].classList.remove('ring-2', 'ring-black', 'ring-offset-2');
        }
        
        // Ajouter la sélection au bouton cliqué
        e.currentTarget.classList.add('ring-2', 'ring-black', 'ring-offset-2');
        selectedColor = e.currentTarget.dataset.colorName;
        
        console.log('🎨 Changement de couleur vers:', selectedColor);
        
        // Mettre à jour le nom de la couleur
        if (colorNameDisplay) {
          colorNameDisplay.textContent = e.currentTarget.dataset.colorName;
        }
        
        // Mettre à jour les tailles disponibles pour cette nouvelle couleur
        console.log('🔄 Appel de updateAvailableSizes()');
        updateAvailableSizes();
        
        // Mettre à jour le variant et les options
        updateVariantInfo();
        updateAvailableOptions();
        
        // Changer les images de la galerie si disponibles pour cette couleur
        if (data.optionValueImages) {
          const optionValueId = e.currentTarget.dataset.optionValueId;
          console.log('Changing images for option_value_id:', optionValueId);
          console.log('Available images:', data.optionValueImages);
          
          if (optionValueId && data.optionValueImages[optionValueId]) {
            const images = data.optionValueImages[optionValueId];
            console.log('Images for this color:', images);
            
            if (images && images.length > 0) {
              // Mettre à jour l'image principale
              const mainImg = document.querySelector('[data-main-image]');
              if (mainImg) {
                const imagePath = images[0].image_path.startsWith('/') ? images[0].image_path : '/' + images[0].image_path;
                console.log('Setting main image to:', imagePath);
                mainImg.src = imagePath;
              } else {
                console.warn('Main image element not found');
              }
              
              // Reconstruire complètement les thumbnails
              const thumbnailContainer = document.querySelector('.flex.flex-col.gap-4');
              if (thumbnailContainer) {
                console.log('Rebuilding', images.length, 'thumbnails');
                
                // Vider le conteneur
                thumbnailContainer.innerHTML = '';
                
                // Créer les nouveaux thumbnails
                for (let k = 0; k < images.length; k++) {
                  const imagePath = images[k].image_path.startsWith('/') ? images[k].image_path : '/' + images[k].image_path;
                  const activeClass = k === 0 ? 'ring-2 ring-black' : '';
                  
                  const thumbDiv = document.createElement('div');
                  thumbDiv.className = `w-[100px] h-[100px] bg-gray-200 overflow-hidden cursor-pointer hover:ring-2 hover:ring-black transition-all ${activeClass}`;
                  thumbDiv.dataset.thumbnailIndex = k;
                  
                  const thumbImg = document.createElement('img');
                  thumbImg.dataset.thumbnail = '';
                  thumbImg.dataset.image = imagePath;
                  thumbImg.src = imagePath;
                  thumbImg.alt = `Thumbnail ${k}`;
                  thumbImg.className = 'w-full h-full object-cover';
                  
                  thumbDiv.appendChild(thumbImg);
                  thumbnailContainer.appendChild(thumbDiv);
                  
                  // Ajouter l'event listener pour le click
                  thumbDiv.addEventListener('click', () => {
                    if (mainImg) {
                      mainImg.src = imagePath;
                    }
                    // Mettre à jour les styles actifs
                    const allThumbs = thumbnailContainer.querySelectorAll('[data-thumbnail-index]');
                    for (let m = 0; m < allThumbs.length; m++) {
                      allThumbs[m].classList.remove('ring-2', 'ring-black');
                    }
                    thumbDiv.classList.add('ring-2', 'ring-black');
                  });
                }
              } else {
                console.warn('Thumbnail container not found');
              }
            } else {
              console.warn('No images found for this color');
            }
          } else {
            console.warn('No images for option_value_id:', optionValueId);
          }
        } else {
          console.warn('optionValueImages not available');
        }
        
        // Mettre à jour le variant et les options disponibles
        updateVariantInfo();
        updateAvailableOptions();
      });
    }

    // Gestion du bouton ajouter au panier
    const addToCartBtn = fragment.querySelector('[data-add-to-cart]');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', async () => {
        // Vérifier si le produit a des variants et si toutes les options sont sélectionnées
        if (data.variants && data.variants.length > 0) {
          // Produit avec options : vérifier qu'un variant est sélectionné
          if (!selectedVariant) {
            alert('Veuillez sélectionner toutes les options (taille et couleur).');
            return;
          }
          
          // Vérifier le stock
          if (selectedVariant.stock <= 0) {
            alert('Ce produit n\'est pas disponible en stock.');
            return;
          }
          
          // Vérifier que la quantité ne dépasse pas le stock
          if (quantity > selectedVariant.stock) {
            alert(`Seulement ${selectedVariant.stock} article(s) disponible(s) en stock.`);
            return;
          }
        }
        
        // Appel au modèle CartModel
        try {
          const { CartModel } = await import("../../data/cart.js");
          const { CartPanelView } = await import("../../ui/cart-panel/index.js");
          
          // Si produit avec variants, passer le variant_id, sinon le product_id
          const itemId = selectedVariant ? selectedVariant.id : data.id;
          const itemData = {
            id: itemId,
            variantId: selectedVariant ? selectedVariant.id : null,
            productId: data.id,
            quantity: quantity,
            size: selectedSize,
            color: selectedColor
          };
          
          const success = await CartModel.addItem(itemData.productId, quantity, itemData);
          if (success) {
            // Mettre à jour le compteur et ouvrir le panneau
            CartModel.updateGlobalCount();
            CartPanelView.open();
          } else {
            alert('Erreur lors de l\'ajout au panier.');
          }
        } catch (e) {
          console.error('Erreur lors de l\'ajout au panier :', e);
        }
      });
    }
  }
};

export { ProductInfoView };
