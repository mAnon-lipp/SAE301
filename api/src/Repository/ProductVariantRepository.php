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

    /**
     * US011 - Décrémente atomiquement le stock et crée une entrée de log.
     * Critère 1, 5, 6 & DoD 3
     * Utilise une requête atomique pour prévenir les stocks négatifs.
     * 
     * @param int $variantId L'ID du variant
     * @param int $quantity La quantité à décrémenter
     * @param int $orderId L'ID de la commande
     * @return bool True si succès, false si stock insuffisant
     */
    public function decrementStock(int $variantId, int $quantity, int $orderId): bool {
        error_log("US011 - decrementStock appelée: variantId=$variantId, quantity=$quantity, orderId=$orderId");
        
        // 1. Décrémentation atomique avec vérification des stocks négatifs
        $requete = $this->cnx->prepare("
            UPDATE ProductVariant 
            SET stock = stock - :quantity 
            WHERE id = :variantId AND stock >= :quantity
        ");
        
        $requete->bindParam(':quantity', $quantity, PDO::PARAM_INT);
        $requete->bindParam(':variantId', $variantId, PDO::PARAM_INT);
        $success = $requete->execute();
        
        error_log("US011 - UPDATE exécuté: success=" . ($success ? 'true' : 'false') . ", rowCount=" . $requete->rowCount());
        
        // Vérifier si la mise à jour a eu lieu (stock suffisant)
        if ($success && $requete->rowCount() > 0) {
            // 2. Récupérer le nouveau stock pour le log
            $newVariant = $this->find($variantId);
            $newStock = $newVariant ? $newVariant->getStock() : 0;
            
            error_log("US011 - Stock après décrémentation: $newStock");
            
            // 3. Ajouter une entrée de log (Critère 4)
            try {
                $this->logMovement($variantId, -$quantity, $newStock, $orderId, 'ORDER_VALIDATED');
                error_log("US011 - Log movement créé avec succès");
            } catch (Exception $e) {
                error_log("US011 - Erreur lors du log movement: " . $e->getMessage());
                // Ne pas bloquer la commande si le log échoue
            }
            
            return true;
        }
        
        error_log("US011 - Stock insuffisant ou variant non trouvé");
        return false; // Stock insuffisant ou variant non trouvé
    }

    /**
     * US011 - Incrémente atomiquement le stock et crée une entrée de log.
     * Critère 2 & 6
     * 
     * @param int $variantId L'ID du variant
     * @param int $quantity La quantité à incrémenter
     * @param int $orderId L'ID de la commande
     * @return bool True si succès, false sinon
     */
    public function incrementStock(int $variantId, int $quantity, int $orderId): bool {
        // 1. Incrémentation atomique
        $requete = $this->cnx->prepare("
            UPDATE ProductVariant 
            SET stock = stock + :quantity 
            WHERE id = :variantId
        ");
        
        $requete->bindParam(':quantity', $quantity, PDO::PARAM_INT);
        $requete->bindParam(':variantId', $variantId, PDO::PARAM_INT);
        $success = $requete->execute();
        
        if ($success && $requete->rowCount() > 0) {
            // 2. Récupérer le nouveau stock pour le log
            $newVariant = $this->find($variantId);
            $newStock = $newVariant ? $newVariant->getStock() : 0;
            
            // 3. Ajouter une entrée de log (Critère 4)
            $this->logMovement($variantId, $quantity, $newStock, $orderId, 'ORDER_CANCELLED');
            
            return true;
        }
        
        return false;
    }

    /**
     * US011 - Méthode privée pour insérer un mouvement de stock (Critère 4)
     * 
     * @param int $variantId L'ID du variant
     * @param int $quantityChange Le changement de quantité (négatif = décrément, positif = incrément)
     * @param int $newStock Le nouveau stock après l'opération
     * @param int $orderId L'ID de la commande
     * @param string $reason La raison du mouvement ('ORDER_VALIDATED', 'ORDER_CANCELLED', etc.)
     */
    private function logMovement(int $variantId, int $quantityChange, int $newStock, int $orderId, string $reason): void {
        $logRequete = $this->cnx->prepare("
            INSERT INTO StockMovement (variant_id, movement_date, quantity_change, new_stock, order_id, reason)
            VALUES (:variant_id, NOW(), :quantity_change, :new_stock, :order_id, :reason)
        ");
        
        $logRequete->bindParam(':variant_id', $variantId, PDO::PARAM_INT);
        $logRequete->bindParam(':quantity_change', $quantityChange, PDO::PARAM_INT);
        $logRequete->bindParam(':new_stock', $newStock, PDO::PARAM_INT);
        $logRequete->bindParam(':order_id', $orderId, PDO::PARAM_INT);
        $logRequete->bindParam(':reason', $reason, PDO::PARAM_STR);
        
        $logRequete->execute();
    }
}
