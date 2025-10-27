<?php
require_once 'Entity.php';

class AdminLog extends Entity {
    private int $id;
    private int $admin_user_id;
    private string $action_type;
    private ?string $target_entity = null;
    private ?int $target_id = null;
    private ?string $details = null;
    private string $timestamp;

    public function __construct(int $id = 0) {
        $this->id = $id;
    }

    public function jsonSerialize(): mixed {
        return [
            "id" => $this->id,
            "admin_user_id" => $this->admin_user_id,
            "action_type" => $this->action_type,
            "target_entity" => $this->target_entity,
            "target_id" => $this->target_id,
            "details" => $this->details,
            "timestamp" => $this->timestamp
        ];
    }

    // --- Getters et Setters ---
    public function getId(): int { return $this->id; }
    public function setId(int $id): self { $this->id = $id; return $this; }
    public function getAdminUserId(): int { return $this->admin_user_id; }
    public function setAdminUserId(int $admin_user_id): self { $this->admin_user_id = $admin_user_id; return $this; }
    public function getActionType(): string { return $this->action_type; }
    public function setActionType(string $action_type): self { $this->action_type = $action_type; return $this; }
    public function getTargetEntity(): ?string { return $this->target_entity; }
    public function setTargetEntity(?string $target_entity): self { $this->target_entity = $target_entity; return $this; }
    public function getTargetId(): ?int { return $this->target_id; }
    public function setTargetId(?int $target_id): self { $this->target_id = $target_id; return $this; }
    public function getDetails(): ?string { return $this->details; }
    public function setDetails(?string $details): self { $this->details = $details; return $this; }
    public function getTimestamp(): string { return $this->timestamp; }
    public function setTimestamp(string $timestamp): self { $this->timestamp = $timestamp; return $this; }
}
?>
