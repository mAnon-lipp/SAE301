import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let BigCardView = {
  html: function (data) {
    let htmlString = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">';
    for (let obj of data) {
      // Générer un slug si absent
      const slug = obj.slug || obj.name.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      const productData = {
        ...obj,
        slug: slug
      };
      htmlString += genericRenderer(template, productData);
    }
    return htmlString + '</div>';
  },

  dom: function (data) {
    return htmlToFragment(BigCardView.html(data));
  }
};

export { BigCardView };
