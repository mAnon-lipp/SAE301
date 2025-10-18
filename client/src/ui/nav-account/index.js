import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

/**
 * NavAccountView est le composant de navigation pour la page compte
 * Il inclut le logo, les liens de navigation et un menu utilisateur avec dropdown
 */
let NavAccountView = {
  html: function () {
    return template;
  },

  dom: function () {
    const fragment = htmlToFragment(template);
    
    // Get user email from sessionStorage
    const userEmail = this.getUserEmail();
    if (userEmail) {
      const emailElement = fragment.querySelector('#user-email');
      if (emailElement) {
        emailElement.textContent = userEmail;
      }
    }
    
    // Ajouter la fonctionnalité de toggle du dropdown
    const toggle = fragment.querySelector('#account-menu-toggle');
    const dropdown = fragment.querySelector('#account-dropdown');
    const arrow = fragment.querySelector('#dropdown-arrow');
    const logoutButton = fragment.querySelector('#logout-button');
    
    // Set initial arrow rotation (pointing up)
    if (arrow) {
      arrow.style.transform = 'rotate(0deg)';
    }
    
    if (toggle && dropdown) {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('hidden');
        
        // Rotate arrow
        if (dropdown.classList.contains('hidden')) {
          arrow.style.transform = 'rotate(0deg)';
        } else {
          arrow.style.transform = 'rotate(180deg)';
        }
      });
      
      // Fermer le dropdown si on clique ailleurs
      document.addEventListener('click', () => {
        dropdown.classList.add('hidden');
        arrow.style.transform = 'rotate(0deg)';
      });
      
      // Empêcher la fermeture si on clique dans le dropdown
      dropdown.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
    
    // Handle logout
    if (logoutButton) {
      logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        // Redirect to logout route
        window.location.href = '/logout';
      });
    }
    
    return fragment;
  },

  getUserEmail: function() {
    try {
      const userData = sessionStorage.getItem('auth_user');
      if (userData) {
        const user = JSON.parse(userData);
        return user.email || null;
      }
    } catch (error) {
      console.error('Error getting user email:', error);
    }
    return null;
  }
};

export { NavAccountView };
