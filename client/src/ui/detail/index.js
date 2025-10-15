import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let DetailView = {
  html: function (data) {
    return genericRenderer(template, data);
  },

  dom: function (data) {
    return htmlToFragment(DetailView.html(data));
  }
};

export { DetailView };
