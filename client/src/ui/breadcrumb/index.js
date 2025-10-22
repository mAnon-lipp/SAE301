import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let BreadcrumbView = {
  html: function () {
    return template;
  },

  dom: function () {
    return htmlToFragment(this.html());
  }
};

export { BreadcrumbView };
