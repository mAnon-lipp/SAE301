import { htmlToFragment, genericRenderer } from "../../lib/utils.js";
import template from "./template.html?raw";

export const OrderSummaryItemView = {
  html(data) {
    // Si c'est un tableau d'items, générer le HTML pour chacun
    if (Array.isArray(data)) {
      let htmlString = '';
      for (let item of data) {
        const renderedData = {
          image: item.image || '',
          name: item.name || '',
          prix: item.prix ? item.prix.toFixed(2) : '0.00',
          quantity: item.quantity || 1
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
      quantity: data.quantity || 1
    };
    
    return genericRenderer(template, renderedData);
  },

  dom(data) {
    return htmlToFragment(this.html(data));
  }
};
