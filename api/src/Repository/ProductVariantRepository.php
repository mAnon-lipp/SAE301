<?php

require_once("src/Repository/EntityRepository.php");
require_once("src/Class/ProductVariant.php");

/**
 * Classe ProductVariantRepository
 * 
 * Gère l'accès aux données des variants de produits dans la base de données
 * Permet de récupérer les variants avec leurs options associées
 */
class ProductVariantRepository extends EntityRepository {

    public function __construct() {
        parent::__construct();
    }

    /**
     * Trouve un variant par son ID avec ses options
     * 
     * @param int $id L'ID du variant
     * @return ProductVariant|null Le variant trouvé ou null
     */
    public function find($id): ?ProductVariant {
        $requete = $this->cnx->prepare("SELECT * FROM ProductVariant WHERE id=:value");
        $requete->bindParam(':value', $id);
        $requete->execute();
        $answer = $requete->fetch(PDO::FETCH_OBJ);
        
        if ($answer == false) return null;
        
        $variant = new ProductVariant($answer->id);
        $variant->setProductId($answer->product_id);
        $variant->setSku($answer->sku);
        $variant->setPrice($answer->price);
        $variant->setStock($answer->stock);
        
        // Charger les options du variant
        $options = $this->getOptionsForVariant($answer->id);
        $variant->setOptions($options);
        
        return $variant;
    }

    /**
     * Récupère tous les variants
     * 
     * @return array Tableau de ProductVariant
     */
    public function findAll(): array {
        $requete = $this->cnx->prepare("SELECT * FROM ProductVariant");
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);

        $res = [];
        foreach($answer as $obj) {
            $variant = new ProductVariant($obj->id);
            $variant->setProductId($obj->product_id);
            $variant->setSku($obj->sku);
            $variant->setPrice($obj->price);
            $variant->setStock($obj->stock);
            
            // Charger les options du variant
            $options = $this->getOptionsForVariant($obj->id);
            $variant->setOptions($options);
            
            array_push($res, $variant);
        }
       
        return $res;
    }

    /**
     * Récupère tous les variants d'un produit spécifique
     * 
     * @param int $productId L'ID du produit
     * @return array Tableau de ProductVariant avec leurs options
     */
    public function findByProductId(int $productId): array {
        $requete = $this->cnx->prepare("SELECT * FROM ProductVariant WHERE product_id=:productId");
        $requete->bindParam(':productId', $productId);
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);

        $res = [];
        foreach($answer as $obj) {
            $variant = new ProductVariant($obj->id);
            $variant->setProductId($obj->product_id);
            $variant->setSku($obj->sku);
            $variant->setPrice($obj->price);
            $variant->setStock($obj->stock);
            
            // Charger les options du variant
            $options = $this->getOptionsForVariant($obj->id);
            $variant->setOptions($options);
            
            array_push($res, $variant);
        }
       
        return $res;
    }

    /**
     * Récupère les options associées à un variant
     * 
     * @param int $variantId L'ID du variant
     * @return array Tableau d'options formatées
     */
    private function getOptionsForVariant(int $variantId): array {
        $requete = $this->cnx->prepare("
            SELECT ot.name as type_name, ov.id as option_value_id, ov.value, ov.label, ov.hex_code 
            FROM VariantOptionValue vov
            JOIN OptionValue ov ON vov.option_value_id = ov.id
            JOIN OptionType ot ON ov.option_type_id = ot.id
            WHERE vov.variant_id = :variantId
        ");
        $requete->bindParam(':variantId', $variantId);
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);

        $options = [];
        foreach($answer as $obj) {
            $option = [
                "type" => $obj->type_name,
                "option_value_id" => $obj->option_value_id, // ID de l'OptionValue
                "value" => $obj->value,
                "label" => $obj->label ?? $obj->value
            ];
            
            // Ajouter hex_code uniquement si présent (pour les couleurs)
            if (!empty($obj->hex_code)) {
                $option["hex_code"] = $obj->hex_code;
            }
            
            $options[] = $option;
        }

        return $options;
    }

    /**
     * Trouve un variant par combinaison d'options
     * Utile pour trouver le bon variant quand l'utilisateur sélectionne des options
     * 
     * @param int $productId L'ID du produit
     * @param array $options Tableau d'options ["Size" => "36", "Color" => "White"]
     * @return ProductVariant|null Le variant correspondant ou null
     */
    public function findByProductAndOptions(int $productId, array $options): ?ProductVariant {
        // Récupérer tous les variants du produit
        $variants = $this->findByProductId($productId);
        
        // Trouver le variant qui correspond aux options
        foreach ($variants as $variant) {
            $variantOptions = $variant->getOptions();
            $match = true;
            
            foreach ($options as $optionType => $optionValue) {
                $found = false;
                foreach ($variantOptions as $vo) {
                    if ($vo['type'] == $optionType && $vo['value'] == $optionValue) {
                        $found = true;
                        break;
                    }
                }
                if (!$found) {
                    $match = false;
                    break;
                }
            }
            
            if ($match && count($variantOptions) == count($options)) {
                return $variant;
            }
        }
        
        return null;
    }

    /**
     * Sauvegarde un nouveau variant
     * 
     * @param ProductVariant $variant Le variant à sauvegarder
     * @return bool True si succès, false sinon
     */
    public function save($variant): bool {
        $requete = $this->cnx->prepare("
            INSERT INTO ProductVariant (product_id, sku, price, stock) 
            VALUES (:product_id, :sku, :price, :stock)
        ");
        $product_id = $variant->getProductId();
        $sku = $variant->getSku();
        $price = $variant->getPrice();
        $stock = $variant->getStock();
        
        $requete->bindParam(':product_id', $product_id);
        $requete->bindParam(':sku', $sku);
        $requete->bindParam(':price', $price);
        $requete->bindParam(':stock', $stock);
        
        $answer = $requete->execute();

        if ($answer) {
            $id = $this->cnx->lastInsertId();
            $variant->setId($id);
            return true;
        }
          
        return false;
    }

    /**
     * Supprime un variant
     * 
     * @param int $id L'ID du variant à supprimer
     * @return bool True si succès, false sinon
     */
    public function delete($id): bool {
        $requete = $this->cnx->prepare("DELETE FROM ProductVariant WHERE id=:id");
        $requete->bindParam(':id', $id);
        return $requete->execute();
    }

    /**
     * Met à jour un variant
     * 
     * @param ProductVariant $variant Le variant à mettre à jour
     * @return bool True si succès, false sinon
     */
    public function update($variant): bool {
        $requete = $this->cnx->prepare("
            UPDATE ProductVariant 
            SET product_id=:product_id, sku=:sku, price=:price, stock=:stock 
            WHERE id=:id
        ");
        
        $id = $variant->getId();
        $product_id = $variant->getProductId();
        $sku = $variant->getSku();
        $price = $variant->getPrice();
        $stock = $variant->getStock();
        
        $requete->bindParam(':id', $id);
        $requete->bindParam(':product_id', $product_id);
        $requete->bindParam(':sku', $sku);
        $requete->bindParam(':price', $price);
        $requete->bindParam(':stock', $stock);
        
        return $requete->execute();
    }
}
