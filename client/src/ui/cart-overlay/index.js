import { htmlToFragment, processTemplate } from "../../lib/utils.js";
import template from "./template.html?raw";

let CartOverlayView = {
  html: function () {
    return processTemplate(template);
  },

  dom: function () {
    return htmlToFragment(processTemplate(template));
  }
};

export { CartOverlayView };
