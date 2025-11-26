import { htmlToFragment, processTemplate } from "../../lib/utils.js";
import template from "./template.html?raw";

let ProfileCardView = {
  html: function () {
    return processTemplate(template);
  },

  dom: function () {
    return htmlToFragment(ProfileCardView.html());
  }
};

export { ProfileCardView };
