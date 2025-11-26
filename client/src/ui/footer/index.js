import { htmlToFragment, processTemplate } from "../../lib/utils";
import template from "./template.html?raw";

let FooterView = {
  html: function () {
    return processTemplate(template);
  },

  dom: function () {
    return htmlToFragment(processTemplate(template));
  }
};

export { FooterView };
