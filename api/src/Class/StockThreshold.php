<?php

require_once "src/Class/Entity.php";

/**
 * Classe StockThreshold
 * Représente un seuil de stock configurable dans la base de données
 */
class StockThreshold extends Entity {

    private int $id;
    private string $settingName;
    private int $settingValue;
    private ?string $description;
    private string $updatedAt;

    public function __construct(int $id = 0) {
        $this->id = $id;
        $this->settingName = "";
        $this->settingValue = 0;
        $this->description = null;
        $this->updatedAt = "";
    }

    // Getters
    public function getId(): int {
        return $this->id;
    }

    public function getSettingName(): string {
        return $this->settingName;
    }

    public function getSettingValue(): int {
        return $this->settingValue;
    }

    public function getDescription(): ?string {
        return $this->description;
    }

    public function getUpdatedAt(): string {
        return $this->updatedAt;
    }

    // Setters
    public function setId(int $id): void {
        $this->id = $id;
    }

    public function setSettingName(string $settingName): void {
        $this->settingName = $settingName;
    }

    public function setSettingValue(int $settingValue): void {
        $this->settingValue = $settingValue;
    }

    public function setDescription(?string $description): void {
        $this->description = $description;
    }

    public function setUpdatedAt(string $updatedAt): void {
        $this->updatedAt = $updatedAt;
    }

    /**
     * Sérialise l'objet en JSON
     * @return array Représentation de l'objet pour la sérialisation JSON
     */
    public function jsonSerialize(): mixed {
        return [
            'id' => $this->id,
            'setting_name' => $this->settingName,
            'setting_value' => $this->settingValue,
            'description' => $this->description,
            'updated_at' => $this->updatedAt
        ];
    }
}

?>
