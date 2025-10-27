import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let OrderDetailItemView = {
  html: function (data) {
    let htmlString = '';
    for (let obj of data) {
      htmlString += genericRenderer(template, obj);
    }
    return htmlString;
  },

  dom: function (data) {
    return htmlToFragment(OrderDetailItemView.html(data));
  }
};

export { OrderDetailItemView };
