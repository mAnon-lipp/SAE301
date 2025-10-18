import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let OrdersCardView = {
  html: function () {
    return template;
  },

  dom: function () {
    return htmlToFragment(OrdersCardView.html());
  }
};

export { OrdersCardView };
