import { htmlToFragment, processTemplate } from "../../lib/utils.js";
import template from "./template.html?raw";
import { OrderRowView } from "../order-row/index.js";

let OrderListView = {
  html: function (ordersData) {
    // Generate order rows HTML
    const orderRowsHtml = OrderRowView.html(ordersData);
    
    // Replace placeholder in template with actual order rows
    return template.replace('{{orderRows}}', orderRowsHtml);
  },

  dom: function (ordersData) {
    return htmlToFragment(OrderListView.html(ordersData));
  }
};

export { OrderListView };
