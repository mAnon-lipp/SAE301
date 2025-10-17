import { SignupView } from "../../ui/signup/index.js";
import { EmailErrorAlertView } from "../../ui/email-error-alert/index.js";
import { PasswordErrorAlertView } from "../../ui/password-error-alert/index.js";
import { BreadcrumbView } from "../../ui/breadcrumb/index.js";

/**
 * Page d'inscription
 * @param {object} params - Paramètres de la route
 * @param {Router} router - Instance du routeur
 */
export function SignupPage(params, router) {
    // Créer un conteneur pour le breadcrumb et le formulaire
    const container = document.createElement('div');
    container.className = 'container mx-auto px-4';
    
    // Ajouter le breadcrumb
    const breadcrumb = BreadcrumbView.dom();
    container.appendChild(breadcrumb);
    
    // Ajouter le formulaire d'inscription
    const signupFragment = SignupView.dom();
    
    // Validation côté client selon vos critères
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    
    const validatePassword = (password) => {
        // Selon votre template: une lettre majuscule, un caractère spécial (?!/@) et trois chiffres
        const hasUpperCase = /[A-Z]/.test(password);
        const hasSpecialChar = /[?!/@]/.test(password);
        const hasThreeDigits = (password.match(/\d/g) || []).length >= 3;
        
        return hasUpperCase && hasSpecialChar && hasThreeDigits;
    };
    
    // Fonction pour afficher les modales d'erreur
    const showErrorModal = (errorFragment, closeSelector) => {
        // Créer un overlay pour l'alerte modale
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
        overlay.appendChild(errorFragment);
        
        // Ajouter au body
        document.body.appendChild(overlay);
        
        // Gérer la fermeture
        const closeBtn = overlay.querySelector(closeSelector);
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                overlay.remove();
            });
        }
        
        // Fermer en cliquant sur l'overlay
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    };
    
    // Attacher l'événement submit directement sur le fragment
    const form = signupFragment.querySelector('#signupForm');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const emailInput = form.querySelector('#email');
            const passwordInput = form.querySelector('#password');
            
            if (!emailInput || !passwordInput) {
                console.error('Inputs not found');
                return;
            }
            
            const email = emailInput.value;
            const password = passwordInput.value;
            
            console.log('Form submitted with:', { email, password: '***' });
            
            // Validation email
            if (!validateEmail(email)) {
                showErrorModal(EmailErrorAlertView.dom(), '[data-email-error-close]');
                return;
            }
            
            // Validation password
            if (!validatePassword(password)) {
                showErrorModal(PasswordErrorAlertView.dom(), '[data-password-error-close]');
                return;
            }
            
            try {
                console.log('Calling API:', router.apiUrl + 'users');
                const response = await fetch(router.apiUrl + 'users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                console.log('API Response:', response.status, data);
                
                if (response.ok) {
                    // Inscription réussie - connecter automatiquement l'utilisateur
                    console.log('Inscription réussie, connexion automatique...');
                    
                    // Appeler l'API de connexion
                    const loginResponse = await fetch(router.apiUrl + 'auth', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify({ email, password })
                    });
                    
                    const loginData = await loginResponse.json();
                    
                    if (loginResponse.ok && loginData.success) {
                        // Connexion réussie, mettre à jour l'état
                        router.setAuth(true, loginData.user);
                        
                        // Rediriger vers la page de compte
                        router.navigate('/account');
                    } else {
                        // Si la connexion échoue, rediriger vers login
                        router.navigate('/login');
                    }
                } else {
                    // Afficher l'erreur
                    console.error('Erreur inscription:', data.error);
                    if (data.error && data.error.includes('email')) {
                        showErrorModal(EmailErrorAlertView.dom(), '[data-email-error-close]');
                    } else {
                        // Créer une alerte générique
                        alert(data.error || 'Erreur lors de l\'inscription');
                    }
                }
            } catch (error) {
                console.error('Erreur lors de l\'inscription:', error);
                alert('Erreur de connexion au serveur');
            }
        });
    } else {
        console.error('Form not found in fragment');
    }
    
    // Ajouter le formulaire au conteneur
    container.appendChild(signupFragment);
    
    // Retourner le fragment complet avec breadcrumb et formulaire
    const finalFragment = document.createDocumentFragment();
    finalFragment.appendChild(container);
    
    return finalFragment;
}
