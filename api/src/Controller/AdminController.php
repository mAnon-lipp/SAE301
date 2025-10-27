<?php
require_once "src/Controller/EntityController.php";
// Importer les Repositories nécessaires pour les stats et les logs
require_once "src/Repository/UserRepository.php";
require_once "src/Repository/OrderRepository.php";
require_once "src/Repository/ProductRepository.php";
require_once "src/Repository/AdminLogRepository.php";
require_once "src/Class/AdminLog.php";

class AdminController extends EntityController {

    private UserRepository $userRepo;
    private OrderRepository $orderRepo;
    private ProductRepository $productRepo;
    private AdminLogRepository $logRepo;

    public function __construct(){
        // Assurer que la session est démarrée
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        // Initialiser les repositories pour récupérer les stats
        $this->userRepo = new UserRepository();
        $this->orderRepo = new OrderRepository();
        $this->productRepo = new ProductRepository();
        $this->logRepo = new AdminLogRepository();
    }

    /**
     * Crée une entrée de log admin
     */
    private function logAdminAction(string $action, ?string $entity = null, ?int $entityId = null, ?string $details = null) {
        try {
            $adminId = $_SESSION['auth_user_id'] ?? 0;
            $log = new AdminLog();
            $log->setAdminUserId($adminId);
            $log->setActionType($action);
            $log->setTargetEntity($entity);
            $log->setTargetId($entityId);
            $log->setDetails($details);
            $this->logRepo->save($log);
        } catch (Exception $e) {
            error_log("Erreur lors de la création du log admin: " . $e->getMessage());
        }
    }

    /**
     * Vérifie si l'utilisateur connecté est un admin
     */
    private function checkAdminAuth(): bool {
        return isset($_SESSION['auth_user_id'], $_SESSION['is_admin']) && $_SESSION['is_admin'] === true;
    }

    /**
     * Gère les requêtes GET pour l'admin (ex: dashboard)
     */
    protected function processGetRequest(HttpRequest $request) {
        // -- SECURITE : Vérifier si l'utilisateur est admin --
        if (!$this->checkAdminAuth()) {
            http_response_code(403); // Forbidden
            return ["error" => "Accès administrateur requis."];
        }

        // On vérifie si la requête concerne 'orders'
        // L'URL sera /api/admin?resource=orders
        $resource = $request->getParam("resource");

        if ($resource === "orders") {
            // --- AC: Je vois la liste de toutes les commandes ---
            $id = $request->getId();
            if ($id) {
                // GET /api/admin/{id}?resource=orders (Détail d'une commande)
                // On utilise find() qui charge déjà les items
                $order = $this->orderRepo->find($id); 
                if (!$order) {
                    http_response_code(404);
                    return ["error" => "Commande introuvable"];
                }
                return $order;
            } else {
                // GET /api/admin?resource=orders (Liste de toutes les commandes)
                return $this->orderRepo->findAllWithClientInfo();
            }
        }

        // --- Comportement par défaut (Dashboard) ---
        try {
            $stats = [
                "userCount" => $this->userRepo->countAll(),
                "orderCount" => $this->orderRepo->countAll(),
                "productCount" => $this->productRepo->countAll(),
                "message" => "Données du tableau de bord Admin"
            ];
            return $stats;
        } catch (Exception $e) {
            http_response_code(500);
            return ["error" => "Erreur lors de la récupération des statistiques: " . $e->getMessage()];
        }
    }

    /**
     * Gère les POST pour l'admin (ex: actions en lot)
     */
    protected function processPostRequest(HttpRequest $request) {
        if (!$this->checkAdminAuth()) {
            http_response_code(403);
            return ["error" => "Accès administrateur requis."];
        }

        $json = $request->getJson();
        $obj = json_decode($json);

        // --- AC: Actions en lot ---
        // L'URL sera POST /api/admin?action=batch-update-status
        $action = $request->getParam("action");

        if ($action === 'batch-update-status' && isset($obj->orderIds) && isset($obj->newStatus)) {
            $orderIds = $obj->orderIds;
            $newStatus = $obj->newStatus;

            if (!is_array($orderIds) || empty($orderIds)) {
                http_response_code(400);
                return ["error" => "Liste d'IDs de commandes invalide."];
            }

            $allowedStatus = ['en cours', 'disponible', 'retirée', 'annulée'];
            if (!in_array($newStatus, $allowedStatus)) {
                http_response_code(400);
                return ["error" => "Statut invalide."];
            }

            $successCount = 0;
            $errors = [];

            // On ne gère PAS l'impact sur les stocks pour les actions en lot
            foreach ($orderIds as $id) {
                $order = $this->orderRepo->find($id);
                if ($order) {
                    $oldStatus = $order->getStatut();
                    $order->setStatut($newStatus);
                    if ($this->orderRepo->update($order)) {
                        $successCount++;
                        // DoD: Logs
                        $this->logAdminAction(
                            'ORDER_BATCH_UPDATE', 
                            'Commandes', 
                            $id, 
                            "Statut changé (lot) de '$oldStatus' à '$newStatus'."
                        );
                    } else {
                        $errors[] = $id;
                    }
                } else {
                    $errors[] = $id;
                }
            }

            return [
                "success" => true, 
                "updated" => $successCount, 
                "errors" => $errors
            ];
        }

        http_response_code(405); 
        return ["error" => "Méthode non autorisée ou action inconnue."];
    }

    /**
     * Gère les PATCH pour l'admin (ex: changement de statut d'une commande)
     */
    protected function processPatchRequest(HttpRequest $request) {
        if (!$this->checkAdminAuth()) {
            http_response_code(403);
            return ["error" => "Accès administrateur requis."];
        }

        $id = $request->getId();
        if (!$id) {
            http_response_code(400);
            return ["error" => "ID de commande requis."];
        }

        $order = $this->orderRepo->find($id);
        if (!$order) {
            http_response_code(404);
            return ["error" => "Commande introuvable."];
        }

        $json = $request->getJson();
        $obj = json_decode($json);

        // --- AC: Je peux modifier le statut d'une commande ---
        if (isset($obj->statut)) {
            $oldStatus = $order->getStatut();
            $newStatus = $obj->statut;

            // Valider le nouveau statut
            $allowedStatus = ['en cours', 'disponible', 'retirée', 'annulée'];
            if (!in_array($newStatus, $allowedStatus)) {
                http_response_code(400);
                return ["error" => "Statut invalide."];
            }

            $order->setStatut($newStatus);

            // DoD: Gestion des statuts avec impact sur les stocks
            // Si l'admin ANNULE une commande qui ne l'était pas
            if ($newStatus === 'annulée' && $oldStatus !== 'annulée') {
                // On reprend la logique de recrédit de US011
                require_once "src/Repository/ProductVariantRepository.php";
                $variantRepo = new ProductVariantRepository();
                $items = $this->orderRepo->findItemsByOrderId($id);

                try {
                    $this->orderRepo->cnx->beginTransaction();
                    foreach ($items as $item) {
                        $variantRepo->incrementStock((int)$item->getVariantId(), (int)$item->getQuantite(), (int)$id);
                    }
                    $this->orderRepo->update($order); // Met à jour le statut
                    $this->orderRepo->cnx->commit();

                    // DoD: Logs
                    $this->logAdminAction(
                        'ORDER_STATUS_CHANGE', 
                        'Commandes', 
                        $id, 
                        "Statut changé de '$oldStatus' à '$newStatus'. Stock recrédité."
                    );

                } catch (Exception $e) {
                    $this->orderRepo->cnx->rollBack();
                    http_response_code(500);
                    return ["error" => "Erreur lors du recrédit du stock: " . $e->getMessage()];
                }

            } else {
                // Changement de statut simple (ex: "en cours" -> "disponible")
                // Le stock a déjà été décrémenté à la création. On ne fait rien.
                $this->orderRepo->update($order);

                // DoD: Logs
                $this->logAdminAction(
                    'ORDER_STATUS_CHANGE', 
                    'Commandes', 
                    $id, 
                    "Statut changé de '$oldStatus' à '$newStatus'."
                );
            }

            return $order;
        }

        http_response_code(400);
        return ["error" => "Aucune action valide demandée."];
    }

    protected function processDeleteRequest(HttpRequest $request) { http_response_code(405); return ["error" => "Méthode non autorisée."]; }
    protected function processPutRequest(HttpRequest $request) { http_response_code(405); return ["error" => "Méthode non autorisée."]; }
}
?>
