
import { Router } from "./lib/router.js";
import { AboutPage } from "./pages/about/page.js";
import { HomePage } from "./pages/home/page.js";
import { ProductsPage } from "./pages/products/page.js";
import { ProductDetailPage } from "./pages/productDetail/page.js";

import { RootLayout } from "./layouts/root/layout.js";
import { AccountLayout } from "./layouts/account/layout.js";
import { CheckoutLayout } from "./layouts/checkout/layout.js";
import { The404Page } from "./pages/404/page.js";

// NOUVELLES PAGES
import { LoginPage } from "./pages/login/page.js";
import { SignupPage } from "./pages/signup/page.js";
import { AccountPage } from "./pages/account/page.js";
import { ProfilePage } from "./pages/profile/page.js";
import { OrdersPage } from "./pages/orders/page.js";
import { CheckoutPage } from "./pages/checkout/page.js";
import { OrderConfirmationPage } from "./pages/order-confirmation/page.js";
// ---

// US009 - Initialisation des seuils de stock depuis l'API
import { StockThresholdData } from "./data/stockThreshold.js";
import { configureThresholds } from "./lib/stock-status.js";
// ---

const router = new Router('app', {
    loginPath: '/login',
});

// Rendre le routeur accessible globalement pour certaines pages
window.router = router;

router.addLayout("/", RootLayout);
router.addLayout("/account", AccountLayout); // Layout spécifique avec menu utilisateur
router.addLayout("/profil", AccountLayout); // Layout account pour la page profil
router.addLayout("/commandes", AccountLayout); // Layout account pour la page commandes
router.addLayout("/checkout", CheckoutLayout); // Layout checkout avec nav simplifiée
router.addLayout("/order-confirmation", CheckoutLayout); // Layout checkout pour la page de confirmation

// Routes publiques
router.addRoute("/", ProductsPage);
router.addRoute("/about", AboutPage);

router.addRoute("/products", ProductsPage);
router.addRoute("/products/category/:id/:slug", ProductsPage);
router.addRoute("/products/:id/:slug", ProductDetailPage);

// Route checkout
router.addRoute("/checkout", CheckoutPage, { requireAuth: true }); // Requiert l'authentification
router.addRoute("/order-confirmation", OrderConfirmationPage);
router.addRoute("/order-confirmation/:orderNumber", OrderConfirmationPage);

// Routes d'authentification
router.addRoute("/login", LoginPage, { useLayout: false }); // Page de connexion sans layout
router.addRoute("/signup", SignupPage, { useLayout: false }); // Page d'inscription sans layout
router.addRoute("/logout", async (params, r) => {
    await r.logout();
    return ''; // Retourner une chaîne vide au lieu d'undefined
}, { useLayout: false }); // Déconnexion (Critère 3)

// Routes protégées (Critère 6)
router.addRoute("/account", AccountPage, { requireAuth: true }); // Page d'accueil du compte (avec les cartes)
router.addRoute("/commandes", OrdersPage, { requireAuth: true }); // Page de la liste des commandes
router.addRoute("/profil", ProfilePage, { requireAuth: true }); // Page de modification du profil

router.addRoute("*", The404Page);

// Démarrer le routeur (async pour attendre la vérification de session)
(async () => {
    // US009 - Charger les seuils de stock depuis l'API au démarrage
    try {
        const thresholds = await StockThresholdData.getThresholds();
        configureThresholds(thresholds);
    } catch (error) {
        console.warn('Impossible de charger les seuils de stock, utilisation des valeurs par défaut:', error);
    }
    
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

