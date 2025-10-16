<?php
require_once "src/Controller/EntityController.php";
require_once "src/Repository/ProductImageRepository.php";

/**
 * Contrôleur pour les images de produits
 */
class ProductImageController extends EntityController {

    private ProductImageRepository $productImages;

    public function __construct(){
        $this->productImages = new ProductImageRepository();
    }

    protected function processGetRequest(HttpRequest $request) {
        $id = $request->getId("id");
        
        if ($id) {
            // URI is .../productimages/{id}
            $img = $this->productImages->find($id);
            return $img == null ? false : $img;
        } else {
            // Check for product_id parameter
            $productId = $request->getParam("product_id");
            
            if ($productId !== false) {
                // Return images for a specific product
                return $this->productImages->findByProductId($productId);
            } else {
                // Return all images
                return $this->productImages->findAll();
            }
        }
    }

    protected function processPostRequest(HttpRequest $request) {
        $json = $request->getJson();
        $obj = json_decode($json);
        
        $img = new ProductImage(0);
        $img->setProductId($obj->product_id);
        $img->setImagePath($obj->image_path);
        
        $ok = $this->productImages->save($img);
        return $ok ? $img : false;
    }
}
