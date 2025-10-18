import { ProfileFieldView } from "../../ui/profilefield/index.js";
import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let M = {
    // User data will be loaded here
    user: null
};

let C = {};

C.init = async function(){
    // Get user from sessionStorage
    try {
        const userData = sessionStorage.getItem('auth_user');
        if (userData) {
            M.user = JSON.parse(userData);
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
    
    return V.init();
}

let V = {};

V.init = function(){
    let fragment = V.createPageFragment();
    V.attachEvents(fragment);
    return fragment;
}

V.createPageFragment = function(){
   // Create page fragment from template
   let pageFragment = htmlToFragment(template);
   
   // Generate name field (no value shown initially)
   let nameFieldDOM = ProfileFieldView.dom('Nom', '', false, false);
   let nameSlot = pageFragment.querySelector('slot[name="name-field"]');
   if (nameSlot) {
       nameSlot.replaceWith(nameFieldDOM);
   }
   
   // Generate email field (with value)
   let emailFieldDOM = ProfileFieldView.dom('Adresse mail', M.user?.email || 'manon.lippler@etu.unilim.fr', false, true);
   let emailSlot = pageFragment.querySelector('slot[name="email-field"]');
   if (emailSlot) {
       emailSlot.replaceWith(emailFieldDOM);
   }
   
   // Generate password field (with dots)
   let passwordFieldDOM = ProfileFieldView.dom('Mot de passe', '', true, true);
   let passwordSlot = pageFragment.querySelector('slot[name="password-field"]');
   if (passwordSlot) {
       passwordSlot.replaceWith(passwordFieldDOM);
   }
   
   return pageFragment;
}

V.attachEvents = function(fragment){
    // Events will be added later for editing functionality
}

/**
 * Page de profil utilisateur
 * @param {object} params - Paramètres de la route
 * @param {Router} router - Instance du routeur
 */
export function ProfilePage(params, router) {
    console.log("ProfilePage", params);
    return C.init();
}
