## Configuration .htaccess — Redirection et support des méthodes HTTP

Cette page explique le rôle et le fonctionnement du fichier `.htaccess` présent dans le dossier `api/`. Ce fichier configure Apache pour permettre à l'API REST de fonctionner correctement en gérant le routage et les requêtes cross-origin (CORS).

### Vue d'ensemble

Le fichier `.htaccess` dans `api/` remplit deux fonctions principales :

1. **CORS (Cross-Origin Resource Sharing)** : permettre au client frontend (qui tourne sur un domaine/port différent) d'accéder à l'API.
2. **Routage (URL Rewriting)** : rediriger toutes les requêtes vers `index.php` pour qu'un seul point d'entrée gère toutes les routes de l'API.

### Configuration CORS

Les directives `Header set` configurent les en-têtes HTTP pour autoriser les requêtes cross-origin :

```apache
Header set Access-Control-Allow-Origin "*"
Header set Access-Control-Allow-Methods "GET, POST, DELETE, PATCH, OPTIONS"
Header set Access-Control-Allow-Headers "Content-Type, Authorization"
Header set Access-Control-Allow-Credentials "true"
```

#### Explications ligne par ligne

- **Access-Control-Allow-Origin "*"** : autorise les requêtes provenant de n'importe quelle origine (domaine/port). 
  - En production, remplacez `"*"` par l'origine exacte de votre client (ex. `"https://monapp.com"`).
  - Si vous utilisez credentials (cookies, auth), vous **devez** spécifier une origine précise au lieu de `*`.

- **Access-Control-Allow-Methods** : liste les méthodes HTTP autorisées par l'API.
  - GET : lecture de ressources
  - POST : création de ressources
  - DELETE : suppression de ressources
  - PATCH : modification partielle de ressources
  - OPTIONS : requête de pré-vérification (preflight) envoyée automatiquement par les navigateurs pour vérifier les permissions CORS avant une requête réelle.

- **Access-Control-Allow-Headers** : indique quels en-têtes HTTP personnalisés le client peut envoyer.
  - `Content-Type` : pour spécifier le format des données (ex. `application/json`).
  - `Authorization` : pour transmettre un token d'authentification (ex. Bearer token).

- **Access-Control-Allow-Credentials "true"** : autorise l'envoi de cookies ou credentials dans les requêtes cross-origin.
  - Attention : si activé, vous ne pouvez pas utiliser `Access-Control-Allow-Origin "*"` ; vous devez spécifier l'origine exacte.

### Configuration du Rewriting (Routage)

Cette section redirige toutes les requêtes vers `index.php` :

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteRule .* index.php
</IfModule>
```

#### Explications

- **RewriteEngine On** : active le module de réécriture d'URL d'Apache.

- **RewriteRule .* index.php** : toute URL (`.` = n'importe quel caractère, `*` = répété 0 ou plusieurs fois) est redirigée vers `index.php`.
  - Cela signifie que `/api/products`, `/api/products/1`, `/api/users/42` sont toutes traitées par `index.php`.
  - Le script PHP `index.php` analyse ensuite `$_SERVER['REQUEST_URI']` pour déterminer la ressource et l'action demandée.

- **Lignes commentées** : le fichier contient des configurations alternatives commentées :
  - `RewriteCond %{REQUEST_FILENAME} !-f` : ne redirige que si le fichier demandé n'existe pas physiquement (utile si vous voulez servir des fichiers statiques directement).
  - `RewriteBase /` : définit manuellement le chemin de base si l'API est installée dans un sous-répertoire.
  - Ces lignes sont commentées car la configuration actuelle utilise une redirection systématique (plus simple pour une API pure).

### Pourquoi cette configuration ?

Dans une API REST, on veut des URLs "propres" comme `/api/products/42` au lieu de `/index.php?resource=products&id=42`. Le module de réécriture d'Apache masque `index.php` et laisse le code PHP parser l'URI pour extraire la ressource et l'identifiant.

Le support CORS est indispensable si votre frontend et votre backend ne sont pas servis depuis le même domaine/port (ce qui est fréquent en développement : le client tourne sur `localhost:5173` avec Vite, l'API sur `localhost:8000` avec PHP).

### Vérifications et tests

#### Vérifier que le module rewrite est activé

Sur votre serveur Apache, assurez-vous que `mod_rewrite` est activé. Sur Ubuntu/Debian :

```bash
sudo a2enmod rewrite
sudo systemctl restart apache2
```

Sur macOS (Apache intégré) ou serveurs mutualisés, vérifiez avec votre hébergeur.

#### Tester la redirection

1. Démarrez le serveur PHP dans le dossier `api/` :
   ```bash
   php -S localhost:8000 -t api
   ```

2. Envoyez une requête GET vers une route de l'API :
   ```bash
   curl http://localhost:8000/api/products
   ```

3. Vérifiez que la réponse provient bien de `index.php` (vous devriez voir du JSON si tout fonctionne).

#### Tester CORS

Depuis un navigateur (ou avec un outil comme Postman), envoyez une requête depuis un domaine différent et vérifiez que les en-têtes `Access-Control-Allow-*` sont présents dans la réponse.

Vous pouvez inspecter les en-têtes avec curl :

```bash
curl -I -X OPTIONS http://localhost:8000/api/products \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET"
```

Vous devriez voir les en-têtes CORS dans la réponse.

### Limitations et sécurité

- **Origine wildcard (`*`)** : ne l'utilisez pas en production si vous activez `Access-Control-Allow-Credentials`. Spécifiez toujours l'origine exacte.
- **Méthodes autorisées** : limitez aux méthodes réellement utilisées par votre API.
- **En-têtes autorisés** : ajoutez uniquement les en-têtes dont vous avez besoin (par exemple, n'autorisez pas `Authorization` si vous n'utilisez pas d'authentification).
- **Logs et débogage** : si les redirections ne fonctionnent pas, vérifiez les logs Apache (`/var/log/apache2/error.log` sur Linux) et testez avec `RewriteLog` (si disponible).

### Exemple de configuration alternative (plus stricte)

Si votre client frontend est toujours sur `http://localhost:5173`, vous pouvez utiliser :

```apache
Header set Access-Control-Allow-Origin "http://localhost:5173"
Header set Access-Control-Allow-Methods "GET, POST, PATCH, DELETE"
Header set Access-Control-Allow-Headers "Content-Type"
Header set Access-Control-Allow-Credentials "true"
```

Cela renforce la sécurité en restreignant les origines et les méthodes autorisées.

### Ressources complémentaires

- [Documentation Apache mod_rewrite](https://httpd.apache.org/docs/current/mod/mod_rewrite.html)
- [CORS sur MDN](https://developer.mozilla.org/fr/docs/Web/HTTP/CORS)
- [Headers HTTP CORS](https://developer.mozilla.org/fr/docs/Web/HTTP/Headers#cors)

### Conclusion

Le fichier `.htaccess` est essentiel pour faire fonctionner l'API REST côté serveur. Il masque le point d'entrée `index.php`, permet des URLs propres, et autorise les requêtes cross-origin depuis le client frontend. Comprendre ces mécanismes est fondamental pour déboguer et sécuriser votre application web.
