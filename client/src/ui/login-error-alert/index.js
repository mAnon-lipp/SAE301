import { htmlToFragment, processTemplate } from "../../lib/utils.js";
import template from "./template.html?raw";

let LoginErrorAlertView = {
  html: function () {
    return processTemplate(template);
  },

  dom: function () {
    return htmlToFragment(LoginErrorAlertView.html());
  }

};

export { LoginErrorAlertView };
