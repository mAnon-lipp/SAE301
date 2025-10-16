import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let EmailErrorAlertView = {
  html: function () {
    return template;
  },

  dom: function () {
    return htmlToFragment(EmailErrorAlertView.html());
  }

};

export { EmailErrorAlertView };
