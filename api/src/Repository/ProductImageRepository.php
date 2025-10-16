<?php

require_once("src/Repository/EntityRepository.php");
require_once("src/Class/ProductImage.php");

/**
 * Classe ProductImageRepository
 * 
 * Gère les images de produits
 */
class ProductImageRepository extends EntityRepository {

    public function __construct(){
        parent::__construct();
    }

    public function find($id): ?ProductImage {
        $requete = $this->cnx->prepare("select * from ProductImage where id=:value");
        $requete->bindParam(':value', $id);
        $requete->execute();
        $answer = $requete->fetch(PDO::FETCH_OBJ);
        
        if ($answer == false) return null;
        
        $img = new ProductImage($answer->id);
        $img->setProductId($answer->product_id);
        $img->setImagePath($answer->image_path);
        return $img;
    }

    public function findAll(): array {
        $requete = $this->cnx->prepare("select * from ProductImage ORDER BY id ASC");
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);

        $res = [];
        foreach($answer as $obj){
            $img = new ProductImage($obj->id);
            $img->setProductId($obj->product_id);
            $img->setImagePath($obj->image_path);
            array_push($res, $img);
        }
       
        return $res;
    }

    /**
     * Trouve toutes les images d'un produit
     * @param int $productId L'ID du produit
     * @return array Tableau d'objets ProductImage
     */
    public function findByProductId(int $productId): array {
        $requete = $this->cnx->prepare("select * from ProductImage where product_id=:productId ORDER BY id ASC");
        $requete->bindParam(':productId', $productId);
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);

        $res = [];
        foreach($answer as $obj){
            $img = new ProductImage($obj->id);
            $img->setProductId($obj->product_id);
            $img->setImagePath($obj->image_path);
            array_push($res, $img);
        }
       
        return $res;
    }

    public function save($productImage){
        $requete = $this->cnx->prepare("insert into ProductImage (product_id, image_path) values (:product_id, :image_path)");
        $productId = $productImage->getProductId();
        $imagePath = $productImage->getImagePath();
        $requete->bindParam(':product_id', $productId);
        $requete->bindParam(':image_path', $imagePath);
        $answer = $requete->execute();

        if ($answer){
            $id = $this->cnx->lastInsertId();
            $productImage->setId($id);
            return true;
        }
          
        return false;
    }

    public function delete($id){
        $requete = $this->cnx->prepare("delete from ProductImage where id=:value");
        $requete->bindParam(':value', $id);
        return $requete->execute();
    }

    public function update($productImage){
        // Not implemented
        return false;
    }
}
