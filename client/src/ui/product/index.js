import { genericRenderer, htmlToFragment, processTemplate } from "../../lib/utils.js";
import template from "./template.html?raw";
import "./style.css";

// Traiter le template une seule fois au chargement du module
const processedTemplate = processTemplate(template);

let ProductView = {
  html: function (data) {
  let htmlString = '<div class="product_grid">';
    for (let obj of data) {
      htmlString  += genericRenderer(processedTemplate, obj);
    }
    return htmlString + '</div>';
  },

  dom: function (data) {
    return htmlToFragment( ProductView.html(data) );
  }

};

export { ProductView };
