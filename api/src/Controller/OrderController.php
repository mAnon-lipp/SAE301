<?php
require_once "src/Controller/EntityController.php";
require_once "src/Repository/OrderRepository.php";
require_once "src/Class/Order.php";

/**
 * OrderController
 * Gère les requêtes API pour les commandes (US007)
 */
class OrderController extends EntityController {

    private OrderRepository $orders;

    public function __construct(){
        $this->orders = new OrderRepository();
        // Assurer que la session est démarrée pour vérifier l'authentification
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }
    
    /**
     * GET /api/orders - Liste toutes les commandes de l'utilisateur connecté
     * GET /api/orders/{id} - Récupère une commande spécifique
     */
    protected function processGetRequest(HttpRequest $request) {
        // Vérifier l'authentification (Critère d'acceptation 1)
        if (!isset($_SESSION['auth_user_id'])) {
            http_response_code(401);
            return ["error" => "Authentification requise."];
        }
        
        $id = $request->getId();
        $userId = $_SESSION['auth_user_id'];
        
        if ($id) {
            // GET /api/orders/{id} - Récupérer une commande spécifique
            $order = $this->orders->find($id);
            
            if (!$order) {
                http_response_code(404);
                return ["error" => "Commande introuvable."];
            }
            
            // Vérifier que la commande appartient à l'utilisateur
            if ($order->getClientId() != $userId) {
                http_response_code(403);
                return ["error" => "Accès refusé."];
            }
            
            return $order;
        } else {
            // GET /api/orders - Récupérer toutes les commandes de l'utilisateur
            return $this->orders->findAllByUserId($userId);
        }
    }
    
    /**
     * POST /api/orders - Créer une nouvelle commande
     * Critères d'acceptation:
     * - Vérifier l'authentification
     * - Validation complète avant enregistrement
     * - Génération numéro unique
     * - Sauvegarde en BDD avec transaction
     */
    protected function processPostRequest(HttpRequest $request) {
        // Vérifier l'authentification (Critère d'acceptation 1)
        if (!isset($_SESSION['auth_user_id'])) {
            http_response_code(401);
            return ["error" => "Authentification requise. Veuillez vous connecter."];
        }
        
        $json = $request->getJson();
        $obj = json_decode($json);
        
        // Validation des données (Critère d'acceptation 2)
        if (!isset($obj->items) || !is_array($obj->items) || count($obj->items) === 0) {
            http_response_code(400);
            return ["error" => "La commande doit contenir au moins un article."];
        }
        
        if (!isset($obj->montant_total) || $obj->montant_total <= 0) {
            http_response_code(400);
            return ["error" => "Le montant total est invalide."];
        }
        
        // Créer la commande (Critère d'acceptation 4 - Numéro unique via auto_increment)
        $order = new Order(0);
        $order->setClientId($_SESSION['auth_user_id']);
        $order->setMontantTotal($obj->montant_total);
        $order->setStatut('Validée');
        $order->setDateCommande(date('Y-m-d H:i:s'));
        
        // Préparer les items
        $items = [];
        foreach ($obj->items as $item) {
            // Accepter soit produit_id (ancien format) soit variant_id (nouveau format avec options)
            $hasProductId = isset($item->produit_id);
            $hasVariantId = isset($item->variant_id);
            
            if ((!$hasProductId && !$hasVariantId) || !isset($item->quantite) || !isset($item->prix_unitaire)) {
                http_response_code(400);
                return ["error" => "Données d'article invalides."];
            }
            
            $itemData = [
                'quantite' => $item->quantite,
                'prix_unitaire' => $item->prix_unitaire
            ];
            
            // Ajouter produit_id ou variant_id selon ce qui est fourni
            if ($hasVariantId) {
                $itemData['variant_id'] = $item->variant_id;
            } else {
                $itemData['produit_id'] = $item->produit_id;
            }
            
            $items[] = $itemData;
        }
        
        $order->setItems($items);
        
        // Sauvegarder en base de données avec transaction (DoD 2)
        $success = $this->orders->save($order);
        
        if ($success) {
            http_response_code(201); // Created
            return $order;
        } else {
            http_response_code(500);
            return ["error" => "Erreur lors de la création de la commande."];
        }
    }
    
    /**
     * PATCH /api/orders/{id} - Mettre à jour le statut d'une commande
     */
    protected function processPatchRequest(HttpRequest $request) {
        // Vérifier l'authentification
        if (!isset($_SESSION['auth_user_id'])) {
            http_response_code(401);
            return ["error" => "Authentification requise."];
        }
        
        $id = $request->getId();
        if (!$id) {
            http_response_code(400);
            return ["error" => "ID de commande requis."];
        }
        
        $order = $this->orders->find($id);
        
        if (!$order) {
            http_response_code(404);
            return ["error" => "Commande introuvable."];
        }
        
        // Vérifier que la commande appartient à l'utilisateur
        if ($order->getClientId() != $_SESSION['auth_user_id']) {
            http_response_code(403);
            return ["error" => "Accès refusé."];
        }
        
        $json = $request->getJson();
        $obj = json_decode($json);
        
        // Mettre à jour les champs autorisés
        if (isset($obj->statut)) {
            $order->setStatut($obj->statut);
        }
        
        $success = $this->orders->update($order);
        
        if ($success) {
            return $order;
        } else {
            http_response_code(500);
            return ["error" => "Erreur lors de la mise à jour."];
        }
    }
    
    /**
     * DELETE /api/orders/{id} - Supprimer une commande (admin seulement normalement)
     */
    protected function processDeleteRequest(HttpRequest $request) {
        // Vérifier l'authentification
        if (!isset($_SESSION['auth_user_id'])) {
            http_response_code(401);
            return ["error" => "Authentification requise."];
        }
        
        $id = $request->getId();
        if (!$id) {
            http_response_code(400);
            return ["error" => "ID de commande requis."];
        }
        
        $order = $this->orders->find($id);
        
        if (!$order) {
            http_response_code(404);
            return ["error" => "Commande introuvable."];
        }
        
        // Vérifier que la commande appartient à l'utilisateur
        if ($order->getClientId() != $_SESSION['auth_user_id']) {
            http_response_code(403);
            return ["error" => "Accès refusé."];
        }
        
        $success = $this->orders->delete($id);
        
        if ($success) {
            http_response_code(204); // No Content
            return ["success" => true];
        } else {
            http_response_code(500);
            return ["error" => "Erreur lors de la suppression."];
        }
    }
    
    // PUT non utilisé pour les commandes
    protected function processPutRequest(HttpRequest $request) {
        http_response_code(405);
        return ["error" => "Méthode non autorisée."];
    }
}
?>
