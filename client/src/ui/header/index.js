import { htmlToFragment, processTemplate } from "../../lib/utils.js";
import { NavView } from "../nav/index.js";
import template from "./template.html?raw";

// HeaderView intègre maintenant le NavView
let HeaderView = {
  html: function () {
    let headerHtml = template;
    let navHtml = NavView.html();
    return headerHtml.replace('<slot name="nav"></slot>', navHtml);
  },

  dom: function () {
    let headerFragment = htmlToFragment(processTemplate(template));
    let navDOM = NavView.dom();
    
    // Remplacer le slot par le nav
    let slot = headerFragment.querySelector('slot[name="nav"]');
    if (slot) {
      slot.replaceWith(navDOM);
    }
    
    return headerFragment;
  }
};

export { HeaderView };
