import { ProfileFieldView } from "../../ui/profilefield/index.js";
import { EditNameModalView } from "../../ui/editnamemodal/index.js";
import { EditEmailModalView } from "../../ui/editemailmodal/index.js";
import { EditPasswordModalView } from "../../ui/editpasswordmodal/index.js";
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
   let nameFieldDOM = ProfileFieldView.dom('Nom', M.user?.name || '', false, false);
   let nameWrapper = document.createElement('div');
   nameWrapper.dataset.field = 'name'; // Add identifier
   nameWrapper.appendChild(nameFieldDOM);
   let nameSlot = pageFragment.querySelector('slot[name="name-field"]');
   if (nameSlot) {
       nameSlot.replaceWith(nameWrapper);
   }
   
   // Generate email field (with value)
   let emailFieldDOM = ProfileFieldView.dom('Adresse mail', M.user?.email || '', false, true);
   let emailWrapper = document.createElement('div');
   emailWrapper.dataset.field = 'email'; // Add identifier
   emailWrapper.appendChild(emailFieldDOM);
   let emailSlot = pageFragment.querySelector('slot[name="email-field"]');
   if (emailSlot) {
       emailSlot.replaceWith(emailWrapper);
   }
   
   // Generate password field (with dots)
   let passwordFieldDOM = ProfileFieldView.dom('Mot de passe', '', true, true);
   let passwordWrapper = document.createElement('div');
   passwordWrapper.dataset.field = 'password'; // Add identifier
   passwordWrapper.appendChild(passwordFieldDOM);
   let passwordSlot = pageFragment.querySelector('slot[name="password-field"]');
   if (passwordSlot) {
       passwordSlot.replaceWith(passwordWrapper);
   }
   
   return pageFragment;
}

V.attachEvents = function(fragment){
    // Get all profile fields
    const fields = fragment.querySelectorAll('[data-field]');
    
    fields.forEach(field => {
        const fieldType = field.dataset.field;
        const editButton = field.querySelector('img[alt="Edit"]');
        
        if (editButton) {
            editButton.style.cursor = 'pointer';
            editButton.addEventListener('click', () => {
                V.openModal(fieldType, fragment);
            });
        }
    });
}

V.openModal = function(fieldType, pageFragment) {
    let modalDOM;
    
    switch(fieldType) {
        case 'name':
            modalDOM = EditNameModalView.dom(M.user?.name || '');
            break;
        case 'email':
            modalDOM = EditEmailModalView.dom(M.user?.email || '');
            break;
        case 'password':
            modalDOM = EditPasswordModalView.dom();
            break;
        default:
            return;
    }
    
    // Create a container for the modal
    const modalContainer = document.createElement('div');
    modalContainer.appendChild(modalDOM);
    document.body.appendChild(modalContainer);
    
    // Add close functionality
    const closeButton = modalContainer.querySelector('#close-modal');
    const backdrop = modalContainer.querySelector('.fixed.inset-0.bg-zinc-900');
    
    const closeModal = () => {
        modalContainer.remove();
    };
    
    if (closeButton) {
        closeButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        });
    }
    
    if (backdrop) {
        backdrop.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        });
    }
    
    // Prevent modal from closing when clicking inside the dialog
    const modalDialog = modalContainer.querySelectorAll('.fixed')[1]; // Second fixed element is the dialog
    if (modalDialog) {
        modalDialog.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
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
