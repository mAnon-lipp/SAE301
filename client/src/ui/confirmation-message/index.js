import { htmlToFragment, genericRenderer } from "../../lib/utils.js";
import template from "./template.html?raw";

export const ConfirmationMessageView = {
  html(orderNumber = 'N/A') {
    return genericRenderer(template, { orderNumber });
  },

  dom(orderNumber = 'N/A') {
    return htmlToFragment(this.html(orderNumber));
  }
};
