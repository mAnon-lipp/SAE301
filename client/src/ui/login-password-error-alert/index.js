import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let LoginPasswordErrorAlertView = {
  html: function () {
    return template;
  },

  dom: function () {
    return htmlToFragment(LoginPasswordErrorAlertView.html());
  }

};

export { LoginPasswordErrorAlertView };
