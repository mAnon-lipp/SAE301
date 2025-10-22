<?php
require_once "src/Controller/EntityController.php";
require_once "src/Repository/ProductVariantRepository.php";

/**
 * Classe ProductVariantController
 * 
 * Gère les requêtes HTTP relatives aux variants de produits
 * 
 * Routes supportées :
 * - GET /api/variants : Récupère tous les variants
 * - GET /api/variants/{id} : Récupère un variant spécifique
 * - GET /api/variants?product={id} : Récupère tous les variants d'un produit
 * - POST /api/variants : Crée un nouveau variant
 * - PATCH /api/variants/{id} : Met à jour un variant
 * - DELETE /api/variants/{id} : Supprime un variant
 */
class ProductVariantController extends EntityController {

    private ProductVariantRepository $variants;

    public function __construct() {
        $this->variants = new ProductVariantRepository();
    }

    /**
     * Traite les requêtes GET
     * 
     * @param HttpRequest $request La requête HTTP
     * @return ProductVariant|array|false Le variant, un tableau de variants ou false
     */
    protected function processGetRequest(HttpRequest $request) {
        $id = $request->getId("id");
        
        if ($id) {
            // URI est /api/variants/{id}
            $variant = $this->variants->find($id);
            return $variant == null ? false : $variant;
        } else {
            // URI est /api/variants ou /api/variants?product={id}
            $productId = $request->getParam("product");
            
            if ($productId == false) {
                // Récupérer tous les variants
                return $this->variants->findAll();
            } else {
                // Récupérer les variants d'un produit spécifique
                return $this->variants->findByProductId($productId);
            }
        }
    }

    /**
     * Traite les requêtes POST (création d'un variant)
     * 
     * @param HttpRequest $request La requête HTTP
     * @return ProductVariant|false Le variant créé ou false
     */
    protected function processPostRequest(HttpRequest $request) {
        $json = $request->getJson();
        $obj = json_decode($json);
        
        // Créer un nouveau variant
        $variant = new ProductVariant(0); // 0 est temporaire
        $variant->setProductId($obj->product_id);
        $variant->setSku($obj->sku ?? null);
        $variant->setPrice($obj->price);
        $variant->setStock($obj->stock ?? 0);
        $variant->setImage($obj->image ?? null);
        
        // Sauvegarder le variant
        $ok = $this->variants->save($variant);
        
        return $ok ? $variant : false;
    }

    /**
     * Traite les requêtes PATCH (mise à jour d'un variant)
     * 
     * @param HttpRequest $request La requête HTTP
     * @return ProductVariant|false Le variant mis à jour ou false
     */
    protected function processPatchRequest(HttpRequest $request) {
        $id = $request->getId("id");
        
        if (!$id) {
            return false;
        }
        
        // Récupérer le variant existant
        $variant = $this->variants->find($id);
        
        if (!$variant) {
            return false;
        }
        
        // Mettre à jour avec les nouvelles données
        $json = $request->getJson();
        $obj = json_decode($json);
        
        if (isset($obj->product_id)) {
            $variant->setProductId($obj->product_id);
        }
        if (isset($obj->sku)) {
            $variant->setSku($obj->sku);
        }
        if (isset($obj->price)) {
            $variant->setPrice($obj->price);
        }
        if (isset($obj->stock)) {
            $variant->setStock($obj->stock);
        }
        if (isset($obj->image)) {
            $variant->setImage($obj->image);
        }
        
        // Sauvegarder les modifications
        $ok = $this->variants->update($variant);
        
        return $ok ? $variant : false;
    }

    /**
     * Traite les requêtes DELETE (suppression d'un variant)
     * 
     * @param HttpRequest $request La requête HTTP
     * @return bool True si succès, false sinon
     */
    protected function processDeleteRequest(HttpRequest $request) {
        $id = $request->getId("id");
        
        if (!$id) {
            return false;
        }
        
        return $this->variants->delete($id);
    }
}
?>
