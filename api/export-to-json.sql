-- Script SQL pour exporter les données en JSON
-- À exécuter dans phpMyAdmin ou MySQL Workbench

-- Exporter les produits
SELECT JSON_ARRAYAGG(
    JSON_OBJECT(
        'id', p.id,
        'name', p.name,
        'description', p.description,
        'price', p.price,
        'category_id', p.category_id,
        'stock', p.stock,
        'created_at', p.created_at
    )
) as products
FROM product p;

-- Exporter les catégories
SELECT JSON_ARRAYAGG(
    JSON_OBJECT(
        'id', id,
        'name', name,
        'description', description
    )
) as categories
FROM category;

-- Exporter les images de produits
SELECT JSON_ARRAYAGG(
    JSON_OBJECT(
        'product_id', product_id,
        'image_url', image_url,
        'is_primary', is_primary,
        'display_order', display_order
    )
) as product_images
FROM product_image;
