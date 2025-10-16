import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

// Template pour un élément de catégorie
const categoryItemTemplate = `
<a 
  href="/products/category/{{id}}/{{slug}}" 
  data-link 
  data-category-id="{{id}}"
  class="font-sans font-normal text-[14px] text-foreground leading-[23.1px] hover:underline cursor-pointer block category-link"
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
      // Créer un slug simple à partir du nom
      const slug = category.slug || category.name.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Enlever les accents
        .replace(/[^a-z0-9]+/g, '-') // Remplacer les espaces et caractères spéciaux par des tirets
        .replace(/^-+|-+$/g, ''); // Enlever les tirets au début et à la fin

      const categoryWithSlug = { ...category, slug };
      let categoryHTML = genericRenderer(categoryItemTemplate, categoryWithSlug);
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

    // Handle category link clicks - use the router's navigation
    const categoryLinks = element.querySelectorAll('.category-link');
    for (let m = 0; m < categoryLinks.length; m++) {
      const link = categoryLinks[m];
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        // Use window.location to navigate and trigger router
        window.history.pushState({}, '', href);
        window.dispatchEvent(new PopStateEvent('popstate'));
      });
    }
  }
};

export { SideNavView };
