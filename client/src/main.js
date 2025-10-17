
import { Router } from "./lib/router.js";
import { AboutPage } from "./pages/about/page.js";
import { HomePage } from "./pages/home/page.js";
import { ProductsPage } from "./pages/products/page.js";
import { ProductDetailPage } from "./pages/productDetail/page.js";

import { RootLayout } from "./layouts/root/layout.js";
import { AccountLayout } from "./layouts/account/layout.js";
import { The404Page } from "./pages/404/page.js";

// Exemple d'utilisation avec authentification

const router = new Router('app');

router.addLayout("/", RootLayout);
router.addLayout("/account", AccountLayout);

router.addRoute("/", ProductsPage);
router.addRoute("/about", AboutPage);

router.addRoute("/products", ProductsPage);
router.addRoute("/products/category/:id/:slug", ProductsPage);
router.addRoute("/products/:id/:slug", ProductDetailPage);

router.addRoute("*", The404Page);

// Démarrer le routeur
router.start();

