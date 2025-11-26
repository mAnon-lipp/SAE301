import { htmlToFragment, processTemplate } from "../../lib/utils.js";
import template from "./template.html?raw";

let SignupView = {
  html: function () {
    return processTemplate(template);
  },

  dom: function () {
    return htmlToFragment(SignupView.html());
  }

};

export { SignupView };
