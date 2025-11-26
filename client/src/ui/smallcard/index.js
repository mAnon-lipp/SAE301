import { genericRenderer, htmlToFragment, processTemplate } from "../../lib/utils.js";
import { getProductStockStatus, getStockMessage, getStockBadgeClasses } from "../../lib/stock-status.js";
import template from "./template.html?raw";
import "./style.css";

let SmallCardView = {
  html: function (data) {
    let htmlString = '<div class="small-card-grid">';
    for (let obj of data) {
      // Gérer l'image : utiliser le champ image ou la première image du tableau images
      let imageUrl = obj.image || (obj.images && obj.images.length > 0 ? obj.images[0].image_url : '');
      
      // Déterminer le statut du stock
      let stockBadge = '';
      const stockInfo = this.getStockStatus(obj);
      
      if (stockInfo) {
        stockBadge = `
          <div class="${stockInfo.classes}">
            <div>${stockInfo.message}</div>
          </div>
        `;
      }
      
      const productData = {
        ...obj,
        image: imageUrl,
        stockBadge: stockBadge
      };
      
      htmlString += genericRenderer(template, productData);
    }
    return htmlString + '</div>';
  },

  getStockStatus: function (product) {
    // Si le produit n'a pas de variants, retourner null (pas de badge)
    if (!product.variants || !Array.isArray(product.variants) || product.variants.length === 0) {
      return null;
    }

    // Utiliser le module centralisé pour déterminer le statut
    const status = getProductStockStatus(product.variants);
    const message = getStockMessage(status, 'list', product.variants);
    const classes = getStockBadgeClasses(status);

    return { message, classes };
  },

  dom: function (data) {
    return htmlToFragment(SmallCardView.html(data));
  }
};

export { SmallCardView };
