import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

// Template pour un élément de catégorie
const categoryItemTemplate = `
<a 
  href="/products/category/{{id}}/{{name}}" 
  data-link 
  data-category-id="{{id}}"
  class="font-sans font-normal text-sm md:text-[14px] text-foreground leading-normal md:leading-[23.1px] hover:underline cursor-pointer block category-link"
  style="font-variation-settings: 'wdth' 100">
  {{name}}
</a>
`;

let SideNavView = {
  html: function (categories, selectedCategoryId = null) {
    let fragment = htmlToFragment(template);
    
    // Générer les éléments de catégorie
    let dropdownList = fragment.querySelector('[data-dropdown-list]');
    
    for (let idx = 0; idx < categories.length; idx++) {
      const category = categories[idx];
      let categoryHTML = genericRenderer(categoryItemTemplate, category);
      let categoryFragment = htmlToFragment(categoryHTML);

      // Marquer la catégorie active avec un soulignement
      if (selectedCategoryId && category.id == selectedCategoryId) {
        let link = categoryFragment.querySelector('a');
        link.classList.add('underline');
      }

      dropdownList.appendChild(categoryFragment);
    }
    
    return fragment.firstElementChild.outerHTML;
  },

  dom: function (categories, selectedCategoryId = null) {
    return htmlToFragment(SideNavView.html(categories, selectedCategoryId));
  },

  // Attach event handlers for dropdown toggle and category navigation
  attachEvents: function(element) {
    const toggle = element.querySelector('[data-category-toggle]');
    const dropdownList = element.querySelector('[data-dropdown-list]');
    const dropdownIcon = element.querySelector('[data-dropdown-icon]');
    
    if (toggle && dropdownList && dropdownIcon) {
      toggle.addEventListener('click', () => {
        dropdownList.classList.toggle('hidden');
        // Rotate icon 180 degrees when open
        if (dropdownList.classList.contains('hidden')) {
          dropdownIcon.style.transform = 'rotate(0deg)';
        } else {
          dropdownIcon.style.transform = 'rotate(180deg)';
        }
      });
      
      // Start with dropdown open
      dropdownList.classList.remove('hidden');
      dropdownIcon.style.transform = 'rotate(180deg)';
    }

    // Category click events are now handled by the parent page
    // using event delegation (see C.handler_clickOnCategory in products/page.js)
    // This follows the pattern from script.js where events bubble up
  }
};

export { SideNavView };
