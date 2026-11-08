<?php

/**
 *  Classe EntityRespository
 * 
 *  Classe abstraite ! Elle décrit la gestion d'une famille de ressources (produits, commandes, utilisateurs...)
 *  au niveau du système d'information (base de données).
 * 
 *  Quand on a une nouvelle famille de ressource à gérer, on créera une classe fille qui saura : 
 * 
 *  - trouver une ressource dans la base  (voir la méthode find)
 *  - trouver toutes les ressources  dans la base (voir la méthode findAll)
 *  - sauvegarder une ressource dans la base (voir la méthode save)
 *  - supprimer une ressource dans la base (voir la méthode delete)
 *  - mettre à jour une ressource dans la base (voir la méthode update)
 * 
 *  Exemple : voir la classe ProductRepository
 */
abstract class EntityRepository {
    protected $cnx;

    protected function __construct(){
        $env = $this->loadEnvironment();
        $host = $env['DB_HOST'] ?? $env['MYSQL_HOST'] ?? $env['DATABASE_HOST'] ?? null;
        $port = $env['DB_PORT'] ?? $env['MYSQL_PORT'] ?? $env['DATABASE_PORT'] ?? '3306';
        $name = $env['DB_NAME'] ?? $env['DB_DATABASE'] ?? $env['MYSQL_DATABASE'] ?? $env['DATABASE_NAME'] ?? null;
        $user = $env['DB_USER'] ?? $env['DB_USERNAME'] ?? $env['MYSQL_USER'] ?? $env['DATABASE_USER'] ?? null;
        $password = $env['DB_PASSWORD'] ?? $env['DB_PASS'] ?? $env['DB_PASSWD'] ?? $env['MYSQL_PASSWORD'] ?? $env['DATABASE_PASSWORD'] ?? null;

        if (!$host || !$name || !$user || $password === null) {
            throw new RuntimeException('La configuration de la base de données est incomplète.');
        }

        $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4', $host, $port, $name);
        $this->cnx = new PDO($dsn, $user, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ,
        ]);
    }

    private function loadEnvironment(): array {
        $paths = [
            __DIR__ . '/../../.env',
            __DIR__ . '/../../../.env',
            __DIR__ . '/../../../../.env',
        ];

        foreach ($paths as $path) {
            if (is_readable($path)) {
                $values = parse_ini_file($path, false, INI_SCANNER_RAW);
                if ($values === false) {
                    throw new RuntimeException('Impossible de lire la configuration de la base de données.');
                }

                return $values;
            }
        }

        return [
            'DB_HOST' => getenv('DB_HOST') ?: null,
            'DB_PORT' => getenv('DB_PORT') ?: '3306',
            'DB_NAME' => getenv('DB_NAME') ?: null,
            'DB_USER' => getenv('DB_USER') ?: null,
            'DB_PASSWORD' => getenv('DB_PASSWORD'),
        ];
    }

    /**
     *  find
     *  Query the data base for the entity with id $id.
     *  Must return an Entity object or false if the query fails
     */
    abstract public function find($id);

    /**
     *  findAll
     *  Query the data base for all the entities
     *  Must return an array of Entity objects or false if the query fails
     */
    abstract public function findAll();

    /**
     *  save
     *  Save in the data base a new Entity object.
     *  Update the Entity object with its data base id.
     *  Must return true or false if it fails to save the object.
     */
    abstract public function save($entity);

    /**
     *  delete
     *  delete in the data base Entity object with id $id
     *  Must return true or false if it fails to delete the object.
     */
    abstract public function delete($id);

     /**
     *  udpate
     *  update in the data base Entity object $entity
     *  Must return true or false if it fails to delete the object.
     */
    abstract public function update($entity);
}