import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let SmallCardView = {
  html: function (data) {
    let htmlString = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">';
    for (let obj of data) {
      // Générer un slug si absent
      const slug = obj.slug || obj.name.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Gérer l'image : utiliser le champ image ou la première image du tableau images
      let imageUrl = obj.image || (obj.images && obj.images.length > 0 ? obj.images[0].image_url : 'https://via.placeholder.com/520x520/CCCCCC/000000?text=No+Image');
      
      const productData = {
        ...obj,
        slug: slug,
        image: imageUrl
      };
      htmlString += genericRenderer(template, productData);
    }
    return htmlString + '</div>';
  },

  dom: function (data) {
    return htmlToFragment(SmallCardView.html(data));
  }
};

export { SmallCardView };
