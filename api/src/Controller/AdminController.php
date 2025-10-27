<?php
require_once "src/Controller/EntityController.php";
// Importer les Repositories nécessaires pour les stats
require_once "src/Repository/UserRepository.php";
require_once "src/Repository/OrderRepository.php";
require_once "src/Repository/ProductRepository.php";

class AdminController extends EntityController {

    private UserRepository $userRepo;
    private OrderRepository $orderRepo;
    private ProductRepository $productRepo;

    public function __construct(){
        // Assurer que la session est démarrée
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        // Initialiser les repositories pour récupérer les stats
        $this->userRepo = new UserRepository();
        $this->orderRepo = new OrderRepository();
        $this->productRepo = new ProductRepository();
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

        // Pour l'instant, on retourne juste des stats simples pour le dashboard
        try {
            $stats = [
                "userCount" => $this->userRepo->countAll(),
                "orderCount" => $this->orderRepo->countAll(),
                "productCount" => $this->productRepo->countAll(),
                "message" => "Données du tableau de bord Admin"
            ];
            return $stats; // DoD: Dashboard informatif
        } catch (Exception $e) {
            http_response_code(500);
            return ["error" => "Erreur lors de la récupération des statistiques: " . $e->getMessage()];
        }
    }

    // Bloquer les autres méthodes pour le dashboard pour l'instant
    protected function processPostRequest(HttpRequest $request) { http_response_code(405); return ["error" => "Méthode non autorisée."]; }
    protected function processPatchRequest(HttpRequest $request) { http_response_code(405); return ["error" => "Méthode non autorisée."]; }
    protected function processDeleteRequest(HttpRequest $request) { http_response_code(405); return ["error" => "Méthode non autorisée."]; }
    protected function processPutRequest(HttpRequest $request) { http_response_code(405); return ["error" => "Méthode non autorisée."]; }
}
?>
