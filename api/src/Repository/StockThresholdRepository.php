<?php

require_once("src/Repository/EntityRepository.php");
require_once("src/Class/StockThreshold.php");

/**
 * Classe StockThresholdRepository
 * 
 * Gère l'accès aux données des seuils de stock configurables dans la base de données
 * Permet de récupérer et mettre à jour les seuils d'alerte stock
 */
class StockThresholdRepository extends EntityRepository {

    public function __construct() {
        parent::__construct();
    }

    /**
     * Trouve un seuil par son ID
     * 
     * @param int $id L'ID du seuil
     * @return StockThreshold|null Le seuil trouvé ou null
     */
    public function find($id): ?StockThreshold {
        $requete = $this->cnx->prepare("SELECT * FROM StockThresholds WHERE id=:value");
        $requete->bindParam(':value', $id);
        $requete->execute();
        $answer = $requete->fetch(PDO::FETCH_OBJ);
        
        if ($answer == false) return null;
        
        $threshold = new StockThreshold($answer->id);
        $threshold->setSettingName($answer->setting_name);
        $threshold->setSettingValue($answer->setting_value);
        $threshold->setDescription($answer->description);
        $threshold->setUpdatedAt($answer->updated_at);
        
        return $threshold;
    }

    /**
     * Récupère tous les seuils
     * 
     * @return array Tableau de StockThreshold
     */
    public function findAll(): array {
        $requete = $this->cnx->prepare("SELECT * FROM StockThresholds");
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);

        $res = [];
        foreach($answer as $obj) {
            $threshold = new StockThreshold($obj->id);
            $threshold->setSettingName($obj->setting_name);
            $threshold->setSettingValue($obj->setting_value);
            $threshold->setDescription($obj->description);
            $threshold->setUpdatedAt($obj->updated_at);
            
            array_push($res, $threshold);
        }
       
        return $res;
    }

    /**
     * Trouve un seuil par son nom de paramètre
     * 
     * @param string $settingName Le nom du paramètre (ex: 'LOW_STOCK')
     * @return StockThreshold|null Le seuil trouvé ou null
     */
    public function findByName(string $settingName): ?StockThreshold {
        $requete = $this->cnx->prepare("SELECT * FROM StockThresholds WHERE setting_name=:settingName");
        $requete->bindParam(':settingName', $settingName);
        $requete->execute();
        $answer = $requete->fetch(PDO::FETCH_OBJ);
        
        if ($answer == false) return null;
        
        $threshold = new StockThreshold($answer->id);
        $threshold->setSettingName($answer->setting_name);
        $threshold->setSettingValue($answer->setting_value);
        $threshold->setDescription($answer->description);
        $threshold->setUpdatedAt($answer->updated_at);
        
        return $threshold;
    }

    /**
     * Récupère tous les seuils sous forme de tableau associatif
     * Format: ['LOW_STOCK' => 5, 'LOW_VARIANT_COUNT' => 2, ...]
     * 
     * @return array Tableau associatif des seuils
     */
    public function getThresholdsAsArray(): array {
        $thresholds = $this->findAll();
        $result = [];
        
        foreach ($thresholds as $threshold) {
            $result[$threshold->getSettingName()] = $threshold->getSettingValue();
        }
        
        return $result;
    }

    /**
     * Sauvegarde un nouveau seuil
     * 
     * @param StockThreshold $threshold Le seuil à sauvegarder
     * @return bool True si succès, false sinon
     */
    public function save($threshold): bool {
        $requete = $this->cnx->prepare("
            INSERT INTO StockThresholds (setting_name, setting_value, description) 
            VALUES (:setting_name, :setting_value, :description)
        ");
        $settingName = $threshold->getSettingName();
        $settingValue = $threshold->getSettingValue();
        $description = $threshold->getDescription();
        
        $requete->bindParam(':setting_name', $settingName);
        $requete->bindParam(':setting_value', $settingValue);
        $requete->bindParam(':description', $description);
        
        $answer = $requete->execute();

        if ($answer) {
            $id = $this->cnx->lastInsertId();
            $threshold->setId($id);
            return true;
        }
          
        return false;
    }

    /**
     * Supprime un seuil
     * 
     * @param int $id L'ID du seuil à supprimer
     * @return bool True si succès, false sinon
     */
    public function delete($id): bool {
        $requete = $this->cnx->prepare("DELETE FROM StockThresholds WHERE id=:id");
        $requete->bindParam(':id', $id);
        return $requete->execute();
    }

    /**
     * Met à jour un seuil
     * 
     * @param StockThreshold $threshold Le seuil à mettre à jour
     * @return bool True si succès, false sinon
     */
    public function update($threshold): bool {
        $requete = $this->cnx->prepare("
            UPDATE StockThresholds 
            SET setting_name=:setting_name, setting_value=:setting_value, description=:description 
            WHERE id=:id
        ");
        
        $id = $threshold->getId();
        $settingName = $threshold->getSettingName();
        $settingValue = $threshold->getSettingValue();
        $description = $threshold->getDescription();
        
        $requete->bindParam(':id', $id);
        $requete->bindParam(':setting_name', $settingName);
        $requete->bindParam(':setting_value', $settingValue);
        $requete->bindParam(':description', $description);
        
        return $requete->execute();
    }

    /**
     * Met à jour la valeur d'un seuil par son nom
     * 
     * @param string $settingName Le nom du paramètre
     * @param int $newValue La nouvelle valeur
     * @return bool True si succès, false sinon
     */
    public function updateValueByName(string $settingName, int $newValue): bool {
        $requete = $this->cnx->prepare("
            UPDATE StockThresholds 
            SET setting_value=:setting_value 
            WHERE setting_name=:setting_name
        ");
        
        $requete->bindParam(':setting_name', $settingName);
        $requete->bindParam(':setting_value', $newValue);
        
        return $requete->execute();
    }
}

?>
