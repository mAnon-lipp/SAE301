<?php
/**
 * Script pour exporter les produits de la BDD vers un fichier JSON
 * À exécuter depuis le serveur ou en local
 */

require_once "src/Class/Db.php";

try {
    // Connexion à la base de données
    $db = Db::getInstance();
    
    // Récupérer tous les produits
    $stmt = $db->prepare("
        SELECT 
            p.*,
            c.name as category_name,
            c.description as category_description
        FROM product p
        LEFT JOIN category c ON p.category_id = c.id
        ORDER BY p.id
    ");
    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Récupérer toutes les catégories
    $stmt = $db->prepare("SELECT * FROM category ORDER BY id");
    $stmt->execute();
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Récupérer les images de produits
    $stmt = $db->prepare("
        SELECT 
            pi.product_id,
            pi.image_url,
            pi.is_primary,
            pi.display_order
        FROM product_image pi
        ORDER BY pi.product_id, pi.display_order
    ");
    $stmt->execute();
    $images = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Organiser les images par produit
    $productImages = [];
    foreach ($images as $image) {
        $productId = $image['product_id'];
        if (!isset($productImages[$productId])) {
            $productImages[$productId] = [];
        }
        $productImages[$productId][] = $image;
    }
    
    // Ajouter les images aux produits
    foreach ($products as &$product) {
        $product['images'] = $productImages[$product['id']] ?? [];
    }
    
    // Créer la structure finale
    $data = [
        'generated_at' => date('Y-m-d H:i:s'),
        'note' => 'Données exportées de la base de données pour GitHub Pages',
        'products' => $products,
        'categories' => $categories
    ];
    
    // Convertir en JSON avec indentation
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    
    // Sauvegarder dans un fichier
    $outputFile = __DIR__ . '/products-export.json';
    file_put_contents($outputFile, $json);
    
    echo "✅ Export réussi !\n";
    echo "📁 Fichier créé : $outputFile\n";
    echo "📊 " . count($products) . " produits exportés\n";
    echo "📂 " . count($categories) . " catégories exportées\n";
    
} catch (Exception $e) {
    echo "❌ Erreur : " . $e->getMessage() . "\n";
    exit(1);
}
?>
