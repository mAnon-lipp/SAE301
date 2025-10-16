import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let LoginView = {
  html: function () {
    return template;
  },

  dom: function () {
    return htmlToFragment(LoginView.html());
  }

};

export { LoginView };
