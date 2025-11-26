import { genericRenderer, htmlToFragment, processTemplate } from "../../lib/utils.js";
import template from "./template.html?raw";

let BigCardView = {
  html: function (data) {
  let htmlString = '<div class="bigcard_grid_container">';
    for (let obj of data) {
      htmlString += genericRenderer(template, obj);
    }
    return htmlString + '</div>';
  },

  dom: function (data) {
    return htmlToFragment(BigCardView.html(data));
  }
};

export { BigCardView };
