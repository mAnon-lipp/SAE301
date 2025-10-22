-- Script SQL pour US008 : Options Produits
-- Peuplement de la base de données avec des options et variants

-- ============================================
-- 1. INSERTION DES TYPES D'OPTIONS
-- ============================================

INSERT INTO `OptionType` (`id`, `name`) VALUES
(1, 'Size'),
(2, 'Color');

-- ============================================
-- 2. INSERTION DES VALEURS D'OPTIONS - TAILLES
-- ============================================

INSERT INTO `OptionValue` (`id`, `option_type_id`, `value`, `label`) VALUES
(1, 1, '35', '35'),
(2, 1, '36', '36'),
(3, 1, '37', '37'),
(4, 1, '38', '38'),
(5, 1, '39', '39'),
(6, 1, '40', '40'),
(7, 1, '41', '41'),
(8, 1, '42', '42');

-- ============================================
-- 3. INSERTION DES VALEURS D'OPTIONS - COULEURS
-- ============================================

INSERT INTO `OptionValue` (`id`, `option_type_id`, `value`, `label`) VALUES
(9, 2, 'WHITE', 'White'),
(10, 2, 'BLACK', 'Black'),
(11, 2, 'BEIGE', 'Beige'),
(12, 2, 'NAVY', 'Navy Blue'),
(13, 2, 'RED', 'Red'),
(14, 2, 'BROWN', 'Brown'),
(15, 2, 'GOLD', 'Gold'),
(16, 2, 'SILVER', 'Silver'),
(17, 2, 'OLIVE', 'Olive');

-- ============================================
-- 4. SUPPRESSION DES VARIANTS PAR DÉFAUT EXISTANTS
-- ============================================

-- On va supprimer les variants par défaut pour les remplacer par des variants avec options
DELETE FROM `ProductVariant` WHERE `sku` LIKE 'DEFAULT-%';

-- ============================================
-- 5. CRÉATION DE VARIANTS POUR LES CHAUSSURES
-- ============================================

-- PRODUIT 1: Vintage W (Baskets)
-- Variants: Tailles 35-42 en Beige uniquement
INSERT INTO `ProductVariant` (`id`, `product_id`, `sku`, `price`, `stock`, `image`) VALUES
(101, 1, 'VINTAGE-W-35-BEIGE', 490.00, 5, NULL),
(102, 1, 'VINTAGE-W-36-BEIGE', 490.00, 8, NULL),
(103, 1, 'VINTAGE-W-37-BEIGE', 490.00, 10, NULL),
(104, 1, 'VINTAGE-W-38-BEIGE', 490.00, 12, NULL),
(105, 1, 'VINTAGE-W-39-BEIGE', 490.00, 7, NULL),
(106, 1, 'VINTAGE-W-40-BEIGE', 490.00, 6, NULL),
(107, 1, 'VINTAGE-W-41-BEIGE', 490.00, 4, NULL),
(108, 1, 'VINTAGE-W-42-BEIGE', 490.00, 3, NULL);

-- PRODUIT 2: Desert W (Baskets)
-- Variants: Tailles 35-42 en plusieurs couleurs
INSERT INTO `ProductVariant` (`id`, `product_id`, `sku`, `price`, `stock`, `image`) VALUES
(201, 2, 'DESERT-W-35-BEIGE', 590.00, 6, NULL),
(202, 2, 'DESERT-W-36-BEIGE', 590.00, 10, NULL),
(203, 2, 'DESERT-W-36-BROWN', 590.00, 8, NULL),
(204, 2, 'DESERT-W-38-BEIGE', 590.00, 12, NULL),
(205, 2, 'DESERT-W-38-BROWN', 590.00, 9, NULL),
(206, 2, 'DESERT-W-40-BEIGE', 590.00, 7, NULL),
(207, 2, 'DESERT-W-42-BEIGE', 590.00, 5, NULL);

-- PRODUIT 3: Princeton W (Baskets)
-- Variants: Tailles 35-42 en White et Black
INSERT INTO `ProductVariant` (`id`, `product_id`, `sku`, `price`, `stock`, `image`) VALUES
(301, 3, 'PRINCETON-W-35-WHITE', 590.00, 8, NULL),
(302, 3, 'PRINCETON-W-36-WHITE', 590.00, 15, NULL),
(303, 3, 'PRINCETON-W-36-BLACK', 590.00, 10, NULL),
(304, 3, 'PRINCETON-W-38-WHITE', 590.00, 18, NULL),
(305, 3, 'PRINCETON-W-38-BLACK', 590.00, 12, NULL),
(306, 3, 'PRINCETON-W-40-WHITE', 590.00, 9, NULL),
(307, 3, 'PRINCETON-W-40-BLACK', 590.00, 6, NULL),
(308, 3, 'PRINCETON-W-42-WHITE', 590.00, 7, NULL),
(309, 3, 'PRINCETON-W-42-BLACK', 590.00, 4, NULL);

-- PRODUIT 4: Bonbon (Talons)
-- Variants: Tailles 36-40 en plusieurs couleurs
INSERT INTO `ProductVariant` (`id`, `product_id`, `sku`, `price`, `stock`, `image`) VALUES
(401, 4, 'BONBON-36-BEIGE', 690.00, 5, NULL),
(402, 4, 'BONBON-37-BEIGE', 690.00, 7, NULL),
(403, 4, 'BONBON-38-BEIGE', 690.00, 10, NULL),
(404, 4, 'BONBON-38-BLACK', 690.00, 8, NULL),
(405, 4, 'BONBON-39-BEIGE', 690.00, 6, NULL),
(406, 4, 'BONBON-40-BEIGE', 690.00, 4, NULL);

-- PRODUIT 10: Sorrento (Baskets)
-- Variants: Tailles 35-42 en Silver
INSERT INTO `ProductVariant` (`id`, `product_id`, `sku`, `price`, `stock`, `image`) VALUES
(1001, 10, 'SORRENTO-35-SILVER', 595.00, 6, NULL),
(1002, 10, 'SORRENTO-36-SILVER', 595.00, 9, NULL),
(1003, 10, 'SORRENTO-38-SILVER', 595.00, 12, NULL),
(1004, 10, 'SORRENTO-40-SILVER', 595.00, 8, NULL),
(1005, 10, 'SORRENTO-42-SILVER', 595.00, 5, NULL);

-- ============================================
-- 6. VARIANTS POUR LES SACS (sans taille, uniquement couleur)
-- ============================================

-- PRODUIT 7: Daria (Sac)
INSERT INTO `ProductVariant` (`id`, `product_id`, `sku`, `price`, `stock`, `image`) VALUES
(701, 7, 'DARIA-BLACK', 1900.00, 10, NULL),
(702, 7, 'DARIA-BEIGE', 1900.00, 8, NULL);

-- PRODUIT 8: Sophia (Sac)
INSERT INTO `ProductVariant` (`id`, `product_id`, `sku`, `price`, `stock`, `image`) VALUES
(801, 8, 'SOPHIA-BLACK-GOLD', 3900.00, 3, NULL);

-- PRODUIT 9: Lungomare (Sac)
INSERT INTO `ProductVariant` (`id`, `product_id`, `sku`, `price`, `stock`, `image`) VALUES
(901, 9, 'LUNGOMARE-NAVY', 2500.00, 5, NULL);

-- PRODUIT 12: Sienna (Sac)
INSERT INTO `ProductVariant` (`id`, `product_id`, `sku`, `price`, `stock`, `image`) VALUES
(1201, 12, 'SIENNA-BROWN', 125.00, 20, NULL),
(1202, 12, 'SIENNA-BLACK', 125.00, 15, NULL);

-- ============================================
-- 7. LIAISON VARIANTS <-> OPTIONS (VariantOptionValue)
-- ============================================

-- Vintage W (Baskets) - Beige, tailles variées
INSERT INTO `VariantOptionValue` (`variant_id`, `option_value_id`) VALUES
(101, 1), (101, 11),  -- 35, Beige
(102, 2), (102, 11),  -- 36, Beige
(103, 3), (103, 11),  -- 37, Beige
(104, 4), (104, 11),  -- 38, Beige
(105, 5), (105, 11),  -- 39, Beige
(106, 6), (106, 11),  -- 40, Beige
(107, 7), (107, 11),  -- 41, Beige
(108, 8), (108, 11);  -- 42, Beige

-- Desert W (Baskets) - Beige et Brown
INSERT INTO `VariantOptionValue` (`variant_id`, `option_value_id`) VALUES
(201, 1), (201, 11),  -- 35, Beige
(202, 2), (202, 11),  -- 36, Beige
(203, 2), (203, 14),  -- 36, Brown
(204, 4), (204, 11),  -- 38, Beige
(205, 4), (205, 14),  -- 38, Brown
(206, 6), (206, 11),  -- 40, Beige
(207, 8), (207, 11);  -- 42, Beige

-- Princeton W (Baskets) - White et Black
INSERT INTO `VariantOptionValue` (`variant_id`, `option_value_id`) VALUES
(301, 1), (301, 9),   -- 35, White
(302, 2), (302, 9),   -- 36, White
(303, 2), (303, 10),  -- 36, Black
(304, 4), (304, 9),   -- 38, White
(305, 4), (305, 10),  -- 38, Black
(306, 6), (306, 9),   -- 40, White
(307, 6), (307, 10),  -- 40, Black
(308, 8), (308, 9),   -- 42, White
(309, 8), (309, 10);  -- 42, Black

-- Bonbon (Talons) - Beige et Black
INSERT INTO `VariantOptionValue` (`variant_id`, `option_value_id`) VALUES
(401, 2), (401, 11),  -- 36, Beige
(402, 3), (402, 11),  -- 37, Beige
(403, 4), (403, 11),  -- 38, Beige
(404, 4), (404, 10),  -- 38, Black
(405, 5), (405, 11),  -- 39, Beige
(406, 6), (406, 11);  -- 40, Beige

-- Sorrento (Baskets) - Silver
INSERT INTO `VariantOptionValue` (`variant_id`, `option_value_id`) VALUES
(1001, 1), (1001, 16),  -- 35, Silver
(1002, 2), (1002, 16),  -- 36, Silver
(1003, 4), (1003, 16),  -- 38, Silver
(1004, 6), (1004, 16),  -- 40, Silver
(1005, 8), (1005, 16);  -- 42, Silver

-- Sacs (sans taille, uniquement couleur)
INSERT INTO `VariantOptionValue` (`variant_id`, `option_value_id`) VALUES
(701, 10),  -- Daria - Black
(702, 11),  -- Daria - Beige
(801, 15),  -- Sophia - Gold (approximation pour Black-Gold)
(901, 12),  -- Lungomare - Navy
(1201, 14), -- Sienna - Brown
(1202, 10); -- Sienna - Black

-- ============================================
-- FIN DU SCRIPT
-- ============================================

-- Vérification : compter les variants créés
SELECT 'Nombre de variants créés:' as Info, COUNT(*) as Total FROM ProductVariant;

-- Vérification : compter les liaisons variant-options
SELECT 'Nombre de liaisons variant-option:' as Info, COUNT(*) as Total FROM VariantOptionValue;
