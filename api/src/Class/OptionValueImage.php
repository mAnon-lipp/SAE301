<?php

require_once("src/Class/Entity.php");

/**
 * Classe OptionValueImage
 * 
 * Représente une image associée à une valeur d'option (ex: couleur)
 * Permet d'afficher différentes images selon l'option sélectionnée
 */
class OptionValueImage extends Entity {
    private $id;
    private $option_value_id;
    private $image_path;

    public function __construct($id = 0) {
        $this->id = $id;
    }

    public function getId() {
        return $this->id;
    }

    public function setId($id) {
        $this->id = $id;
    }

    public function getOptionValueId() {
        return $this->option_value_id;
    }

    public function setOptionValueId($option_value_id) {
        $this->option_value_id = $option_value_id;
    }

    public function getImagePath() {
        return $this->image_path;
    }

    public function setImagePath($image_path) {
        $this->image_path = $image_path;
    }

    public function jsonSerialize(): mixed {
        return [
            "id" => $this->id,
            "option_value_id" => $this->option_value_id,
            "image_path" => $this->image_path
        ];
    }
}
