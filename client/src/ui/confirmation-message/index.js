import { htmlToFragment, processTemplate, genericRenderer } from "../../lib/utils.js";
import template from "./template.html?raw";

let ConfirmationMessageView = {
  html: function (orderNumber = 'N/A') {
    return genericRenderer(template, { orderNumber });
  },

  dom: function (orderNumber = 'N/A') {
    return htmlToFragment(this.html(orderNumber));
  }
};

export { ConfirmationMessageView };
