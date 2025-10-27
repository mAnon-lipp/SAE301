import template from "./template.html?raw";
import { htmlToFragment } from "../../lib/utils.js";
import { UserData } from "../../data/user.js";

export function AdminLoginPage(params, router) {
    const pageFragment = htmlToFragment(template);
    const form = pageFragment.querySelector('#adminLoginForm');
    const errorMessageElement = pageFragment.querySelector('#errorMessage');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessageElement.style.display = 'none';

        const emailInput = form.querySelector('#email');
        const passwordInput = form.querySelector('#password');
        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            const response = await UserData.login(email, password);

            if (response && response.success && response.is_admin) {
                // C'est bien un admin !
                router.setAuth(true, response.user, true); // Met à jour l'état du routeur

                // Redirige vers le dashboard ou la page demandée avant login
                const redirect = sessionStorage.getItem('redirectAfterLogin');
                sessionStorage.removeItem('redirectAfterLogin');
                router.navigate(redirect || '/admin/dashboard');

            } else if (response && response.success && !response.is_admin) {
                // Connecté mais pas admin
                errorMessageElement.textContent = "Accès refusé. Compte non administrateur.";
                errorMessageElement.style.display = 'block';
                router.setAuth(false);
            } else {
                // Identifiants incorrects ou autre erreur
                errorMessageElement.textContent = response.error || "Identifiants incorrects.";
                errorMessageElement.style.display = 'block';
                router.setAuth(false);
            }
        } catch (error) {
            console.error("Erreur login admin:", error);
            errorMessageElement.textContent = "Erreur de connexion.";
            errorMessageElement.style.display = 'block';
            router.setAuth(false);
        }
    });

    return pageFragment;
}
