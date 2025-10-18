
import { Router } from "./lib/router.js";
import { AboutPage } from "./pages/about/page.js";
import { HomePage } from "./pages/home/page.js";
import { ProductsPage } from "./pages/products/page.js";
import { ProductDetailPage } from "./pages/productDetail/page.js";

import { RootLayout } from "./layouts/root/layout.js";
import { AccountLayout } from "./layouts/account/layout.js";
import { The404Page } from "./pages/404/page.js";

// NOUVELLES PAGES
import { LoginPage } from "./pages/login/page.js";
import { SignupPage } from "./pages/signup/page.js";
import { AccountPage } from "./pages/account/page.js";
import { ProfilePage } from "./pages/profile/page.js";
// ---

// URL de l'API (doit correspondre à votre configuration)
const API_URL = "https://mmi.unilim.fr/~lippler1/SAE301/api/"; 

const router = new Router('app', {
    loginPath: '/login',
    apiUrl: API_URL 
});

router.addLayout("/", RootLayout);
router.addLayout("/account", AccountLayout); // Layout spécifique avec menu utilisateur
router.addLayout("/profil", AccountLayout); // Layout account pour la page profil
router.addLayout("/commandes", AccountLayout); // Layout account pour la page commandes

// Routes publiques
router.addRoute("/", ProductsPage);
router.addRoute("/about", AboutPage);

router.addRoute("/products", ProductsPage);
router.addRoute("/products/category/:id/:slug", ProductsPage);
router.addRoute("/products/:id/:slug", ProductDetailPage);

// Routes d'authentification
router.addRoute("/login", LoginPage, { useLayout: false }); // Page de connexion sans layout
router.addRoute("/signup", SignupPage, { useLayout: false }); // Page d'inscription sans layout
router.addRoute("/logout", (params, r) => r.logout(), { useLayout: false }); // Déconnexion (Critère 3)

// Routes protégées (Critère 6)
router.addRoute("/commandes", AccountPage, { requireAuth: true });
router.addRoute("/account", AccountPage, { requireAuth: true });
router.addRoute("/profil", ProfilePage, { requireAuth: true });

router.addRoute("*", The404Page);

// Démarrer le routeur (async pour attendre la vérification de session)
(async () => {
    await router.start();
})();

