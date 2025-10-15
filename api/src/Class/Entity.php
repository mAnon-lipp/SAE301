<?php
/**
 *  Class Entity
 * 
 *  Classe abstraite de base pour toutes les entités de l'application
 *
 *  Implémente l'interface JsonSerializable 
 *  qui oblige à définir une méthode jsonSerialize. Cette méthode permet de dire comment les objets
 *  de la classe Entity doivent être converti en JSON. Voire la méthode pour plus de détails.
 */
abstract class Entity implements JsonSerializable {

    /**
     * Les classes concrètes doivent définir la méthode jsonSerialize() afin de
     * fournir une représentation sérialisable en JSON. Laisser cette méthode
     * abstraite dans la classe parente évite d'accéder à des propriétés privées
     * des classes filles depuis la portée de la classe parente.
     *
     * Voir aussi : https://www.php.net/manual/en/class.jsonserializable.php
     */
    abstract public function jsonSerialize(): mixed;

}