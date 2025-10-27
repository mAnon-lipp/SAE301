// Classe Router avec paramètres dynamiques, guards et layouts
import { getRequest, deleteRequest } from './api-request.js';

class Router {
  constructor(id, options = {}) {
    let root = document.getElementById(id);

    if (!root) {
      root = document.createElement('div');
      console.warn(`Element with id "${id}" not found. Creating a new div as root.`);
      document.body.appendChild(root);
    }

    this.root = root;
    this.routes = [];
    this.layouts = {};
    this.currentRoute = null;
    this.isAuthenticated = false;
  this.user = null; // NOUVEAU : Stocker l'objet utilisateur
  this.isAdmin = false; // NOUVEAU : Stocker si l'utilisateur est admin
    this.loginPath = options.loginPath || '/login';
    this.apiUrl = options.apiUrl || '/api/'; // NOUVEAU : URL de l'API
    
    // Écouter les changements d'URL
    window.addEventListener('popstate', () => this.handleRoute());
    
    // Intercepter les clics sur les liens
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-link]')) {
        e.preventDefault();
        this.navigate(e.target.getAttribute('href'));
      }
    });
  }
  
  // Définir l'état d'authentification et les données utilisateur
  setAuth(isAuth, user = null, isAdmin = false) {
    this.isAuthenticated = isAuth;
    this.user = user;
    this.isAdmin = isAuth && isAdmin; // isAdmin ne peut être true que si isAuth est true

    if (isAuth && user) {
      sessionStorage.setItem('auth_user', JSON.stringify(user));
      sessionStorage.setItem('is_authenticated', 'true');
      sessionStorage.setItem('is_admin', this.isAdmin ? 'true' : 'false');
    } else {
      sessionStorage.removeItem('auth_user');
      sessionStorage.removeItem('is_authenticated');
      sessionStorage.removeItem('is_admin');
    }
  }
  
  // Enregistrer un layout pour un segment de route
  addLayout(pathPrefix, layoutFn) {
    this.layouts[pathPrefix] = layoutFn;
    return this;
  }
  
  // Trouver le layout correspondant à un chemin
  findLayout(path) {
    // Chercher le segment le plus spécifique (le plus long qui match)
    let matchedLayout = null;
    let longestMatch = 0;
    
    for (const [prefix, layout] of Object.entries(this.layouts)) {
      if (path.startsWith(prefix) && prefix.length > longestMatch) {
        matchedLayout = layout;
        longestMatch = prefix.length;
      }
    }
    
    return matchedLayout;
  }
  
  // Ajouter une route
  addRoute(path, handler, options = {}) {
    const regex = this.pathToRegex(path);
    const keys = this.extractParams(path);
    this.routes.push({ 
      path, 
      regex, 
      keys, 
      handler,
      requireAuth: options.requireAuth || false,
      requireAdmin: options.requireAdmin || false,
      useLayout: options.useLayout !== false // true par défaut
    });
    return this;
  }
  
  // Convertir un chemin en regex
  pathToRegex(path) {
    if (path === '*') return /.*/;
    
    const pattern = path
      .replace(/\//g, '\\/')
      .replace(/:(\w+)/g, '([^\\/]+)')
      .replace(/\*/g, '.*');
    
    return new RegExp('^' + pattern + '$');
  }
  
  // Extraire les noms des paramètres
  extractParams(path) {
    const params = [];
    const matches = path.matchAll(/:(\w+)/g);
    for (const match of matches) {
      params.push(match[1]);
    }
    return params;
  }
  
  // Extraire les valeurs des paramètres
  getParams(route, path) {
    const matches = path.match(route.regex);
    if (!matches) return {};
    
    const params = {};
    for (let i = 0; i < route.keys.length; i++) {
      const key = route.keys[i];
      params[key] = matches[i + 1];
    }
    return params;
  }
  
  // Naviguer vers une route
  navigate(path) {
    window.history.pushState(null, null, path);
    this.handleRoute();
  }
  
  // Gérer la route actuelle
  handleRoute() {
    const path = window.location.pathname;
    
    // Trouver la route correspondante
    for (const route of this.routes) {
      if (route.regex.test(path)) {
        // Si l'utilisateur est déjà connecté et essaie d'accéder à login/signup
        if (this.isAuthenticated && (path === '/login' || path === '/signup')) {
          this.navigate('/account');
          return;
        }
        
        // <-- AJOUT : Vérification requireAdmin -->
        if (route.requireAdmin && (!this.isAuthenticated || !this.isAdmin)) {
          // Sauvegarde où on voulait aller
          sessionStorage.setItem('redirectAfterLogin', path);
          // Redirige vers la page de login admin
          this.navigate('/admin/login');
          return;
        }
        
        // Vérifier l'authentification si nécessaire
        if (route.requireAuth && !this.isAuthenticated) {
          sessionStorage.setItem('redirectAfterLogin', path);
          this.navigate(this.loginPath);
          return;
        }
        
        this.currentRoute = path;
        const params = this.getParams(route, path);
        
        // MODIFIÉ : Le handler reçoit le paramètre 'router'
        const content = route.handler(params, this);
        
        if (content instanceof Promise) {
          // Le handler retourne une promesse
          content.then(res => {
            this.renderContent(res, route, path);
          });
        } else {
          // Le handler retourne directement le contenu
          this.renderContent(content, route, path);
        }
        return;
      }
    }
    
    // Route 404 si aucune correspondance
    const notFound = this.routes.find(r => r.path === '*');
    if (notFound) {
      const content = notFound.handler({});
      this.root.innerHTML = content;
    }
  }
  
  // Rendre le contenu dans le root ou via un layout
  renderContent(content, route, path) {
    const isFragment = content instanceof DocumentFragment;
    
    // Appliquer le layout seulement si useLayout est true
    if (route.useLayout) {
      const layoutFn = this.findLayout(path);
      if (layoutFn) {
        // Le layout retourne un DocumentFragment
        const layoutFragment = layoutFn();
        
        // Chercher l'élément <slot> dans le layout
        const contentSlot = layoutFragment.querySelector('slot');
        
        if (contentSlot) {
          // Insérer le contenu de la page dans le slot
          if (isFragment) {
            contentSlot.replaceWith(content);
          } else {
            // Créer un fragment temporaire pour le HTML string
            const tempFragment = document.createElement('template');
            tempFragment.innerHTML = content;
            contentSlot.replaceWith(tempFragment.content);
          }
        } else {
          console.warn('Layout does not contain a <slot> element. Content will not be inserted.');
        }
        
        // Insérer le layout complet dans this.root
        this.root.innerHTML = '';
        this.root.appendChild(layoutFragment);
      } else {
        // Pas de layout trouvé, afficher directement
        if (isFragment) {
          this.root.innerHTML = '';
          this.root.appendChild(content);
        } else {
          this.root.innerHTML = content;
        }
      }
    } else {
      // Pas de layout, afficher directement
      if (isFragment) {
        this.root.innerHTML = '';
        this.root.appendChild(content);
      } else {
        this.root.innerHTML = content;
      }
    }
    
    // Attacher les event listeners après le rendu
    this.attachEventListeners(path);
  }
  
  // Attacher les event listeners après le rendu
  attachEventListeners(path) {
    // Event listener pour le bouton de login
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        this.login();
      });
    }
    
    // Event listener pour le bouton de logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        this.logout();
      });
    }
  }
  
  // Se connecter et rediriger vers la page demandée
  login() {
    this.setAuth(true);
    const redirect = sessionStorage.getItem('redirectAfterLogin');
    sessionStorage.removeItem('redirectAfterLogin');
    this.navigate(redirect || '/dashboard');
  }
  
  // Se déconnecter avec appel API (Critère 3)
  async logout() {
    // Déterminer si l'utilisateur était dans la zone admin
    const wasAdmin = this.isAdmin || (this.currentRoute && this.currentRoute.startsWith('/admin'));

    this.setAuth(false); // Déconnexion optimiste côté client

    // Appel API pour détruire la session côté serveur
    try {
      await deleteRequest('auth');
      // Si c'était un admin, rediriger vers la page de connexion admin
      if (wasAdmin) {
        this.navigate('/admin/login');
      } else {
        this.navigate(this.loginPath);
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion API:', error);
      if (wasAdmin) {
        this.navigate('/admin/login');
      } else {
        this.navigate(this.loginPath);
      }
    }
  }
  
  // Démarrer le routeur et vérifier le statut de session
  async start() {
    // Toujours vérifier avec le serveur si une session existe
    try {
      const data = await getRequest('auth');
      
      if (data && data.is_authenticated && data.user) {
        // Session valide côté serveur — inclut is_admin
        this.setAuth(true, data.user, data.is_admin ?? false);
      } else {
        // Pas de session côté serveur
        this.setAuth(false);
      }
    } catch (error) {
      // Erreur réseau - fallback sur sessionStorage
      const storedUser = sessionStorage.getItem('auth_user');
      const isAuthenticated = sessionStorage.getItem('is_authenticated') === 'true';
      const isAdmin = sessionStorage.getItem('is_admin') === 'true';
      if (isAuthenticated && storedUser) {
        this.setAuth(true, JSON.parse(storedUser), isAdmin);
      } else {
        this.setAuth(false);
      }
    }
    
    this.handleRoute();
  }
}

export { Router };