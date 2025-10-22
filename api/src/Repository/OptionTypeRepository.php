<?php

require_once("src/Repository/EntityRepository.php");
require_once("src/Class/OptionType.php");

/**
 * Classe OptionTypeRepository
 * 
 * Gère l'accès aux données des types d'options dans la base de données
 */
class OptionTypeRepository extends EntityRepository {

    public function __construct() {
        parent::__construct();
    }

    /**
     * Trouve un type d'option par son ID
     * 
     * @param int $id L'ID du type d'option
     * @return OptionType|null Le type d'option trouvé ou null
     */
    public function find($id): ?OptionType {
        $requete = $this->cnx->prepare("SELECT * FROM OptionType WHERE id=:value");
        $requete->bindParam(':value', $id);
        $requete->execute();
        $answer = $requete->fetch(PDO::FETCH_OBJ);
        
        if ($answer == false) return null;
        
        $optionType = new OptionType($answer->id);
        $optionType->setName($answer->name);
        
        return $optionType;
    }

    /**
     * Récupère tous les types d'options
     * 
     * @return array Tableau de OptionType
     */
    public function findAll(): array {
        $requete = $this->cnx->prepare("SELECT * FROM OptionType");
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);

        $res = [];
        foreach($answer as $obj) {
            $optionType = new OptionType($obj->id);
            $optionType->setName($obj->name);
            array_push($res, $optionType);
        }
       
        return $res;
    }

    /**
     * Trouve un type d'option par son nom
     * 
     * @param string $name Le nom du type d'option (ex: "Size", "Color")
     * @return OptionType|null Le type d'option trouvé ou null
     */
    public function findByName(string $name): ?OptionType {
        $requete = $this->cnx->prepare("SELECT * FROM OptionType WHERE name=:name");
        $requete->bindParam(':name', $name);
        $requete->execute();
        $answer = $requete->fetch(PDO::FETCH_OBJ);
        
        if ($answer == false) return null;
        
        $optionType = new OptionType($answer->id);
        $optionType->setName($answer->name);
        
        return $optionType;
    }

    /**
     * Sauvegarde un nouveau type d'option
     * 
     * @param OptionType $optionType Le type d'option à sauvegarder
     * @return bool True si succès, false sinon
     */
    public function save($optionType): bool {
        $requete = $this->cnx->prepare("INSERT INTO OptionType (name) VALUES (:name)");
        $name = $optionType->getName();
        $requete->bindParam(':name', $name);
        $answer = $requete->execute();

        if ($answer) {
            $id = $this->cnx->lastInsertId();
            $optionType->setId($id);
            return true;
        }
          
        return false;
    }

    /**
     * Supprime un type d'option
     * 
     * @param int $id L'ID du type d'option à supprimer
     * @return bool True si succès, false sinon
     */
    public function delete($id): bool {
        $requete = $this->cnx->prepare("DELETE FROM OptionType WHERE id=:id");
        $requete->bindParam(':id', $id);
        return $requete->execute();
    }

    /**
     * Met à jour un type d'option
     * 
     * @param OptionType $optionType Le type d'option à mettre à jour
     * @return bool True si succès, false sinon
     */
    public function update($optionType): bool {
        $requete = $this->cnx->prepare("UPDATE OptionType SET name=:name WHERE id=:id");
        $id = $optionType->getId();
        $name = $optionType->getName();
        $requete->bindParam(':id', $id);
        $requete->bindParam(':name', $name);
        return $requete->execute();
    }
}
