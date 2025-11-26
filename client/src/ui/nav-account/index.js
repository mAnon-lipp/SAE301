import { htmlToFragment, processTemplate } from "../../lib/utils.js";
import template from "./template.html?raw";
import "./style.css";

/**
 * NavAccountView est le composant de navigation pour la page compte
 * Il inclut le logo, les liens de navigation et un menu utilisateur avec dropdown
 */
let NavAccountView = {
  html: function () {
    return processTemplate(template);
  },

  dom: function () {
    const fragment = htmlToFragment(this.html());
    
    // Get user data from sessionStorage
    const userData = this.getUserData();
    const userEmail = userData?.email;
    const userName = userData?.name;
    
    // Gérer l'affichage selon si name existe ou non
    const accountButton = fragment.querySelector('#account-menu-toggle');
    const emailElement = fragment.querySelector('#user-email');
    
    if (userName && userName.trim() !== '') {
      // CAS 1: L'utilisateur a un nom → afficher les initiales
      const initials = this.getInitials(userName);
      
      // Remplacer l'icône user par les initiales (sans cercle)
      const userIcon = accountButton.querySelector('img[alt="User"]');
      if (userIcon) {
        const initialsDiv = document.createElement('div');
        initialsDiv.className = 'initials-display flex items-center justify-center';
        initialsDiv.textContent = initials;
        userIcon.replaceWith(initialsDiv);
      }
      
      // Dans le dropdown: nom en gras + email en dessous
      if (emailElement) {
        emailElement.innerHTML = `
          <p class="navaccount_name">${userName}</p>
          <p class="navaccount_email">${userEmail || ''}</p>
        `;
      }
    } else {
      // CAS 2: Pas de nom → afficher l'icône user et juste l'email
      if (emailElement && userEmail) {
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
      arrow.classList.remove('dropdown-arrow-up');
    }
    
    if (toggle && dropdown) {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('hidden');
        
        // Rotate arrow
        if (dropdown.classList.contains('hidden')) {
          arrow.classList.remove('dropdown-arrow-up');
        } else {
          arrow.classList.add('dropdown-arrow-up');
        }
      });
      
      // Fermer le dropdown si on clique ailleurs
      document.addEventListener('click', () => {
        dropdown.classList.add('hidden');
        arrow.classList.remove('dropdown-arrow-up');
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
        // Utiliser le routeur global pour la déconnexion
        if (window.router) {
          window.router.navigate('/logout');
        } else {
          // Fallback si le routeur n'est pas disponible
          window.location.href = '/logout';
        }
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
  },
  
  getUserData: function() {
    try {
      const userData = sessionStorage.getItem('auth_user');
      if (userData) {
        return JSON.parse(userData);
      }
    } catch (error) {
      console.error('Error getting user data:', error);
    }
    return null;
  },
  
  getInitials: function(name) {
    if (!name || name.trim() === '') return '';
    
    const words = name.trim().split(' ');
    if (words.length === 1) {
      // Un seul mot : prendre les 2 premières lettres
      return words[0].substring(0, 2).toUpperCase();
    } else {
      // Plusieurs mots : prendre la première lettre de chaque mot (max 2)
      const taken = words.slice(0, 2);
      let initials = '';
      for (let i = 0; i < taken.length; i++) {
        const w = taken[i];
        if (w && w.length > 0) initials += w[0];
      }
      return initials.toUpperCase();
    }
  }
};

export { NavAccountView };
