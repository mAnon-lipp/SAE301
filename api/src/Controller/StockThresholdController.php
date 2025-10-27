<?php
require_once "src/Controller/EntityController.php";
require_once "src/Repository/StockThresholdRepository.php";
require_once "src/Class/StockThreshold.php";

/**
 * StockThresholdController
 * Gère les requêtes API pour les seuils de stock configurables (US009)
 */
class StockThresholdController extends EntityController {

    private StockThresholdRepository $thresholds;

    public function __construct(){
        $this->thresholds = new StockThresholdRepository();
    }
    
    /**
     * GET /api/stockthresholds - Liste tous les seuils de stock
     * Retourne un objet avec les seuils sous forme de clé-valeur
     */
    protected function processGetRequest(HttpRequest $request) {
        $id = $request->getId();
        
        if ($id) {
            // GET /api/stockthresholds/{id} - Récupérer un seuil spécifique
            $threshold = $this->thresholds->find($id);
            
            if (!$threshold) {
                http_response_code(404);
                return ["error" => "Seuil introuvable."];
            }
            
            return $threshold;
        } else {
            // GET /api/stockthresholds - Récupérer tous les seuils
            // Retourner un format optimisé pour le client
            $thresholdsArray = $this->thresholds->getThresholdsAsArray();
            
            if (empty($thresholdsArray)) {
                // Si aucun seuil n'est trouvé, retourner des valeurs par défaut
                return [
                    "LOW_STOCK" => 5,
                    "LOW_VARIANT_COUNT" => 2,
                    "CRITICAL_VARIANT_STOCK" => 3
                ];
            }
            
            return $thresholdsArray;
        }
    }
    
    /**
     * POST /api/stockthresholds - Créer un nouveau seuil (admin seulement)
     */
    protected function processPostRequest(HttpRequest $request) {
        // Vérifier l'authentification et les droits admin
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        if (!isset($_SESSION['auth_user_id'])) {
            http_response_code(401);
            return ["error" => "Authentification requise."];
        }
        
        // TODO: Vérifier que l'utilisateur est admin
        // if (!$_SESSION['auth_user_role'] === 'admin') {
        //     http_response_code(403);
        //     return ["error" => "Droits administrateur requis."];
        // }
        
        $json = $request->getJson();
        $obj = json_decode($json);
        
        // Validation des données
        if (!isset($obj->setting_name) || !isset($obj->setting_value)) {
            http_response_code(400);
            return ["error" => "Données invalides. 'setting_name' et 'setting_value' sont requis."];
        }
        
        if (!is_numeric($obj->setting_value) || $obj->setting_value < 0) {
            http_response_code(400);
            return ["error" => "La valeur doit être un nombre positif."];
        }
        
        $threshold = new StockThreshold(0);
        $threshold->setSettingName($obj->setting_name);
        $threshold->setSettingValue((int)$obj->setting_value);
        
        if (isset($obj->description)) {
            $threshold->setDescription($obj->description);
        }
        
        $success = $this->thresholds->save($threshold);
        
        if ($success) {
            http_response_code(201); // Created
            return $threshold;
        } else {
            http_response_code(500);
            return ["error" => "Erreur lors de la création du seuil."];
        }
    }
    
    /**
     * PATCH /api/stockthresholds/{id} - Mettre à jour un seuil (admin seulement)
     */
    protected function processPatchRequest(HttpRequest $request) {
        // Vérifier l'authentification et les droits admin
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        if (!isset($_SESSION['auth_user_id'])) {
            http_response_code(401);
            return ["error" => "Authentification requise."];
        }
        
        // TODO: Vérifier que l'utilisateur est admin
        
        $id = $request->getId();
        if (!$id) {
            http_response_code(400);
            return ["error" => "ID de seuil requis."];
        }
        
        $threshold = $this->thresholds->find($id);
        
        if (!$threshold) {
            http_response_code(404);
            return ["error" => "Seuil introuvable."];
        }
        
        $json = $request->getJson();
        $obj = json_decode($json);
        
        // Mettre à jour les champs autorisés
        if (isset($obj->setting_value)) {
            if (!is_numeric($obj->setting_value) || $obj->setting_value < 0) {
                http_response_code(400);
                return ["error" => "La valeur doit être un nombre positif."];
            }
            $threshold->setSettingValue((int)$obj->setting_value);
        }
        
        if (isset($obj->description)) {
            $threshold->setDescription($obj->description);
        }
        
        $success = $this->thresholds->update($threshold);
        
        if ($success) {
            return $threshold;
        } else {
            http_response_code(500);
            return ["error" => "Erreur lors de la mise à jour."];
        }
    }
    
    /**
     * DELETE /api/stockthresholds/{id} - Supprimer un seuil (admin seulement)
     */
    protected function processDeleteRequest(HttpRequest $request) {
        // Vérifier l'authentification et les droits admin
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        if (!isset($_SESSION['auth_user_id'])) {
            http_response_code(401);
            return ["error" => "Authentification requise."];
        }
        
        // TODO: Vérifier que l'utilisateur est admin
        
        $id = $request->getId();
        if (!$id) {
            http_response_code(400);
            return ["error" => "ID de seuil requis."];
        }
        
        $threshold = $this->thresholds->find($id);
        
        if (!$threshold) {
            http_response_code(404);
            return ["error" => "Seuil introuvable."];
        }
        
        $success = $this->thresholds->delete($id);
        
        if ($success) {
            http_response_code(204); // No Content
            return ["success" => true];
        } else {
            http_response_code(500);
            return ["error" => "Erreur lors de la suppression."];
        }
    }
    
    // PUT non utilisé pour les seuils
    protected function processPutRequest(HttpRequest $request) {
        http_response_code(405);
        return ["error" => "Méthode non autorisée."];
    }
}
?>
