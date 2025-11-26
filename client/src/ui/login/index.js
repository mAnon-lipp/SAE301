import { htmlToFragment, processTemplate } from "../../lib/utils.js";
import template from "./template.html?raw";

let LoginView = {
  html: function () {
    return processTemplate(template);
  },

  dom: function () {
    return htmlToFragment(LoginView.html());
  }

};

export { LoginView };
