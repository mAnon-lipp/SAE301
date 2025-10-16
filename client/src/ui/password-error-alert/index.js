import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let PasswordErrorAlertView = {
  html: function (data) {
    return genericRenderer(template, data);
  },

  dom: function (data) {
    return htmlToFragment(PasswordErrorAlertView.html(data));
  }

};

export { PasswordErrorAlertView };
