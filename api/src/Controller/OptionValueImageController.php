<?php

require_once("src/Controller/EntityController.php");
require_once("src/Repository/OptionValueImageRepository.php");

/**
 * Classe OptionValueImageController
 * 
 * Contrôleur pour gérer les requêtes HTTP liées aux images d'options
 */
class OptionValueImageController extends EntityController {

    public function __construct() {
        // Pas de paramètres - le HttpRequest sera passé dans les méthodes process*Request
    }

    /**
     * Traite les requêtes GET
     * GET /api/optionvalueimages - Récupère toutes les images
     * GET /api/optionvalueimages/:id - Récupère une image par son ID
     * GET /api/optionvalueimages?option_value_id=X - Récupère les images d'une option value
     * GET /api/optionvalueimages?product_id=X - Récupère les images groupées par option pour un produit
     */
    protected function processGetRequest(HttpRequest $request) {
        $repo = new OptionValueImageRepository();
        
        // Récupérer les paramètres de la requête
        $optionValueId = $request->getParam('option_value_id');
        $productId = $request->getParam('product_id');
        $id = $request->getId(); // Utiliser getId() au lieu de $request->id
        
        // Si on a un ID dans l'URL
        if ($id && $id !== "") {
            $data = $repo->find($id);
            return $data;
        }
        
        // Si on a un paramètre option_value_id
        if ($optionValueId !== null) {
            $data = $repo->findByOptionValueId($optionValueId);
            return $data;
        }
        
        // Si on a un paramètre product_id
        if ($productId !== null) {
            $data = $repo->findByProductId($productId);
            return $data;
        }
        
        // Sinon, récupérer toutes les images
        $data = $repo->findAll();
        return $data;
    }

    /**
     * Traite les requêtes POST
     * POST /api/optionvalueimages - Crée une nouvelle image
     */
    protected function processPostRequest(HttpRequest $request) {
        $json = $request->getJson();
        $body = json_decode($json);
        
        if (!isset($body->option_value_id) || !isset($body->image_path)) {
            http_response_code(400);
            return ["error" => "Missing required fields: option_value_id, image_path"];
        }
        
        $image = new OptionValueImage();
        $image->setOptionValueId($body->option_value_id);
        $image->setImagePath($body->image_path);
        
        $repo = new OptionValueImageRepository();
        $success = $repo->save($image);
        
        if ($success) {
            return $image;
        } else {
            http_response_code(500);
            return ["error" => "Failed to create image"];
        }
    }

    /**
     * Traite les requêtes PUT
     * PUT /api/optionvalueimages/:id - Met à jour une image
     */
    protected function processPutRequest(HttpRequest $request) {
        $id = $request->getId(); // Utiliser getId() au lieu de $request->id
        
        if (!$id || $id === "") {
            http_response_code(400);
            return ["error" => "Missing image ID"];
        }
        
        $repo = new OptionValueImageRepository();
        $image = $repo->find($id);
        
        if (!$image) {
            http_response_code(404);
            return ["error" => "Image not found"];
        }
        
        $json = $request->getJson();
        $body = json_decode($json);
        
        if (isset($body->option_value_id)) {
            $image->setOptionValueId($body->option_value_id);
        }
        if (isset($body->image_path)) {
            $image->setImagePath($body->image_path);
        }
        
        $success = $repo->update($image);
        
        if ($success) {
            return $image;
        } else {
            http_response_code(500);
            return ["error" => "Failed to update image"];
        }
    }

    /**
     * Traite les requêtes DELETE
     * DELETE /api/optionvalueimages/:id - Supprime une image
     */
    protected function processDeleteRequest(HttpRequest $request) {
        $id = $request->getId(); // Utiliser getId() au lieu de $request->id
        
        if (!$id || $id === "") {
            http_response_code(400);
            return ["error" => "Missing image ID"];
        }
        
        $repo = new OptionValueImageRepository();
        $success = $repo->delete($id);
        
        if ($success) {
            http_response_code(204);
            return null;
        } else {
            http_response_code(500);
            return ["error" => "Failed to delete image"];
        }
    }
}
