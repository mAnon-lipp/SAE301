import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let ProfileCardView = {
  html: function () {
    return template;
  },

  dom: function () {
    return htmlToFragment(ProfileCardView.html());
  }
};

export { ProfileCardView };
