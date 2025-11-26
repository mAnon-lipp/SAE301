import { htmlToFragment, processTemplate } from "../../lib/utils.js";
import template from "./template.html?raw";

let EmailErrorAlertView = {
  html: function () {
    return processTemplate(template);
  },

  dom: function () {
    return htmlToFragment(EmailErrorAlertView.html());
  }

};

export { EmailErrorAlertView };
