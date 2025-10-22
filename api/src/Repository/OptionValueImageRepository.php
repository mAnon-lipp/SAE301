<?php

require_once("src/Repository/EntityRepository.php");
require_once("src/Class/OptionValueImage.php");

/**
 * Classe OptionValueImageRepository
 * 
 * Gère l'accès aux données des images d'options dans la base de données
 */
class OptionValueImageRepository extends EntityRepository {

    public function __construct() {
        parent::__construct();
    }

    /**
     * Trouve une image par son ID
     * 
     * @param int $id L'ID de l'image
     * @return OptionValueImage|null L'image trouvée ou null
     */
    public function find($id): ?OptionValueImage {
        $requete = $this->cnx->prepare("SELECT * FROM OptionValueImage WHERE id=:value");
        $requete->bindParam(':value', $id);
        $requete->execute();
        $answer = $requete->fetch(PDO::FETCH_OBJ);
        
        if ($answer == false) return null;
        
        $image = new OptionValueImage($answer->id);
        $image->setOptionValueId($answer->option_value_id);
        $image->setImagePath($answer->image_path);
        
        return $image;
    }

    /**
     * Récupère toutes les images
     * 
     * @return array Tableau d'OptionValueImage
     */
    public function findAll(): array {
        $requete = $this->cnx->prepare("SELECT * FROM OptionValueImage");
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);

        $res = [];
        foreach($answer as $obj) {
            $image = new OptionValueImage($obj->id);
            $image->setOptionValueId($obj->option_value_id);
            $image->setImagePath($obj->image_path);
            array_push($res, $image);
        }
       
        return $res;
    }

    /**
     * Récupère toutes les images pour une valeur d'option spécifique
     * 
     * @param int $optionValueId L'ID de la valeur d'option (ex: id de la couleur)
     * @return array Tableau d'OptionValueImage
     */
    public function findByOptionValueId(int $optionValueId): array {
        $requete = $this->cnx->prepare("SELECT * FROM OptionValueImage WHERE option_value_id=:optionValueId ORDER BY id ASC");
        $requete->bindParam(':optionValueId', $optionValueId);
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);

        $res = [];
        foreach($answer as $obj) {
            $image = new OptionValueImage($obj->id);
            $image->setOptionValueId($obj->option_value_id);
            $image->setImagePath($obj->image_path);
            array_push($res, $image);
        }
       
        return $res;
    }

    /**
     * Récupère toutes les images pour un produit via ses variants
     * Retourne un tableau associatif [option_value_id => [images]]
     * 
     * @param int $productId L'ID du produit
     * @return array Tableau associatif des images groupées par option_value_id
     */
    public function findByProductId(int $productId): array {
        $requete = $this->cnx->prepare("
            SELECT DISTINCT ovi.*
            FROM OptionValueImage ovi
            JOIN OptionValue ov ON ovi.option_value_id = ov.id
            JOIN VariantOptionValue vov ON ov.id = vov.option_value_id
            JOIN ProductVariant pv ON vov.variant_id = pv.id
            WHERE pv.product_id = :productId
            ORDER BY ovi.option_value_id, ovi.id
        ");
        $requete->bindParam(':productId', $productId);
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);

        $res = [];
        foreach($answer as $obj) {
            $image = new OptionValueImage($obj->id);
            $image->setOptionValueId($obj->option_value_id);
            $image->setImagePath($obj->image_path);
            
            // Grouper par option_value_id
            if (!isset($res[$obj->option_value_id])) {
                $res[$obj->option_value_id] = [];
            }
            $res[$obj->option_value_id][] = $image;
        }
       
        return $res;
    }

    /**
     * Sauvegarde une nouvelle image
     * 
     * @param OptionValueImage $image L'image à sauvegarder
     * @return bool True si succès, false sinon
     */
    public function save($image): bool {
        $requete = $this->cnx->prepare("
            INSERT INTO OptionValueImage (option_value_id, image_path) 
            VALUES (:option_value_id, :image_path)
        ");
        $option_value_id = $image->getOptionValueId();
        $image_path = $image->getImagePath();
        
        $requete->bindParam(':option_value_id', $option_value_id);
        $requete->bindParam(':image_path', $image_path);
        
        $answer = $requete->execute();

        if ($answer) {
            $id = $this->cnx->lastInsertId();
            $image->setId($id);
            return true;
        }
          
        return false;
    }

    /**
     * Supprime une image
     * 
     * @param int $id L'ID de l'image à supprimer
     * @return bool True si succès, false sinon
     */
    public function delete($id): bool {
        $requete = $this->cnx->prepare("DELETE FROM OptionValueImage WHERE id=:id");
        $requete->bindParam(':id', $id);
        return $requete->execute();
    }

    /**
     * Met à jour une image
     * 
     * @param OptionValueImage $image L'image à mettre à jour
     * @return bool True si succès, false sinon
     */
    public function update($image): bool {
        $requete = $this->cnx->prepare("
            UPDATE OptionValueImage 
            SET option_value_id=:option_value_id, image_path=:image_path 
            WHERE id=:id
        ");
        
        $id = $image->getId();
        $option_value_id = $image->getOptionValueId();
        $image_path = $image->getImagePath();
        
        $requete->bindParam(':id', $id);
        $requete->bindParam(':option_value_id', $option_value_id);
        $requete->bindParam(':image_path', $image_path);
        
        return $requete->execute();
    }
}
