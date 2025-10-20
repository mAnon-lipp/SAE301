import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let CartPanelView = {
  html: function () {
    return template;
  },

  dom: function () {
    return htmlToFragment(template);
  }
};

export { CartPanelView };
