import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

export const BreadcrumbView = {
  html() {
    return template;
  },

  dom() {
    return htmlToFragment(this.html());
  }
};
