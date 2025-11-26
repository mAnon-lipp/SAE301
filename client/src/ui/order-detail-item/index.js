import { genericRenderer, htmlToFragment, processTemplate } from "../../lib/utils.js";
import template from "./template.html?raw";

// Traiter le template une seule fois au chargement du module
const processedTemplate = processTemplate(template);

let OrderDetailItemView = {
  html: function (data) {
    let htmlString = '';
    for (let obj of data) {
      htmlString += genericRenderer(processedTemplate, obj);
    }
    return htmlString;
  },

  dom: function (data) {
    return htmlToFragment(OrderDetailItemView.html(data));
  }
};

export { OrderDetailItemView };
