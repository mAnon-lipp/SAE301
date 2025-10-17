import { LoginView } from "../../ui/login/index.js";
import { LoginErrorAlertView } from "../../ui/login-error-alert/index.js";
import { LoginPasswordErrorAlertView } from "../../ui/login-password-error-alert/index.js";
import { BreadcrumbView } from "../../ui/breadcrumb/index.js";

/**
 * Page de connexion
 * @param {object} params - Paramètres de la route
 * @param {Router} router - Instance du routeur
 */
export function LoginPage(params, router) {
    // Créer un conteneur pour le breadcrumb et le formulaire
    const container = document.createElement('div');
    container.className = 'container mx-auto px-4';
    
    // Ajouter le breadcrumb
    const breadcrumb = BreadcrumbView.dom();
    container.appendChild(breadcrumb);
    
    // Ajouter le formulaire de login
    const loginFragment = LoginView.dom();
    
    // Fonction pour afficher les erreurs avec les composants
    const showError = (errorMessage, email = '') => {
        // Déterminer quel composant d'erreur afficher
        let errorFragment;
        
        if (errorMessage.includes('Identifiants incorrects') || errorMessage.includes('mot de passe')) {
            // Vérifier si c'est un problème de mot de passe ou d'email
            if (email && errorMessage.toLowerCase().includes('email')) {
                errorFragment = LoginErrorAlertView.dom();
            } else {
                errorFragment = LoginPasswordErrorAlertView.dom();
            }
        } else {
            errorFragment = LoginErrorAlertView.dom();
        }
        
        // Créer un overlay pour l'alerte modale
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
        overlay.appendChild(errorFragment);
        
        // Ajouter au body
        document.body.appendChild(overlay);
        
        // Gérer la fermeture
        const closeBtn = overlay.querySelector('[data-email-error-close], [data-login-error-close], [data-password-error-close], [data-login-password-error-close]');
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
    const form = loginFragment.querySelector('#loginForm');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const emailInput = form.querySelector('#username');
            const passwordInput = form.querySelector('#password');
            
            if (!emailInput || !passwordInput) {
                console.error('Inputs not found');
                return;
            }
            
            const email = emailInput.value;
            const password = passwordInput.value;
            
            console.log('Login form submitted with:', { email, password: '***' });
            
            try {
                console.log('Calling API:', router.apiUrl + 'auth');
                const response = await fetch(router.apiUrl + 'auth', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // Important pour les cookies de session
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                console.log('API Response:', response.status, data);
                
                if (response.ok && data.success) {
                    // Connexion réussie
                    console.log('Connexion réussie:', data.user);
                    router.setAuth(true, data.user);
                    
                    // Rediriger vers la page demandée ou l'accueil
                    const redirect = sessionStorage.getItem('redirectAfterLogin');
                    sessionStorage.removeItem('redirectAfterLogin');
                    router.navigate(redirect || '/account');
                } else {
                    // Afficher l'erreur appropriée
                    console.error('Erreur connexion:', data.error);
                    showError(data.error || 'Erreur de connexion', email);
                }
            } catch (error) {
                console.error('Erreur lors de la connexion:', error);
                showError('Erreur de connexion au serveur');
            }
        });
    } else {
        console.error('Form not found in fragment');
    }
    
    // Ajouter le formulaire au conteneur
    container.appendChild(loginFragment);
    
    // Retourner le fragment complet avec breadcrumb et formulaire
    const finalFragment = document.createDocumentFragment();
    finalFragment.appendChild(container);
    
    return finalFragment;
}
