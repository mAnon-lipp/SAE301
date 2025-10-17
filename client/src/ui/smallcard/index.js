import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let SmallCardView = {
  html: function (data) {
    let htmlString = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">';
    for (let obj of data) {
      // Gérer l'image : utiliser le champ image ou la première image du tableau images
      let imageUrl = obj.image || (obj.images && obj.images.length > 0 ? obj.images[0].image_url : '');
      
      const productData = {
        ...obj,
        image: imageUrl
      };
      htmlString += genericRenderer(template, obj);
    }
    return htmlString + '</div>';
  },

  dom: function (data) {
    return htmlToFragment(SmallCardView.html(data));
  }
};

export { SmallCardView };
