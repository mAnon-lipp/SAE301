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
     * - Vérification des stocks disponibles (US010)
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
        
        // US010 - Vérifier les stocks disponibles pour chaque item
        require_once "src/Repository/ProductVariantRepository.php";
        $variantRepo = new ProductVariantRepository();
        
        foreach ($obj->items as $item) {
            $hasVariantId = isset($item->variant_id);
            
            if ($hasVariantId) {
                // Vérifier le stock du variant
                $variant = $variantRepo->find($item->variant_id);
                
                if (!$variant) {
                    http_response_code(400);
                    return ["error" => "Article invalide dans la commande."];
                }
                
                // Vérifier que la quantité ne dépasse pas le stock disponible
                if ($item->quantite > $variant->getStock()) {
                    http_response_code(400);
                    return [
                        "error" => "Stock insuffisant",
                        "message" => "Seulement " . $variant->getStock() . " article(s) disponible(s) en stock.",
                        "variant_id" => $item->variant_id,
                        "requested_quantity" => $item->quantite,
                        "available_stock" => $variant->getStock()
                    ];
                }
                
                // Vérifier que le produit n'est pas épuisé
                if ($variant->getStock() <= 0) {
                    http_response_code(400);
                    return [
                        "error" => "Article épuisé",
                        "message" => "Cet article n'est plus disponible.",
                        "variant_id" => $item->variant_id
                    ];
                }
            }
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
        
        $oldStatut = $order->getStatut(); // Récupérer l'ancien statut
        
        // Mettre à jour les champs autorisés
        if (isset($obj->statut)) {
            $newStatut = $obj->statut;
            $order->setStatut($newStatut);
            
            // US011 - Logique de recrédit du stock (Critère 2)
            if ($newStatut === 'Annulée' && $oldStatut !== 'Annulée') {
                $orderId = $order->getId();
                $items = $this->orders->findItemsByOrderId($orderId); // Récupérer les items de la commande
                
                require_once "src/Repository/ProductVariantRepository.php";
                $variantRepo = new ProductVariantRepository();
                
                // Créer une transaction spécifique pour le recrédit
                try {
                    $this->orders->cnx->beginTransaction();
                    
                    foreach ($items as $item) {
                        $variantId = $item->getVariantId();
                        $quantite = $item->getQuantite();
                        
                        // Incrémenter le stock
                        if (!$variantRepo->incrementStock((int)$variantId, (int)$quantite, (int)$orderId)) {
                            throw new Exception("Échec du recrédit de stock pour le variant " . $variantId);
                        }
                    }
                    
                    $success = $this->orders->update($order); // Mettre à jour le statut dans la même transaction
                    
                    if ($success) {
                        $this->orders->cnx->commit();
                    } else {
                        throw new Exception("Échec de la mise à jour du statut.");
                    }
                } catch (Exception $e) {
                    $this->orders->cnx->rollBack();
                    error_log("US011 - Erreur de recrédit du stock/statut : " . $e->getMessage());
                    http_response_code(500);
                    return ["error" => "Erreur lors de l'annulation de la commande et du recrédit du stock."];
                }
                
                return $order;
            }
        }
        
        // Si le statut n'est PAS 'Annulée' ou pas de changement de statut, mise à jour standard
        if (isset($obj->statut) && $obj->statut !== 'Annulée') {
            $success = $this->orders->update($order);
            if ($success) {
                return $order;
            } else {
                http_response_code(500);
                return ["error" => "Erreur lors de la mise à jour."];
            }
        }
        
        // Si aucune mise à jour pertinente n'est faite
        return $order;
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
