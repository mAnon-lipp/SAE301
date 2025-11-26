import { htmlToFragment, processTemplate } from "../../lib/utils.js";
import template from "./template.html?raw";

let OrdersCardView = {
  html: function () {
    return processTemplate(template);
  },

  dom: function () {
    return htmlToFragment(OrdersCardView.html());
  }
};

export { OrdersCardView };
