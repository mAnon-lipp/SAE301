import { htmlToFragment, processTemplate, genericRenderer } from "../../lib/utils.js";
import template from "./template.html?raw";
import "./style.css";

let OrderSummaryItemView = {
  html: function (data) {
    // Si c'est un tableau d'items, générer le HTML pour chacun
    if (Array.isArray(data)) {
      let htmlString = '';
      for (let item of data) {
        // Construire les options (taille, couleur)
        let optionsHTML = '';
        const optionsParts = [];
        
        if (item.size) {
          optionsParts.push(`Size: ${item.size}`);
        }
        if (item.color) {
          optionsParts.push(`Color: ${item.color}`);
        }
        
        if (optionsParts.length > 0) {
          optionsHTML = `<p class="order-summary-item__options">${optionsParts.join(' • ')}</p>`;
        }
        
        const renderedData = {
          image: item.image || '',
          name: item.name || '',
          prix: item.prix ? item.prix.toFixed(2) : '0.00',
          quantity: item.quantity || 1,
          options: optionsHTML
        };
        htmlString += genericRenderer(template, renderedData);
      }
      return htmlString;
    }
    
    // Pour un seul item
    let optionsHTML = '';
    const optionsParts = [];
    
    if (data.size) {
      optionsParts.push(`Size: ${data.size}`);
    }
    if (data.color) {
      optionsParts.push(`Color: ${data.color}`);
    }
    
    if (optionsParts.length > 0) {
      optionsHTML = `<p class="order-summary-item__options">${optionsParts.join(' • ')}</p>`;
    }
    
    const renderedData = {
      image: data.image || '',
      name: data.name || '',
      prix: data.prix ? data.prix.toFixed(2) : '0.00',
      quantity: data.quantity || 1,
      options: optionsHTML
    };
    
    return genericRenderer(template, renderedData);
  },

  dom: function (data) {
    return htmlToFragment(this.html(data));
  }
};

export { OrderSummaryItemView };
