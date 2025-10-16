import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let SignupView = {
  html: function () {
    return template;
  },

  dom: function () {
    return htmlToFragment(SignupView.html());
  }

};

export { SignupView };
