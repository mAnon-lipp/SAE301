
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
import { OrdersPage } from "./pages/orders/page.js";
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
router.addRoute("/account", AccountPage, { requireAuth: true }); // Page d'accueil du compte (avec les cartes)
router.addRoute("/commandes", OrdersPage, { requireAuth: true }); // Page de la liste des commandes
router.addRoute("/profil", ProfilePage, { requireAuth: true }); // Page de modification du profil

router.addRoute("*", The404Page);

// Démarrer le routeur (async pour attendre la vérification de session)
(async () => {
    await router.start();
    // --- Initialisation du Panier (overlay + panel) ---
    try {
        const { CartOverlayView } = await import("./ui/cart-overlay/index.js");
        const { CartPanelView } = await import("./ui/cart-panel/index.js");
        const { CartModel } = await import("./data/cart.js");

        const cartOverlayFragment = CartOverlayView.dom();
        const cartPanelFragment = CartPanelView.dom();

        const cartContainer = document.createElement('div');
        cartContainer.appendChild(cartOverlayFragment);
        cartContainer.appendChild(cartPanelFragment);
        document.body.appendChild(cartContainer);

        // Attacher l'événement d'ouverture (si bouton présent dans le nav)
        const openCartBtn = document.getElementById('open-cart-panel');
        if (openCartBtn) {
            openCartBtn.addEventListener('click', () => {
                CartPanelView.open();
            });
        }

        // Listener délégué : au cas où le nav est inséré dynamiquement après
        // l'initialisation, écouter sur le document pour tout clic sur
        // l'icône du panier (id ou data-open-cart)
        document.addEventListener('click', (ev) => {
            const target = ev.target;
            const btn = target.closest('#open-cart-panel, [data-open-cart]');
            if (btn) {
                CartPanelView.open();
            }
        });

        // Fermer le panier en cliquant sur l'overlay
        const cartOverlay = document.querySelector('[data-cart-overlay]');
        if (cartOverlay) {
            cartOverlay.classList.add('hidden');
            cartOverlay.addEventListener('click', () => {
                CartPanelView.close();
            });
        }

        // Mettre à jour le compteur après le démarrage
        CartModel.updateGlobalCount();
    } catch (e) {
        console.warn('Impossible d\'initialiser le panier :', e);
    }
})();

