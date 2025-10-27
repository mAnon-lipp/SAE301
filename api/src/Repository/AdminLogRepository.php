<?php
require_once 'EntityRepository.php';
require_once __DIR__ . '/../Class/AdminLog.php';

class AdminLogRepository extends EntityRepository {

    public function __construct() {
        parent::__construct();
    }

    // Crée un log
    public function save($log): bool {
        $requete = $this->cnx->prepare(
            "INSERT INTO AdminLog (admin_user_id, action_type, target_entity, target_id, details) 
             VALUES (:admin_user_id, :action_type, :target_entity, :target_id, :details)"
        );

        $adminId = $log->getAdminUserId();
        $action = $log->getActionType();
        $entity = $log->getTargetEntity();
        $entityId = $log->getTargetId();
        $details = $log->getDetails();

        $requete->bindParam(':admin_user_id', $adminId);
        $requete->bindParam(':action_type', $action);
        $requete->bindParam(':target_entity', $entity);
        $requete->bindParam(':target_id', $entityId);
        $requete->bindParam(':details', $details);

        $answer = $requete->execute();

        if ($answer) {
            $id = $this->cnx->lastInsertId();
            $log->setId((int)$id);
            return true;
        }
        return false;
    }

    // Fonctions non utilisées pour ce repo
    public function find($id) { return null; }
    public function findAll(): array { return []; }
    public function delete($id) { return false; }
    public function update($entity) { return false; }
}
?>
