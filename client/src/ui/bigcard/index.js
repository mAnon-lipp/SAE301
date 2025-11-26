import { genericRenderer, htmlToFragment, processTemplate } from "../../lib/utils.js";
import template from "./template.html?raw";

// Traiter le template une seule fois au chargement du module
const processedTemplate = processTemplate(template);

let BigCardView = {
  html: function (data) {
  let htmlString = '<div class="bigcard_grid_container">';
    for (let obj of data) {
      htmlString += genericRenderer(processedTemplate, obj);
    }
    return htmlString + '</div>';
  },

  dom: function (data) {
    return htmlToFragment(BigCardView.html(data));
  }
};

export { BigCardView };
