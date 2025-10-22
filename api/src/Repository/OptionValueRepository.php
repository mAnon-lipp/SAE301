<?php

require_once("src/Repository/EntityRepository.php");
require_once("src/Class/OptionValue.php");

/**
 * Classe OptionValueRepository
 * 
 * Gère l'accès aux données des valeurs d'options dans la base de données
 */
class OptionValueRepository extends EntityRepository {

    public function __construct() {
        parent::__construct();
    }

    /**
     * Trouve une valeur d'option par son ID
     * 
     * @param int $id L'ID de la valeur d'option
     * @return OptionValue|null La valeur d'option trouvée ou null
     */
    public function find($id): ?OptionValue {
        $requete = $this->cnx->prepare("SELECT * FROM OptionValue WHERE id=:value");
        $requete->bindParam(':value', $id);
        $requete->execute();
        $answer = $requete->fetch(PDO::FETCH_OBJ);
        
        if ($answer == false) return null;
        
        $optionValue = new OptionValue($answer->id);
        $optionValue->setOptionTypeId($answer->option_type_id);
        $optionValue->setValue($answer->value);
        $optionValue->setLabel($answer->label);
        
        return $optionValue;
    }

    /**
     * Récupère toutes les valeurs d'options
     * 
     * @return array Tableau de OptionValue
     */
    public function findAll(): array {
        $requete = $this->cnx->prepare("SELECT * FROM OptionValue");
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);

        $res = [];
        foreach($answer as $obj) {
            $optionValue = new OptionValue($obj->id);
            $optionValue->setOptionTypeId($obj->option_type_id);
            $optionValue->setValue($obj->value);
            $optionValue->setLabel($obj->label);
            array_push($res, $optionValue);
        }
       
        return $res;
    }

    /**
     * Récupère toutes les valeurs d'un type d'option spécifique
     * 
     * @param int $optionTypeId L'ID du type d'option
     * @return array Tableau de OptionValue
     */
    public function findByOptionType(int $optionTypeId): array {
        $requete = $this->cnx->prepare("SELECT * FROM OptionValue WHERE option_type_id=:typeId");
        $requete->bindParam(':typeId', $optionTypeId);
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);

        $res = [];
        foreach($answer as $obj) {
            $optionValue = new OptionValue($obj->id);
            $optionValue->setOptionTypeId($obj->option_type_id);
            $optionValue->setValue($obj->value);
            $optionValue->setLabel($obj->label);
            array_push($res, $optionValue);
        }
       
        return $res;
    }

    /**
     * Sauvegarde une nouvelle valeur d'option
     * 
     * @param OptionValue $optionValue La valeur d'option à sauvegarder
     * @return bool True si succès, false sinon
     */
    public function save($optionValue): bool {
        $requete = $this->cnx->prepare("
            INSERT INTO OptionValue (option_type_id, value, label) 
            VALUES (:option_type_id, :value, :label)
        ");
        $option_type_id = $optionValue->getOptionTypeId();
        $value = $optionValue->getValue();
        $label = $optionValue->getLabel();
        
        $requete->bindParam(':option_type_id', $option_type_id);
        $requete->bindParam(':value', $value);
        $requete->bindParam(':label', $label);
        
        $answer = $requete->execute();

        if ($answer) {
            $id = $this->cnx->lastInsertId();
            $optionValue->setId($id);
            return true;
        }
          
        return false;
    }

    /**
     * Supprime une valeur d'option
     * 
     * @param int $id L'ID de la valeur d'option à supprimer
     * @return bool True si succès, false sinon
     */
    public function delete($id): bool {
        $requete = $this->cnx->prepare("DELETE FROM OptionValue WHERE id=:id");
        $requete->bindParam(':id', $id);
        return $requete->execute();
    }

    /**
     * Met à jour une valeur d'option
     * 
     * @param OptionValue $optionValue La valeur d'option à mettre à jour
     * @return bool True si succès, false sinon
     */
    public function update($optionValue): bool {
        $requete = $this->cnx->prepare("
            UPDATE OptionValue 
            SET option_type_id=:option_type_id, value=:value, label=:label 
            WHERE id=:id
        ");
        
        $id = $optionValue->getId();
        $option_type_id = $optionValue->getOptionTypeId();
        $value = $optionValue->getValue();
        $label = $optionValue->getLabel();
        
        $requete->bindParam(':id', $id);
        $requete->bindParam(':option_type_id', $option_type_id);
        $requete->bindParam(':value', $value);
        $requete->bindParam(':label', $label);
        
        return $requete->execute();
    }
}
