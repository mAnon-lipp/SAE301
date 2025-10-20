import { ProfileFieldView } from "../../ui/profilefield/index.js";
import { EditNameModalView } from "../../ui/editnamemodal/index.js";
import { EditEmailModalView } from "../../ui/editemailmodal/index.js";
import { EditPasswordModalView } from "../../ui/editpasswordmodal/index.js";
import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let M = {
    user: null,
    router: null
};

let C = {};

C.init = async function(router){
    M.router = router;
    
    // Charger les données de l'utilisateur depuis sessionStorage ou l'API
    try {
        const userData = sessionStorage.getItem('auth_user');
        if (userData) {
            M.user = JSON.parse(userData);
        } else if (router && router.user) {
            M.user = router.user;
        }
        
        // Si pas de données utilisateur, recharger depuis l'API
        if (!M.user && router && router.isAuthenticated) {
            await C.loadUserData();
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
    
    return V.init();
}

C.loadUserData = async function() {
    try {
        const response = await fetch(M.router.apiUrl + 'user', {
            method: 'GET',
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            M.user = data;
            sessionStorage.setItem('auth_user', JSON.stringify(data));
        }
    } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur:', error);
    }
}

C.updateUserData = async function(fieldName, newValue, oldPassword = null) {
    try {
        const body = {};
        
        if (fieldName === 'name') {
            body.name = newValue;
        } else if (fieldName === 'email') {
            body.email = newValue;
        } else if (fieldName === 'password') {
            body.old_password = oldPassword;
            body.new_password = newValue;
        }
        
        const response = await fetch(M.router.apiUrl + 'user', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(body)
        });
        
        // Vérifier si la réponse est OK avant de parser le JSON
        if (!response.ok) {
            // Tenter de parser le JSON pour récupérer le message d'erreur
            let errorMessage = 'Erreur lors de la mise à jour';
            try {
                const errorData = await response.json();
                errorMessage = errorData.error || errorMessage;
            } catch (e) {
                // Si la réponse n'est pas du JSON, utiliser le statut HTTP
                errorMessage = `Erreur ${response.status}: ${response.statusText}`;
            }
            return { success: false, error: errorMessage };
        }
        
        const data = await response.json();
        
        if (data.success) {
            // Mettre à jour les données locales
            M.user = data.user;
            sessionStorage.setItem('auth_user', JSON.stringify(data.user));
            M.router.user = data.user;
            return { success: true };
        } else {
            return { success: false, error: data.error || 'Erreur lors de la mise à jour' };
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
        return { success: false, error: 'Erreur de connexion au serveur' };
    }
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
   
   // Generate name field (with value if available)
   // Utiliser le champ name (nom complet) ou email comme fallback
   const displayName = M.user?.name || '';
   let nameFieldDOM = ProfileFieldView.dom('Nom', displayName, false, !!displayName, 'name');
   let nameSlot = pageFragment.querySelector('slot[name="name-field"]');
   if (nameSlot) {
       nameSlot.replaceWith(nameFieldDOM);
   }
   
   // Generate email field (with value)
   let emailFieldDOM = ProfileFieldView.dom('Adresse mail', M.user?.email || '', false, true, 'email');
   let emailSlot = pageFragment.querySelector('slot[name="email-field"]');
   if (emailSlot) {
       emailSlot.replaceWith(emailFieldDOM);
   }
   
   // Generate password field (with dots)
   let passwordFieldDOM = ProfileFieldView.dom('Mot de passe', '', true, true, 'password');
   let passwordSlot = pageFragment.querySelector('slot[name="password-field"]');
   if (passwordSlot) {
       passwordSlot.replaceWith(passwordFieldDOM);
   }
   
   return pageFragment;
}

V.attachEvents = function(fragment){
    // Add click events on all edit icons
    const editIcons = fragment.querySelectorAll('img[data-field]');
    
    editIcons.forEach(icon => {
        icon.style.cursor = 'pointer';
        icon.addEventListener('click', () => {
            const field = icon.getAttribute('data-field');
            V.openEditModal(field);
        });
    });
}

V.openEditModal = function(fieldName) {
    let modalFragment;
    let modalOverlay;
    
    if (fieldName === 'name') {
        modalFragment = EditNameModalView.dom(M.user?.name || M.user?.username || '');
        modalOverlay = V.createModalOverlay(modalFragment, fieldName);
        
        // Attach save event for name
        const saveBtn = modalOverlay.querySelector('#save-button');
        const input = modalOverlay.querySelector('#name-input');
        
        if (saveBtn && input) {
            saveBtn.addEventListener('click', async () => {
                const newName = input.value.trim();
                if (!newName) {
                    alert('Le nom ne peut pas être vide');
                    return;
                }
                
                const result = await C.updateUserData('name', newName);
                if (result.success) {
                    modalOverlay.remove();
                    // Refresh the page to show updated data
                    M.router.handleRoute();
                } else {
                    alert(result.error || 'Erreur lors de la mise à jour');
                }
            });
        }
    } else if (fieldName === 'email') {
        modalFragment = EditEmailModalView.dom(M.user?.email || '');
        modalOverlay = V.createModalOverlay(modalFragment, fieldName);
        
        // Attach save event for email
        const saveBtn = modalOverlay.querySelector('#save-button');
        const input = modalOverlay.querySelector('#email-input');
        
        if (saveBtn && input) {
            saveBtn.addEventListener('click', async () => {
                const newEmail = input.value.trim();
                if (!newEmail) {
                    alert('L\'email ne peut pas être vide');
                    return;
                }
                
                // Basic email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(newEmail)) {
                    alert('Format d\'email invalide');
                    return;
                }
                
                const result = await C.updateUserData('email', newEmail);
                if (result.success) {
                    modalOverlay.remove();
                    // Refresh the page to show updated data
                    M.router.handleRoute();
                } else {
                    alert(result.error || 'Erreur lors de la mise à jour');
                }
            });
        }
    } else if (fieldName === 'password') {
        modalFragment = EditPasswordModalView.dom();
        modalOverlay = V.createModalOverlay(modalFragment, fieldName);
        
        // Attach save event for password
        const saveBtn = modalOverlay.querySelector('#save-button');
        const oldPasswordInput = modalOverlay.querySelector('#old-password-input');
        const newPasswordInput = modalOverlay.querySelector('#new-password-input');
        
        if (saveBtn && oldPasswordInput && newPasswordInput) {
            saveBtn.addEventListener('click', async () => {
                const oldPassword = oldPasswordInput.value;
                const newPassword = newPasswordInput.value;
                
                if (!oldPassword || !newPassword) {
                    alert('Veuillez remplir tous les champs');
                    return;
                }
                
                if (newPassword.length < 6) {
                    alert('Le nouveau mot de passe doit contenir au moins 6 caractères');
                    return;
                }
                
                const result = await C.updateUserData('password', newPassword, oldPassword);
                if (result.success) {
                    modalOverlay.remove();
                    alert('Mot de passe modifié avec succès');
                } else {
                    alert(result.error || 'Erreur lors de la mise à jour');
                }
            });
        }
    }
    
    document.body.appendChild(modalOverlay);
}

V.createModalOverlay = function(modalFragment, fieldName) {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
    overlay.appendChild(modalFragment);
    
    // Close button
    const closeBtn = overlay.querySelector('#close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            overlay.remove();
        });
    }
    
    // Close on backdrop click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
    
    return overlay;
}

/**
 * Page de profil utilisateur
 * @param {object} params - Paramètres de la route
 * @param {Router} router - Instance du routeur
 */
export function ProfilePage(params, router) {
    console.log("ProfilePage", params);
    return C.init(router);
}

