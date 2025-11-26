import { genericRenderer, htmlToFragment, processTemplate } from "../../lib/utils.js";
import template from "./template.html?raw";

let OrderRowView = {
  html: function (data) {
    let htmlString = '';
    for (let obj of data) {
      htmlString += genericRenderer(template, obj);
    }
    return htmlString;
  },

  dom: function (data) {
    return htmlToFragment(OrderRowView.html(data));
  }
};

export { OrderRowView };
