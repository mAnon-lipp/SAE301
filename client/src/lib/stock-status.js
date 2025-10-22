/**
 * Module de gestion de l'état du stock
 * Fournit des fonctions centralisées pour déterminer et afficher l'état du stock
 */

// Configuration des seuils de stock (configurables)
const STOCK_THRESHOLDS = {
  // Seuil pour "Bientôt épuisé" / "Dernières tailles disponibles"
  LOW_STOCK: 5,
  // Seuil pour le nombre de tailles/variants disponibles
  LOW_VARIANT_COUNT: 2,
  // Seuil critique pour un variant individuel
  CRITICAL_VARIANT_STOCK: 3
};

/**
 * États possibles du stock
 */
const STOCK_STATUS = {
  IN_STOCK: 'in-stock',           // En stock
  LOW_STOCK: 'low-stock',         // Bientôt épuisé / Dernières tailles disponibles
  OUT_OF_STOCK: 'out-of-stock'    // Épuisé / Plus de tailles disponibles
};

/**
 * Messages d'affichage selon le contexte et l'état
 */
const STOCK_MESSAGES = {
  // Messages pour la liste de produits (smallcard) - avec tailles
  list: {
    [STOCK_STATUS.IN_STOCK]: 'Modèle disponible',
    [STOCK_STATUS.LOW_STOCK]: 'Dernières tailles disponibles',
    [STOCK_STATUS.OUT_OF_STOCK]: 'Plus de tailles disponibles'
  },
  // Messages pour la liste - sans tailles (ex: sacs)
  listNoSize: {
    [STOCK_STATUS.IN_STOCK]: 'Disponible',
    [STOCK_STATUS.LOW_STOCK]: 'Dernières pièces disponibles',
    [STOCK_STATUS.OUT_OF_STOCK]: 'Épuisé'
  },
  // Messages pour le détail produit (variant spécifique)
  detail: {
    [STOCK_STATUS.IN_STOCK]: 'En stock',
    [STOCK_STATUS.LOW_STOCK]: 'Dernières pièces disponibles',
    [STOCK_STATUS.OUT_OF_STOCK]: 'Épuisé'
  }
};

/**
 * Classes CSS pour les différents états (à utiliser avec Tailwind)
 */
const STOCK_BADGE_CLASSES = {
  base: 'flex gap-[10px] items-center justify-center px-[10px] py-[2px] rounded-[7px] flex-shrink-0 w-fit font-[var(--ff-sans)] font-normal text-xs tracking-[2.04px] leading-[28.8px] whitespace-pre',
  [STOCK_STATUS.IN_STOCK]: 'bg-[rgba(52,168,83,0.15)] text-[#34A853]',      // Vert léger
  [STOCK_STATUS.LOW_STOCK]: 'bg-[rgba(251,188,5,0.15)] text-[#F59E0B]',    // Orange/jaune
  [STOCK_STATUS.OUT_OF_STOCK]: 'bg-[rgba(234,67,53,0.15)] text-[#EA4335]'  // Rouge léger
};

/**
 * Vérifie si le produit a des options de taille
 * @param {Array} variants - Liste des variants du produit
 * @returns {boolean} true si le produit a des tailles
 */
function hasSizeOptions(variants) {
  if (!variants || variants.length === 0) return false;
  
  // Chercher dans le premier variant qui a des options
  for (let variant of variants) {
    if (!variant.options) continue;
    
    for (let opt of variant.options) {
      const type = opt.type.toLowerCase();
      if (type === 'size' || type === 'taille') {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Détermine l'état du stock pour un variant spécifique
 * @param {number} stock - Quantité en stock
 * @returns {string} État du stock (STOCK_STATUS)
 */
function getVariantStockStatus(stock) {
  if (stock === 0) {
    return STOCK_STATUS.OUT_OF_STOCK;
  } else if (stock <= STOCK_THRESHOLDS.CRITICAL_VARIANT_STOCK) {
    return STOCK_STATUS.LOW_STOCK;
  }
  return STOCK_STATUS.IN_STOCK;
}

/**
 * Détermine l'état du stock pour un produit avec variants (vue liste)
 * Analyse tous les variants pour déterminer l'état global
 * @param {Array} variants - Liste des variants du produit
 * @returns {string} État du stock (STOCK_STATUS)
 */
function getProductStockStatus(variants) {
  if (!variants || variants.length === 0) {
    return STOCK_STATUS.OUT_OF_STOCK;
  }

  let totalStock = 0;
  let availableVariants = 0;

  variants.forEach(variant => {
    const stock = variant.stock || 0;
    if (stock > 0) {
      totalStock += stock;
      availableVariants++;
    }
  });

  if (totalStock === 0 || availableVariants === 0) {
    return STOCK_STATUS.OUT_OF_STOCK;
  } else if (totalStock <= STOCK_THRESHOLDS.LOW_STOCK || availableVariants <= STOCK_THRESHOLDS.LOW_VARIANT_COUNT) {
    return STOCK_STATUS.LOW_STOCK;
  }
  return STOCK_STATUS.IN_STOCK;
}

/**
 * Détermine l'état du stock pour une couleur spécifique (vue détail produit)
 * @param {Array} variants - Liste des variants du produit
 * @param {string} selectedColor - Couleur sélectionnée
 * @returns {string} État du stock (STOCK_STATUS)
 */
function getColorStockStatus(variants, selectedColor) {
  if (!variants || variants.length === 0 || !selectedColor) {
    return STOCK_STATUS.OUT_OF_STOCK;
  }

  let totalStock = 0;
  let availableSizes = 0;

  variants.forEach(variant => {
    if (!variant.options) return;

    let variantColor = null;
    variant.options.forEach(opt => {
      const type = opt.type.toLowerCase();
      if (type === 'color' || type === 'couleur') {
        variantColor = opt.label;
      }
    });

    if (variantColor === selectedColor && variant.stock > 0) {
      totalStock += variant.stock;
      availableSizes++;
    }
  });

  if (totalStock === 0 || availableSizes === 0) {
    return STOCK_STATUS.OUT_OF_STOCK;
  } else if (totalStock <= STOCK_THRESHOLDS.LOW_STOCK || availableSizes <= STOCK_THRESHOLDS.LOW_VARIANT_COUNT) {
    return STOCK_STATUS.LOW_STOCK;
  }
  return STOCK_STATUS.IN_STOCK;
}

/**
 * Obtient le message approprié selon le contexte et l'état du stock
 * @param {string} status - État du stock (STOCK_STATUS)
 * @param {string} context - Contexte ('list', 'listNoSize' ou 'detail')
 * @param {Array} variants - (Optionnel) Liste des variants pour détecter si le produit a des tailles
 * @returns {string} Message à afficher
 */
function getStockMessage(status, context = 'list', variants = null) {
  // Si context est 'list' et qu'on a les variants, détecter automatiquement si le produit a des tailles
  if (context === 'list' && variants && !hasSizeOptions(variants)) {
    context = 'listNoSize';
  }
  
  return STOCK_MESSAGES[context][status] || '';
}

/**
 * Obtient les classes CSS pour le badge selon l'état du stock
 * @param {string} status - État du stock (STOCK_STATUS)
 * @returns {string} Classes CSS complètes pour le badge
 */
function getStockBadgeClasses(status) {
  return `${STOCK_BADGE_CLASSES.base} ${STOCK_BADGE_CLASSES[status] || ''}`;
}

/**
 * Configure les seuils de stock (pour l'administration)
 * @param {Object} thresholds - Nouveaux seuils { LOW_STOCK, LOW_VARIANT_COUNT, CRITICAL_VARIANT_STOCK }
 */
function configureThresholds(thresholds) {
  if (thresholds.LOW_STOCK !== undefined) {
    STOCK_THRESHOLDS.LOW_STOCK = thresholds.LOW_STOCK;
  }
  if (thresholds.LOW_VARIANT_COUNT !== undefined) {
    STOCK_THRESHOLDS.LOW_VARIANT_COUNT = thresholds.LOW_VARIANT_COUNT;
  }
  if (thresholds.CRITICAL_VARIANT_STOCK !== undefined) {
    STOCK_THRESHOLDS.CRITICAL_VARIANT_STOCK = thresholds.CRITICAL_VARIANT_STOCK;
  }
}

/**
 * Obtient les seuils actuels
 * @returns {Object} Seuils configurés
 */
function getThresholds() {
  return { ...STOCK_THRESHOLDS };
}

export {
  STOCK_STATUS,
  STOCK_THRESHOLDS,
  hasSizeOptions,
  getVariantStockStatus,
  getProductStockStatus,
  getColorStockStatus,
  getStockMessage,
  getStockBadgeClasses,
  configureThresholds,
  getThresholds
};
