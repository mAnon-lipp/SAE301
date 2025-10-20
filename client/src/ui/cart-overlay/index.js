import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let CartOverlayView = {
  html: function () {
    return template;
  },

  dom: function () {
    return htmlToFragment(template);
  }
};

export { CartOverlayView };
