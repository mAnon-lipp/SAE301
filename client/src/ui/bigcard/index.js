import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let BigCardView = {
  html: function (data) {
    let htmlString = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">';
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
