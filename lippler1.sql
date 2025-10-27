-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : lun. 27 oct. 2025 à 11:06
-- Version du serveur : 10.11.14-MariaDB-0+deb12u2
-- Version de PHP : 8.3.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `lippler1`
--

-- --------------------------------------------------------

--
-- Structure de la table `AdminLog`
--

CREATE TABLE `AdminLog` (
  `id` int(11) NOT NULL,
  `admin_user_id` int(11) NOT NULL,
  `action_type` varchar(50) NOT NULL,
  `target_entity` varchar(50) DEFAULT NULL,
  `target_id` int(11) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `timestamp` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Category`
--

CREATE TABLE `Category` (
  `id` int(11) NOT NULL,
  `name` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Déchargement des données de la table `Category`
--

INSERT INTO `Category` (`id`, `name`) VALUES
(1, 'Baskets'),
(2, 'Talons'),
(3, 'Sacs');

-- --------------------------------------------------------

--
-- Structure de la table `Commandes`
--

CREATE TABLE `Commandes` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `date_commande` datetime NOT NULL DEFAULT current_timestamp(),
  `statut` varchar(50) NOT NULL DEFAULT 'en cours',
  `montant_total` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Commandes`
--

INSERT INTO `Commandes` (`id`, `client_id`, `date_commande`, `statut`, `montant_total`) VALUES
(6, 1, '2025-10-21 13:45:30', 'retirée', '490.00'),
(7, 1, '2025-10-22 07:04:55', 'retirée', '1190.00'),
(8, 1, '2025-10-22 09:17:01', 'retirée', '3900.00'),
(9, 1, '2025-10-22 10:00:54', 'disponible', '1440.00'),
(11, 1, '2025-10-22 11:38:29', 'en cours', '1180.00'),
(15, 2, '2025-10-22 11:50:05', 'en cours', '615.00'),
(16, 2, '2025-10-22 13:20:26', 'en cours', '490.00'),
(17, 2, '2025-10-22 13:48:12', 'en cours', '490.00'),
(18, 1, '2025-10-23 08:14:36', 'en cours', '1190.00'),
(20, 1, '2025-10-23 08:34:09', 'en cours', '1250.00'),
(26, 1, '2025-10-23 16:02:38', 'en cours', '1715.00'),
(27, 1, '2025-10-23 16:04:14', 'en cours', '250.00'),
(28, 1, '2025-10-23 16:04:23', 'en cours', '125.00');

-- --------------------------------------------------------

--
-- Structure de la table `OptionType`
--

CREATE TABLE `OptionType` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `OptionType`
--

INSERT INTO `OptionType` (`id`, `name`) VALUES
(2, 'Couleur'),
(1, 'Taille');

-- --------------------------------------------------------

--
-- Structure de la table `OptionValue`
--

CREATE TABLE `OptionValue` (
  `id` int(11) NOT NULL,
  `option_type_id` int(11) NOT NULL,
  `value` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(100) DEFAULT NULL,
  `hex_code` varchar(7) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `OptionValue`
--

INSERT INTO `OptionValue` (`id`, `option_type_id`, `value`, `label`, `hex_code`) VALUES
(27, 1, '35', '35', NULL),
(28, 1, '36', '36', NULL),
(29, 1, '37', '37', NULL),
(30, 1, '38', '38', NULL),
(31, 1, '39', '39', NULL),
(32, 1, '40', '40', NULL),
(33, 1, '41', '41', NULL),
(34, 2, 'latte_olive', 'Latte Olive', '#646846'),
(35, 2, 'pale_white_navy', 'Pale White Navy', '#282099'),
(36, 2, 'latte_blue', 'Latte Blue', '#005BD3'),
(37, 2, 'pale_white_gold', 'Pale White Gold', '#D49A06'),
(38, 2, 'pale_white_silver', 'Pale White Silver', '#D1D1D1'),
(39, 2, 'pale_white_orange', 'Pale White Orange', '#C16611'),
(40, 1, '35.5', '35.5', NULL),
(41, 1, '36.5', '36.5', NULL),
(42, 1, '37.5', '37.5', NULL),
(43, 1, '38.5', '38.5', NULL),
(44, 1, '39.5', '39.5', NULL),
(45, 1, '40.5', '40.5', NULL),
(46, 1, '41.5', '41.5', NULL),
(47, 1, '42', '42', NULL),
(55, 2, 'caramel', 'Caramel', '#ae5f14'),
(57, 2, 'white', 'White', '#ffffff'),
(58, 2, 'metallic_silver', 'Metallic Silver', '#D3D3D3'),
(59, 2, 'taupe', 'Taupe', '#bc9576'),
(60, 2, 'bubble_gum', 'Bubble Gum', '#FFC0CB'),
(61, 2, 'pistachio', 'Pistachio', '#abc15a'),
(113, 2, 'beige', 'Beige', '#dfd5bb'),
(181, 2, 'black_white', 'Black White', '#000000'),
(198, 2, 'tangerine', 'Tangerine', '#e45b0e'),
(214, 2, 'blueberry', 'Blueberry', '#4244ae'),
(230, 2, 'cream', 'Cream', '#ded8b8'),
(246, 2, 'brown', 'Brown', '#603914'),
(274, 2, 'baby_pink', 'Baby Pink', '#f4c2c2'),
(278, 2, 'grey_suede', 'Grey Suede', '#979a9b'),
(310, 2, 'black', 'Black', '#000000'),
(311, 2, 'silver', 'Silver', '#D3D3D3'),
(312, 2, 'black_gold', 'Black Gold', '#000000'),
(313, 2, 'deep_blue', 'Deep Blue', '#4244ae'),
(314, 2, 'raspberry', 'Raspberry', '#ef1056'),
(315, 2, 'sky_blue', 'Sky Blue', '#71bbed'),
(316, 2, 'deep_brown', 'Deep Brown', '#544241'),
(332, 2, 'dark_gray', 'Dark Gray', '#000000'),
(348, 2, 'navy', 'Navy', '#0d2f68'),
(364, 2, 'leather_black', 'Leather Black', '#000000');

-- --------------------------------------------------------

--
-- Structure de la table `OptionValueImage`
--

CREATE TABLE `OptionValueImage` (
  `id` int(11) NOT NULL,
  `option_value_id` int(11) NOT NULL,
  `image_path` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `OptionValueImage`
--

INSERT INTO `OptionValueImage` (`id`, `option_value_id`, `image_path`) VALUES
(3, 34, 'vintage.jpg'),
(4, 35, 'vintage-navy.jpg'),
(5, 35, 'vintage-navy2.jpg'),
(6, 34, 'vintage2.jpg'),
(7, 36, 'vintage-latte.jpg'),
(8, 36, 'vintage-latte2.jpg'),
(9, 37, 'vintage-gold.jpg'),
(10, 37, 'vintage-gold2.jpg'),
(11, 38, 'vintage-silver.jpg'),
(12, 38, 'vintage-silver2.jpg'),
(13, 39, 'vintage-orange.jpg'),
(14, 39, 'vintage-orange2.jpg'),
(15, 55, 'desert.jpg'),
(16, 55, 'desert2.jpg'),
(17, 55, 'desert3.jpg'),
(18, 57, 'princeton.jpg'),
(19, 57, 'princeton2.jpg'),
(20, 58, 'sorrento.jpg'),
(21, 58, 'sorrento2.jpg'),
(22, 59, 'bonbon.jpg'),
(23, 59, 'bonbon2.jpg'),
(24, 60, 'bonbon-bubble.jpg'),
(25, 60, 'bonbon-bubble2.jpg'),
(26, 61, 'bonbon-pistachio.jpg'),
(27, 61, 'bonbon-pistachio2.jpg'),
(28, 113, 'bonbon-beige.jpg'),
(29, 113, 'bonbon-beige2.jpg'),
(30, 181, 'bonbon-black.jpg'),
(31, 181, 'bonbon-black2.jpg'),
(32, 198, 'bonbon-tangerine.jpg'),
(33, 198, 'bonbon-tangerine2.jpg'),
(34, 214, 'bonbon-blueberry.jpg'),
(35, 214, 'bonbon-blueberry2.jpg'),
(36, 230, 'bonbon-cream.jpg'),
(37, 230, 'bonbon-cream2.jpg'),
(38, 246, 'claire.jpg'),
(39, 246, 'claire2.jpg'),
(40, 246, 'claire3.jpg'),
(41, 246, 'claire4.jpg'),
(42, 278, 'beatrice-grey.jpg'),
(43, 278, 'beatrice-grey2.jpg'),
(44, 278, 'beatrice-grey3.jpg'),
(45, 278, 'beatrice-grey4.jpg'),
(46, 274, 'beatrice.jpg'),
(47, 274, 'beatrice2.jpg'),
(48, 274, 'beatrice3.jpg'),
(49, 274, 'beatrice4.jpg'),
(50, 310, 'daria.jpg'),
(51, 310, 'daria2.jpg'),
(52, 311, 'daria-silver.jpg'),
(53, 312, 'sophia.jpg'),
(54, 312, 'sophia2.jpg'),
(55, 313, 'lungomare.jpg'),
(56, 313, 'lungomare2.jpg'),
(57, 313, 'lungomare3.jpg'),
(58, 313, 'lungomare4.jpg'),
(59, 314, 'lungomare-red.jpg'),
(60, 314, 'lungomare-red2.jpg'),
(61, 314, 'lungomare-red3.jpg'),
(62, 314, 'lungomare-red4.jpg'),
(63, 315, 'lungomare-blue.jpg'),
(64, 315, 'lungomare-blue2.jpg'),
(65, 315, 'lungomare-blue3.jpg'),
(66, 316, 'iza.jpg'),
(67, 316, 'iza2.jpg'),
(68, 316, 'iza3.jpg'),
(69, 332, 'iza-black.jpg'),
(70, 332, 'iza-black2.jpg'),
(71, 332, 'iza-black3.jpg'),
(72, 348, 'iza-navy.jpg'),
(73, 348, 'iza-navy2.jpg'),
(74, 348, 'iza-navy3.jpg'),
(75, 364, 'sienna.jpg'),
(76, 364, 'sienna2.jpg'),
(77, 364, 'sienna3.jpg');

-- --------------------------------------------------------

--
-- Structure de la table `Order_Items`
--

CREATE TABLE `Order_Items` (
  `id` int(11) NOT NULL,
  `commande_id` int(11) NOT NULL,
  `variant_id` int(11) NOT NULL,
  `quantite` int(11) NOT NULL,
  `prix_unitaire` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `Order_Items`
--

INSERT INTO `Order_Items` (`id`, `commande_id`, `variant_id`, `quantite`, `prix_unitaire`) VALUES
(4, 6, 41, 1, '490.00'),
(5, 7, 312, 1, '1190.00'),
(6, 8, 365, 1, '3900.00'),
(7, 9, 82, 1, '590.00'),
(8, 9, 358, 1, '850.00'),
(12, 11, 21, 1, '490.00'),
(13, 11, 283, 1, '690.00'),
(19, 15, 22, 1, '490.00'),
(20, 15, 414, 1, '125.00'),
(21, 16, 40, 1, '490.00'),
(22, 17, 22, 1, '490.00'),
(23, 18, 308, 1, '1190.00'),
(25, 20, 414, 10, '125.00'),
(26, 26, 19, 1, '490.00'),
(27, 26, 355, 1, '850.00'),
(28, 26, 414, 3, '125.00'),
(29, 27, 414, 2, '125.00'),
(30, 28, 414, 1, '125.00');

-- --------------------------------------------------------

--
-- Structure de la table `Product`
--

CREATE TABLE `Product` (
  `id` int(11) NOT NULL,
  `name` varchar(256) NOT NULL,
  `prix` decimal(11,2) DEFAULT NULL,
  `image` varchar(150) DEFAULT NULL,
  `category` int(11) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Déchargement des données de la table `Product`
--

INSERT INTO `Product` (`id`, `name`, `prix`, `image`, `category`, `description`) VALUES
(1, 'Vintage W', '490.00', 'vintage.jpg', 1, 'Vintage inspired cow leather sneakers for comfort and style. Retro color accents and cracked leather effect in the heel add unique vintage expressions. Wax coated laces stay flat and neat. \r\n\r\nMade in Italy\r\nCow leather\r\nWax coated shoelace'),
(2, 'Desert W', '590.00', 'desert.jpg', 1, 'Crafted from Italian Mediterranean buffalo leather and individually hand dipped in the pool of vibrant dyes by Italian artisans. This hand-dip dye method creates a fabulously gradient hue from the tip of the toe to the heel as well as the shoelaces. \r\n\r\nHandmade in Italy\r\nItalian Mediterranean Buffalo leather\r\nHand-dip dyed'),
(3, 'Princeton W', '590.00', 'princeton.jpg', 1, 'The clean, simple white leather sneaker crafted from very soft premium deerskin. \r\n\r\nHandmade in Italy\r\nDeerskin\r\nWhite rubber sole'),
(4, 'Bonbon', '690.00', 'bonbon.jpg', 2, 'BonBon Sandal Collection encapsulates the essence of Mediterranean sunshine and effortless Italian glamour. Elegant with leather strap and a sumptuous leather bow, BonBon\'s 70mm block heel provides the perfect height for comfort and style.\r\n\r\nHandmade in Italy\r\nWoven canvas and leather\r\n70mm (~2.76 inches)'),
(5, 'Claire', '1190.00', 'claire.jpg\r\n', 2, 'A refined ankle boot with skinny heel for an elegant enhancement. Crafted from premium kangaroo leather that stretches and molds to your figure, allowing great comfort. Leather lined with zipper on the side for ease. Hand painted colors and elegant sheen give a polished look. \r\n\r\nHandmade in Italy\r\nKangaroo leather\r\nHand painted\r\nZipper on the side \r\nLeather sole\r\n75MM heel'),
(6, 'Beatrice', '850.00', 'beatrice.jpg', 2, 'Beatrice, an alluringly chic pump with a subtly retro feel. Comfortable with pointed but roomy toe and elasticized sling back design. Beige in kangaroo leather. \r\n\r\nHandmade in Italy\r\nKangaroo leather\r\nLined with leather \r\nLeather sole \r\nSling back\r\n75MM heel'),
(7, 'Daria', '1900.00', 'daria.jpg', 3, 'Super light crinkly leather tote with roomy space. A balance of minimalistic urban cool. Two pockets inside to stay organized. Zipper closure at the top. \r\n\r\nHandmade in Japan\r\nCrinkly leather\r\nZipper closure\r\nPockets inside\r\nStuds (bag feet) at bottom'),
(8, 'Sophia', '3900.00', 'sophia.jpg', 3, 'A unique and elegant handbag crafted from crocodile printed leather, speckled with real gold leaf. Luxurious kimono in black and gold pattern on the side. Top-handle with shoulder strap.      \r\n\r\nHandmade in Japan\r\nCrocodile printed leather\r\nReal gold leaf\r\nKimono'),
(9, 'Lungomare', '2500.00', 'lungomare.jpg', 3, 'Beautiful basket bag adorned in stunning deep blue crocodile skin. Cotton drawstring bag securely holds the items inside. Perfect size for the city and the beach.  \r\n\r\nHandmade in Italy\r\nExotic leather - crocodile skin \r\nBasket bag'),
(10, 'Sorrento', '595.00', 'sorrento.jpg', 1, 'A light platform sneaker that combines metallic silver woven fabric and leather. Sparkly but understated to keep it elegant. \r\n\r\nHandmade in Italy\r\nLeather\r\nMetallic woven fabric\r\nLined with leather inside\r\nLight rubber sole'),
(11, 'Iza', '1290.00', 'iza.jpg', 2, 'A true fan favorite and a wardrobe essential. An elegant ankle boot crafted from premium kangaroo leather and hand painted in artisanal shades. Clean, streamlined design with a zipper on the side for convenience. Versatile from day to evening. \r\n\r\nHandmade in Italy\r\nKangaroo leather\r\nHand painted\r\nLight rubber sole\r\nZipper on the side\r\nAnkle boot\r\n60MM heel'),
(12, 'Sienna', '125.00', 'sienna.jpg', 3, 'Designed for movement, it features a single shoulder strap for easy wear—whether slung over the shoulder or styled crossbody. The interior, lined in durable canvas, offers just enough space for your daily essentials. A discreet side zipper adds convenience without compromising its refined aesthetic.\r\n\r\nHandmade in Italy\r\nFull-grain leather, hand-finished\r\nCanvas lining\r\nGold-tone hardware\r\nSingle shoulder/crossbody strap\r\nSide zipper closure\r\nCompact and functional');

-- --------------------------------------------------------

--
-- Structure de la table `ProductVariant`
--

CREATE TABLE `ProductVariant` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `sku` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `ProductVariant`
--

INSERT INTO `ProductVariant` (`id`, `product_id`, `sku`, `price`, `stock`) VALUES
(19, 1, 'LBL-35', '490.00', 10),
(20, 1, 'LTO-35', '490.00', 10),
(21, 1, 'PWG-35', '490.00', 10),
(22, 1, 'PWN-35', '490.00', 10),
(23, 1, 'PWO-35', '490.00', 10),
(24, 1, 'PWS-35', '490.00', 10),
(25, 1, 'LBL-36', '490.00', 10),
(26, 1, 'LTO-36', '490.00', 10),
(27, 1, 'PWG-36', '490.00', 10),
(28, 1, 'PWN-36', '490.00', 10),
(29, 1, 'PWO-36', '490.00', 10),
(30, 1, 'PWS-36', '490.00', 10),
(31, 1, 'LBL-37', '490.00', 50),
(32, 1, 'LTO-37', '490.00', 50),
(33, 1, 'PWG-37', '490.00', 50),
(34, 1, 'PWN-37', '490.00', 50),
(35, 1, 'PWO-37', '490.00', 50),
(36, 1, 'PWS-37', '490.00', 50),
(37, 1, 'LBL-38', '490.00', 50),
(38, 1, 'LTO-38', '490.00', 50),
(39, 1, 'PWG-38', '490.00', 50),
(40, 1, 'PWN-38', '490.00', 50),
(41, 1, 'PWO-38', '490.00', 50),
(42, 1, 'PWS-38', '490.00', 50),
(43, 1, 'LBL-39', '490.00', 50),
(44, 1, 'LTO-39', '490.00', 50),
(45, 1, 'PWG-39', '490.00', 50),
(46, 1, 'PWN-39', '490.00', 50),
(47, 1, 'PWO-39', '490.00', 50),
(48, 1, 'PWS-39', '490.00', 50),
(49, 1, 'LBL-40', '490.00', 50),
(50, 1, 'LTO-40', '490.00', 50),
(51, 1, 'PWG-40', '490.00', 50),
(52, 1, 'PWN-40', '490.00', 50),
(53, 1, 'PWO-40', '490.00', 50),
(54, 1, 'PWS-40', '490.00', 50),
(55, 1, 'LBL-41', '490.00', 50),
(56, 1, 'LTO-41', '490.00', 50),
(57, 1, 'PWG-41', '490.00', 50),
(58, 1, 'PWN-41', '490.00', 50),
(59, 1, 'PWO-41', '490.00', 50),
(60, 1, 'PWS-41', '490.00', 50),
(82, 2, 'DES-CARAMEL-35', '590.00', 0),
(83, 2, 'DES-CARAMEL-35.5', '590.00', 0),
(84, 2, 'DES-CARAMEL-36', '590.00', 0),
(85, 2, 'DES-CARAMEL-36.5', '590.00', 0),
(86, 2, 'DES-CARAMEL-37', '590.00', 0),
(87, 2, 'DES-CARAMEL-37.5', '590.00', 0),
(88, 2, 'DES-CARAMEL-38', '590.00', 8),
(89, 2, 'DES-CARAMEL-38.5', '590.00', 0),
(90, 2, 'DES-CARAMEL-39', '590.00', 8),
(91, 2, 'DES-CARAMEL-39.5', '590.00', 0),
(92, 2, 'DES-CARAMEL-40', '590.00', 0),
(93, 2, 'DES-CARAMEL-40.5', '590.00', 0),
(94, 2, 'DES-CARAMEL-41', '590.00', 0),
(95, 2, 'DES-CARAMEL-41.5', '590.00', 0),
(96, 2, 'DES-CARAMEL-42', '590.00', 0),
(97, 3, 'PRIN-WHITE-35', '590.00', 0),
(98, 3, 'PRIN-WHITE-36', '590.00', 1),
(99, 3, 'PRIN-WHITE-37', '590.00', 1),
(100, 3, 'PRIN-WHITE-38', '590.00', 1),
(101, 3, 'PRIN-WHITE-39', '590.00', 1),
(102, 3, 'PRIN-WHITE-40', '590.00', 1),
(103, 3, 'PRIN-WHITE-41', '590.00', 0),
(104, 3, 'PRIN-WHITE-42', '590.00', 0),
(105, 10, 'SORR-METALSIL-35', '595.00', 10),
(106, 10, 'SORR-METALSIL-35.5', '595.00', 10),
(107, 10, 'SORR-METALSIL-36', '595.00', 10),
(108, 10, 'SORR-METALSIL-36.5', '595.00', 10),
(109, 10, 'SORR-METALSIL-37', '595.00', 10),
(110, 10, 'SORR-METALSIL-37.5', '595.00', 10),
(111, 10, 'SORR-METALSIL-38', '595.00', 0),
(112, 10, 'SORR-METALSIL-38.5', '595.00', 10),
(113, 10, 'SORR-METALSIL-39', '595.00', 10),
(114, 10, 'SORR-METALSIL-39.5', '595.00', 10),
(115, 10, 'SORR-METALSIL-40', '595.00', 10),
(116, 10, 'SORR-METALSIL-40.5', '595.00', 10),
(117, 10, 'SORR-METALSIL-41', '595.00', 0),
(118, 10, 'SORR-METALSIL-41.5', '595.00', 0),
(119, 10, 'SORR-METALSIL-42', '595.00', 10),
(120, 4, 'BONB-TAUPE-35', '690.00', 0),
(121, 4, 'BONB-TAUPE-35.5', '690.00', 0),
(122, 4, 'BONB-TAUPE-36', '690.00', 0),
(123, 4, 'BONB-TAUPE-36.5', '690.00', 0),
(124, 4, 'BONB-TAUPE-37', '690.00', 0),
(125, 4, 'BONB-TAUPE-37.5', '690.00', 0),
(126, 4, 'BONB-TAUPE-38', '690.00', 0),
(127, 4, 'BONB-TAUPE-38.5', '690.00', 0),
(128, 4, 'BONB-TAUPE-39', '690.00', 0),
(129, 4, 'BONB-TAUPE-39.5', '690.00', 0),
(130, 4, 'BONB-TAUPE-40', '690.00', 0),
(131, 4, 'BONB-TAUPE-40.5', '690.00', 0),
(132, 4, 'BONB-TAUPE-41', '690.00', 0),
(133, 4, 'BONB-TAUPE-41.5', '690.00', 0),
(134, 4, 'BONB-TAUPE-42', '690.00', 0),
(135, 4, 'BONB-BUBGUM-35', '690.00', 0),
(136, 4, 'BONB-BUBGUM-35.5', '690.00', 0),
(137, 4, 'BONB-BUBGUM-36', '690.00', 0),
(138, 4, 'BONB-BUBGUM-36.5', '690.00', 0),
(139, 4, 'BONB-BUBGUM-37', '690.00', 0),
(140, 4, 'BONB-BUBGUM-37.5', '690.00', 0),
(141, 4, 'BONB-BUBGUM-38', '690.00', 0),
(142, 4, 'BONB-BUBGUM-38.5', '690.00', 0),
(143, 4, 'BONB-BUBGUM-39', '690.00', 0),
(144, 4, 'BONB-BUBGUM-39.5', '690.00', 0),
(145, 4, 'BONB-BUBGUM-40', '690.00', 0),
(146, 4, 'BONB-BUBGUM-40.5', '690.00', 0),
(147, 4, 'BONB-BUBGUM-41', '690.00', 0),
(148, 4, 'BONB-BUBGUM-41.5', '690.00', 0),
(149, 4, 'BONB-BUBGUM-42', '690.00', 0),
(165, 4, 'PIS-35', '690.00', 0),
(166, 4, 'PIS-36', '690.00', 0),
(167, 4, 'PIS-37', '690.00', 0),
(168, 4, 'PIS-38', '690.00', 0),
(169, 4, 'PIS-39', '690.00', 0),
(170, 4, 'PIS-40', '690.00', 0),
(171, 4, 'PIS-41', '690.00', 0),
(172, 4, 'PIS-42', '690.00', 0),
(227, 4, 'BEIGE-35', '690.00', 0),
(228, 4, 'BEIGE-35.5', '690.00', 0),
(229, 4, 'BEIGE-36', '690.00', 0),
(230, 4, 'BEIGE-36.5', '690.00', 0),
(231, 4, 'BEIGE-37', '690.00', 0),
(232, 4, 'BEIGE-37.5', '690.00', 0),
(233, 4, 'BEIGE-38', '690.00', 0),
(234, 4, 'BEIGE-38.5', '690.00', 0),
(235, 4, 'BEIGE-39', '690.00', 0),
(236, 4, 'BEIGE-39.5', '690.00', 0),
(237, 4, 'BEIGE-40', '690.00', 0),
(238, 4, 'BEIGE-40.5', '690.00', 0),
(239, 4, 'BEIGE-41', '690.00', 3),
(240, 4, 'BEIGE-41.5', '690.00', 0),
(241, 4, 'BEIGE-42', '690.00', 0),
(243, 4, 'BLAW-35', '690.00', 0),
(244, 4, 'BLAW-35.5', '690.00', 0),
(245, 4, 'BLAW-36', '690.00', 0),
(246, 4, 'BLAW-36.5', '690.00', 0),
(247, 4, 'BLAW-37', '690.00', 0),
(248, 4, 'BLAW-37.5', '690.00', 0),
(249, 4, 'BLAW-38', '690.00', 0),
(250, 4, 'BLAW-38.5', '690.00', 5),
(251, 4, 'BLAW-39', '690.00', 0),
(252, 4, 'BLAW-39.5', '690.00', 0),
(253, 4, 'BLAW-40', '690.00', 0),
(254, 4, 'BLAW-40.5', '690.00', 0),
(255, 4, 'BLAW-41', '690.00', 0),
(256, 4, 'BLAW-41.5', '690.00', 0),
(257, 4, 'BLAW-42', '690.00', 0),
(258, 4, 'TANG-35', '690.00', 7),
(259, 4, 'TANG-35.5', '690.00', 7),
(260, 4, 'TANG-36', '690.00', 0),
(261, 4, 'TANG-36.5', '690.00', 0),
(262, 4, 'TANG-37', '690.00', 0),
(263, 4, 'TANG-37.5', '690.00', 0),
(264, 4, 'TANG-38', '690.00', 0),
(265, 4, 'TANG-38.5', '690.00', 0),
(266, 4, 'TANG-39', '690.00', 0),
(267, 4, 'TANG-39.5', '690.00', 0),
(268, 4, 'TANG-40', '690.00', 0),
(269, 4, 'TANG-40.5', '690.00', 0),
(270, 4, 'TANG-41', '690.00', 0),
(271, 4, 'TANG-41.5', '690.00', 0),
(272, 4, 'TANG-42', '690.00', 0),
(273, 4, 'BLUE-35', '690.00', 0),
(274, 4, 'BLUE-35.5', '690.00', 0),
(275, 4, 'BLUE-36', '690.00', 0),
(276, 4, 'BLUE-36.5', '690.00', 0),
(277, 4, 'BLUE-37', '690.00', 0),
(278, 4, 'BLUE-37.5', '690.00', 0),
(279, 4, 'BLUE-38', '690.00', 0),
(280, 4, 'BLUE-38.5', '690.00', 0),
(281, 4, 'BLUE-39', '690.00', 0),
(282, 4, 'BLUE-39.5', '690.00', 0),
(283, 4, 'BLUE-40', '690.00', 0),
(284, 4, 'BLUE-40.5', '690.00', 0),
(285, 4, 'BLUE-41', '690.00', 0),
(286, 4, 'BLUE-41.5', '690.00', 0),
(287, 4, 'BLUE-42', '690.00', 0),
(288, 4, 'CREA-35', '690.00', 0),
(289, 4, 'CREA-35.5', '690.00', 0),
(290, 4, 'CREA-36', '690.00', 0),
(291, 4, 'CREA-36.5', '690.00', 0),
(292, 4, 'CREA-37', '690.00', 0),
(293, 4, 'CREA-37.5', '690.00', 0),
(294, 4, 'CREA-38', '690.00', 0),
(295, 4, 'CREA-38.5', '690.00', 0),
(296, 4, 'CREA-39', '690.00', 0),
(297, 4, 'CREA-39.5', '690.00', 0),
(298, 4, 'CREA-40', '690.00', 0),
(299, 4, 'CREA-40.5', '690.00', 0),
(300, 4, 'CREA-41', '690.00', 0),
(301, 4, 'CREA-41.5', '690.00', 0),
(302, 4, 'CREA-42', '690.00', 0),
(303, 5, 'BROW-35', '1190.00', 0),
(304, 5, 'BROW-35.5', '1190.00', 0),
(305, 5, 'BROW-36', '1190.00', 0),
(306, 5, 'BROW-36.5', '1190.00', 0),
(307, 5, 'BROW-37', '1190.00', 0),
(308, 5, 'BROW-37.5', '1190.00', 0),
(309, 5, 'BROW-38', '1190.00', 2),
(310, 5, 'BROW-38.5', '1190.00', 0),
(311, 5, 'BROW-39', '1190.00', 2),
(312, 5, 'BROW-39.5', '1190.00', 0),
(313, 5, 'BROW-40', '1190.00', 1),
(314, 5, 'BROW-40.5', '1190.00', 0),
(315, 5, 'BROW-41', '1190.00', 0),
(316, 5, 'BROW-41.5', '1190.00', 0),
(317, 5, 'BROW-42', '1190.00', 0),
(333, 6, 'GRES-35', '790.00', 0),
(334, 6, 'GRES-35.5', '790.00', 0),
(335, 6, 'GRES-36', '790.00', 0),
(336, 6, 'GRES-36.5', '790.00', 0),
(337, 6, 'GRES-37', '790.00', 0),
(338, 6, 'GRES-37.5', '790.00', 0),
(339, 6, 'GRES-38', '790.00', 5),
(340, 6, 'GRES-38.5', '790.00', 0),
(341, 6, 'GRES-39', '790.00', 5),
(342, 6, 'GRES-39.5', '790.00', 0),
(343, 6, 'GRES-40', '790.00', 0),
(344, 6, 'GRES-40.5', '790.00', 0),
(345, 6, 'GRES-41', '790.00', 0),
(346, 6, 'GRES-41.5', '790.00', 0),
(347, 6, 'GRES-42', '790.00', 0),
(348, 6, 'BAPI-35', '850.00', 10),
(349, 6, 'BAPI-35.5', '850.00', 10),
(350, 6, 'BAPI-36', '850.00', 10),
(351, 6, 'BAPI-36.5', '850.00', 10),
(352, 6, 'BAPI-37', '850.00', 10),
(353, 6, 'BAPI-37.5', '850.00', 10),
(354, 6, 'BAPI-38', '850.00', 10),
(355, 6, 'BAPI-38.5', '850.00', 10),
(356, 6, 'BAPI-39', '850.00', 10),
(357, 6, 'BAPI-39.5', '850.00', 10),
(358, 6, 'BAPI-40', '850.00', 10),
(359, 6, 'BAPI-40.5', '850.00', 10),
(360, 6, 'BAPI-41', '850.00', 10),
(361, 6, 'BAPI-41.5', '850.00', 10),
(362, 6, 'BAPI-42', '850.00', 10),
(363, 7, 'BLAC', '1900.00', 2),
(364, 7, 'SILV', '1900.00', 2),
(365, 8, 'BLAG', '3900.00', 0),
(366, 9, 'DEPB', '2500.00', 15),
(367, 9, 'RASP', '2500.00', 15),
(368, 9, 'SKYB', '3250.00', 15),
(369, 11, 'DEPBRO-35', '1290.00', 10),
(370, 11, 'DEPBRO-35.5', '1290.00', 10),
(371, 11, 'DEPBRO-36', '1290.00', 10),
(372, 11, 'DEPBRO-36.5', '1290.00', 10),
(373, 11, 'DEPBRO-37', '1290.00', 10),
(374, 11, 'DEPBRO-37.5', '1290.00', 10),
(375, 11, 'DEPBRO-38', '1290.00', 10),
(376, 11, 'DEPBRO-38.5', '1290.00', 10),
(377, 11, 'DEPBRO-39', '1290.00', 10),
(378, 11, 'DEPBRO-39.5', '1290.00', 10),
(379, 11, 'DEPBRO-40', '1290.00', 10),
(380, 11, 'DEPBRO-40.5', '1290.00', 10),
(381, 11, 'DEPBRO-41', '1290.00', 10),
(382, 11, 'DEPBRO-41.5', '1290.00', 10),
(383, 11, 'DEPBRO-42', '1290.00', 10),
(384, 11, 'DARGR-35', '1290.00', 0),
(385, 11, 'DARGR-35.5', '1290.00', 0),
(386, 11, 'DARGR-36', '1290.00', 0),
(387, 11, 'DARGR-36.5', '1290.00', 0),
(388, 11, 'DARGR-37', '1290.00', 0),
(389, 11, 'DARGR-37.5', '1290.00', 0),
(390, 11, 'DARGR-38', '1290.00', 6),
(391, 11, 'DARGR-38.5', '1290.00', 0),
(392, 11, 'DARGR-39', '1290.00', 6),
(393, 11, 'DARGR-39.5', '1290.00', 0),
(394, 11, 'DARGR-40', '1290.00', 0),
(395, 11, 'DARGR-40.5', '1290.00', 0),
(396, 11, 'DARGR-41', '1290.00', 0),
(397, 11, 'DARGR-41.5', '1290.00', 0),
(398, 11, 'DARGR-42', '1290.00', 0),
(399, 11, 'NAVY-35', '1290.00', 0),
(400, 11, 'NAVY-35.5', '1290.00', 0),
(401, 11, 'NAVY-36', '1290.00', 0),
(402, 11, 'NAVY-36.5', '1290.00', 0),
(403, 11, 'NAVY-37', '1290.00', 0),
(404, 11, 'NAVY-37.5', '1290.00', 0),
(405, 11, 'NAVY-38', '1290.00', 0),
(406, 11, 'NAVY-38.5', '1290.00', 0),
(407, 11, 'NAVY-39', '1290.00', 0),
(408, 11, 'NAVY-39.5', '1290.00', 0),
(409, 11, 'NAVY-40', '1290.00', 0),
(410, 11, 'NAVY-40.5', '1290.00', 0),
(411, 11, 'NAVY-41', '1290.00', 0),
(412, 11, 'NAVY-41.5', '1290.00', 0),
(413, 11, 'NAVY-42', '1290.00', 0),
(414, 12, 'LEABL', '125.00', 3);

-- --------------------------------------------------------

--
-- Structure de la table `StockMovement`
--

CREATE TABLE `StockMovement` (
  `id` int(11) NOT NULL,
  `variant_id` int(11) NOT NULL,
  `movement_date` datetime NOT NULL,
  `quantity_change` int(11) NOT NULL,
  `new_stock` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `reason` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `StockThresholds`
--

CREATE TABLE `StockThresholds` (
  `id` int(11) NOT NULL,
  `setting_name` varchar(50) NOT NULL,
  `setting_value` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `StockThresholds`
--

INSERT INTO `StockThresholds` (`id`, `setting_name`, `setting_value`, `description`, `updated_at`) VALUES
(1, 'LOW_STOCK', 5, 'Seuil pour \"Bientôt épuisé\" / \"Dernières tailles disponibles\"', '2025-10-27 09:26:16'),
(2, 'LOW_VARIANT_COUNT', 2, 'Seuil pour le nombre de tailles/variants disponibles', '2025-10-27 09:26:16'),
(3, 'CRITICAL_VARIANT_STOCK', 3, 'Seuil critique pour un variant individuel', '2025-10-27 09:26:16');

-- --------------------------------------------------------

--
-- Structure de la table `User`
--

CREATE TABLE `User` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `is_admin` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `User`
--

INSERT INTO `User` (`id`, `name`, `email`, `password_hash`, `username`, `is_admin`) VALUES
(1, 'Manon', 'manon.lippler3@gmail.com', '$2y$10$QtwyjVQhSfRwJxS4Oa2NBuMurkBUJOVdmUTi1mO/R8hFvOIvtHDvm', 'manon.lippler3', 1),
(2, '', 'sandrinesuriano@gmail.com', '$2y$10$r3NA/Ht1MLNkKStiKouJ8.C2Xoe3bzswJBLn5p5T7ilCvMOmTKVSS', 'sandrinesuriano', 0),
(3, 'David', 'david.lippler@gmail.com', '$2y$10$YdPZvgNutlat02wC9F5HQus5orGZwmXZBnTdYhBxj08DU13G4c1p6', 'david.lippler', 0);

-- --------------------------------------------------------

--
-- Structure de la table `VariantOptionValue`
--

CREATE TABLE `VariantOptionValue` (
  `variant_id` int(11) NOT NULL,
  `option_value_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `VariantOptionValue`
--

INSERT INTO `VariantOptionValue` (`variant_id`, `option_value_id`) VALUES
(19, 27),
(19, 36),
(20, 27),
(20, 34),
(21, 27),
(21, 37),
(22, 27),
(22, 35),
(23, 27),
(23, 39),
(24, 27),
(24, 38),
(25, 28),
(25, 36),
(26, 28),
(26, 34),
(27, 28),
(27, 37),
(28, 28),
(28, 35),
(29, 28),
(29, 39),
(30, 28),
(30, 38),
(31, 29),
(31, 36),
(32, 29),
(32, 34),
(33, 29),
(33, 37),
(34, 29),
(34, 35),
(35, 29),
(35, 39),
(36, 29),
(36, 38),
(37, 30),
(37, 36),
(38, 30),
(38, 34),
(39, 30),
(39, 37),
(40, 30),
(40, 35),
(41, 30),
(41, 39),
(42, 30),
(42, 38),
(43, 31),
(43, 36),
(44, 31),
(44, 34),
(45, 31),
(45, 37),
(46, 31),
(46, 35),
(47, 31),
(47, 39),
(48, 31),
(48, 38),
(49, 32),
(49, 36),
(50, 32),
(50, 34),
(51, 32),
(51, 37),
(52, 32),
(52, 35),
(53, 32),
(53, 39),
(54, 32),
(54, 38),
(55, 33),
(55, 36),
(56, 33),
(56, 34),
(57, 33),
(57, 37),
(58, 33),
(58, 35),
(59, 33),
(59, 39),
(60, 33),
(60, 38),
(82, 27),
(82, 55),
(83, 40),
(83, 55),
(84, 28),
(84, 55),
(85, 41),
(85, 55),
(86, 29),
(86, 55),
(87, 42),
(87, 55),
(88, 30),
(88, 55),
(89, 43),
(89, 55),
(90, 31),
(90, 55),
(91, 44),
(91, 55),
(92, 32),
(92, 55),
(93, 45),
(93, 55),
(94, 33),
(94, 55),
(95, 46),
(95, 55),
(96, 47),
(96, 55),
(97, 27),
(97, 57),
(98, 28),
(98, 57),
(99, 29),
(99, 57),
(100, 30),
(100, 57),
(101, 31),
(101, 57),
(102, 32),
(102, 57),
(103, 33),
(103, 57),
(104, 47),
(104, 57),
(105, 27),
(105, 58),
(106, 40),
(106, 58),
(107, 28),
(107, 58),
(108, 41),
(108, 58),
(109, 29),
(109, 58),
(110, 42),
(110, 58),
(111, 30),
(111, 58),
(112, 43),
(112, 58),
(113, 31),
(113, 58),
(114, 44),
(114, 58),
(115, 32),
(115, 58),
(116, 45),
(116, 58),
(117, 33),
(117, 58),
(118, 46),
(118, 58),
(119, 47),
(119, 58),
(120, 27),
(120, 59),
(121, 40),
(121, 59),
(122, 28),
(122, 59),
(123, 41),
(123, 59),
(124, 29),
(124, 59),
(125, 42),
(125, 59),
(126, 30),
(126, 59),
(127, 43),
(127, 59),
(128, 31),
(128, 59),
(129, 44),
(129, 59),
(130, 32),
(130, 59),
(131, 45),
(131, 59),
(132, 33),
(132, 59),
(133, 46),
(133, 59),
(134, 47),
(134, 59),
(135, 27),
(135, 60),
(136, 40),
(136, 60),
(137, 28),
(137, 60),
(138, 41),
(138, 60),
(139, 29),
(139, 60),
(140, 42),
(140, 60),
(141, 30),
(141, 60),
(142, 43),
(142, 60),
(143, 31),
(143, 60),
(144, 44),
(144, 60),
(145, 32),
(145, 60),
(146, 45),
(146, 60),
(147, 33),
(147, 60),
(148, 46),
(148, 60),
(149, 47),
(149, 60),
(165, 27),
(165, 61),
(166, 28),
(166, 61),
(167, 29),
(167, 61),
(168, 30),
(168, 61),
(169, 31),
(169, 61),
(170, 32),
(170, 61),
(171, 33),
(171, 61),
(172, 47),
(172, 61),
(227, 27),
(227, 113),
(228, 40),
(228, 113),
(229, 28),
(229, 113),
(230, 41),
(230, 113),
(231, 29),
(231, 113),
(232, 42),
(232, 113),
(233, 30),
(233, 113),
(234, 43),
(234, 113),
(235, 31),
(235, 113),
(236, 44),
(236, 113),
(237, 32),
(237, 113),
(238, 45),
(238, 113),
(239, 33),
(239, 113),
(240, 46),
(240, 113),
(241, 47),
(241, 113),
(243, 27),
(243, 181),
(244, 40),
(244, 181),
(245, 28),
(245, 181),
(246, 41),
(246, 181),
(247, 29),
(247, 181),
(248, 42),
(248, 181),
(249, 30),
(249, 181),
(250, 43),
(250, 181),
(251, 31),
(251, 181),
(252, 44),
(252, 181),
(253, 32),
(253, 181),
(254, 45),
(254, 181),
(255, 33),
(255, 181),
(256, 46),
(256, 181),
(257, 47),
(257, 181),
(258, 27),
(258, 198),
(259, 40),
(259, 198),
(260, 28),
(260, 198),
(261, 41),
(261, 198),
(262, 29),
(262, 198),
(263, 42),
(263, 198),
(264, 30),
(264, 198),
(265, 43),
(265, 198),
(266, 31),
(266, 198),
(267, 44),
(267, 198),
(268, 32),
(268, 198),
(269, 45),
(269, 198),
(270, 33),
(270, 198),
(271, 46),
(271, 198),
(272, 47),
(272, 198),
(273, 27),
(273, 214),
(274, 40),
(274, 214),
(275, 28),
(275, 214),
(276, 41),
(276, 214),
(277, 29),
(277, 214),
(278, 42),
(278, 214),
(279, 30),
(279, 214),
(280, 43),
(280, 214),
(281, 31),
(281, 214),
(282, 44),
(282, 214),
(283, 32),
(283, 214),
(284, 45),
(284, 214),
(285, 33),
(285, 214),
(286, 46),
(286, 214),
(287, 47),
(287, 214),
(288, 27),
(288, 230),
(289, 40),
(289, 230),
(290, 28),
(290, 230),
(291, 41),
(291, 230),
(292, 29),
(292, 230),
(293, 42),
(293, 230),
(294, 30),
(294, 230),
(295, 43),
(295, 230),
(296, 31),
(296, 230),
(297, 44),
(297, 230),
(298, 32),
(298, 230),
(299, 45),
(299, 230),
(300, 33),
(300, 230),
(301, 46),
(301, 230),
(302, 47),
(302, 230),
(303, 27),
(303, 246),
(304, 40),
(304, 246),
(305, 28),
(305, 246),
(306, 41),
(306, 246),
(307, 29),
(307, 246),
(308, 42),
(308, 246),
(309, 30),
(309, 246),
(310, 43),
(310, 246),
(311, 31),
(311, 246),
(312, 44),
(312, 246),
(313, 32),
(313, 246),
(314, 45),
(314, 246),
(315, 33),
(315, 246),
(316, 46),
(316, 246),
(317, 47),
(317, 246),
(333, 27),
(333, 278),
(334, 40),
(334, 278),
(335, 28),
(335, 278),
(336, 41),
(336, 278),
(337, 29),
(337, 278),
(338, 42),
(338, 278),
(339, 30),
(339, 278),
(340, 43),
(340, 278),
(341, 31),
(341, 278),
(342, 44),
(342, 278),
(343, 32),
(343, 278),
(344, 45),
(344, 278),
(345, 33),
(345, 278),
(346, 46),
(346, 278),
(347, 47),
(347, 278),
(348, 27),
(348, 274),
(349, 40),
(349, 274),
(350, 28),
(350, 274),
(351, 41),
(351, 274),
(352, 29),
(352, 274),
(353, 42),
(353, 274),
(354, 30),
(354, 274),
(355, 43),
(355, 274),
(356, 31),
(356, 274),
(357, 44),
(357, 274),
(358, 32),
(358, 274),
(359, 45),
(359, 274),
(360, 33),
(360, 274),
(361, 46),
(361, 274),
(362, 47),
(362, 274),
(363, 310),
(364, 311),
(365, 312),
(366, 313),
(367, 314),
(368, 315),
(369, 27),
(369, 316),
(370, 40),
(370, 316),
(371, 28),
(371, 316),
(372, 41),
(372, 316),
(373, 29),
(373, 316),
(374, 42),
(374, 316),
(375, 30),
(375, 316),
(376, 43),
(376, 316),
(377, 31),
(377, 316),
(378, 44),
(378, 316),
(379, 32),
(379, 316),
(380, 45),
(380, 316),
(381, 33),
(381, 316),
(382, 46),
(382, 316),
(383, 47),
(383, 316),
(384, 27),
(384, 332),
(385, 40),
(385, 332),
(386, 28),
(386, 332),
(387, 41),
(387, 332),
(388, 29),
(388, 332),
(389, 42),
(389, 332),
(390, 30),
(390, 332),
(391, 43),
(391, 332),
(392, 31),
(392, 332),
(393, 44),
(393, 332),
(394, 32),
(394, 332),
(395, 45),
(395, 332),
(396, 33),
(396, 332),
(397, 46),
(397, 332),
(398, 47),
(398, 332),
(399, 27),
(399, 348),
(400, 40),
(400, 348),
(401, 28),
(401, 348),
(402, 41),
(402, 348),
(403, 29),
(403, 348),
(404, 42),
(404, 348),
(405, 30),
(405, 348),
(406, 43),
(406, 348),
(407, 31),
(407, 348),
(408, 44),
(408, 348),
(409, 32),
(409, 348),
(410, 45),
(410, 348),
(411, 33),
(411, 348),
(412, 46),
(412, 348),
(413, 47),
(413, 348),
(414, 364);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `AdminLog`
--
ALTER TABLE `AdminLog`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_admin_user` (`admin_user_id`),
  ADD KEY `idx_action` (`action_type`),
  ADD KEY `idx_target` (`target_entity`,`target_id`);

--
-- Index pour la table `Category`
--
ALTER TABLE `Category`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Commandes`
--
ALTER TABLE `Commandes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`);

--
-- Index pour la table `OptionType`
--
ALTER TABLE `OptionType`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Index pour la table `OptionValue`
--
ALTER TABLE `OptionValue`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_option_value` (`option_type_id`,`value`),
  ADD KEY `option_type_id` (`option_type_id`);

--
-- Index pour la table `OptionValueImage`
--
ALTER TABLE `OptionValueImage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `option_value_id` (`option_value_id`);

--
-- Index pour la table `Order_Items`
--
ALTER TABLE `Order_Items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_order_item` (`commande_id`,`variant_id`),
  ADD KEY `fk_commande_items` (`commande_id`),
  ADD KEY `fk_produit_items` (`variant_id`);

--
-- Index pour la table `Product`
--
ALTER TABLE `Product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category` (`category`);

--
-- Index pour la table `ProductVariant`
--
ALTER TABLE `ProductVariant`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `product_id` (`product_id`);

--
-- Index pour la table `StockMovement`
--
ALTER TABLE `StockMovement`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_variant` (`variant_id`),
  ADD KEY `idx_order` (`order_id`),
  ADD KEY `idx_date` (`movement_date`);

--
-- Index pour la table `StockThresholds`
--
ALTER TABLE `StockThresholds`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_name` (`setting_name`);

--
-- Index pour la table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `VariantOptionValue`
--
ALTER TABLE `VariantOptionValue`
  ADD PRIMARY KEY (`variant_id`,`option_value_id`),
  ADD KEY `fk_vov_value` (`option_value_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `AdminLog`
--
ALTER TABLE `AdminLog`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `Category`
--
ALTER TABLE `Category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `Commandes`
--
ALTER TABLE `Commandes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT pour la table `OptionType`
--
ALTER TABLE `OptionType`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `OptionValue`
--
ALTER TABLE `OptionValue`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=365;

--
-- AUTO_INCREMENT pour la table `OptionValueImage`
--
ALTER TABLE `OptionValueImage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT pour la table `Order_Items`
--
ALTER TABLE `Order_Items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT pour la table `Product`
--
ALTER TABLE `Product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT pour la table `ProductVariant`
--
ALTER TABLE `ProductVariant`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=415;

--
-- AUTO_INCREMENT pour la table `StockMovement`
--
ALTER TABLE `StockMovement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `StockThresholds`
--
ALTER TABLE `StockThresholds`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `User`
--
ALTER TABLE `User`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `AdminLog`
--
ALTER TABLE `AdminLog`
  ADD CONSTRAINT `fk_adminlog_user` FOREIGN KEY (`admin_user_id`) REFERENCES `User` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `Commandes`
--
ALTER TABLE `Commandes`
  ADD CONSTRAINT `Commandes_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `User` (`id`);

--
-- Contraintes pour la table `OptionValue`
--
ALTER TABLE `OptionValue`
  ADD CONSTRAINT `fk_value_type` FOREIGN KEY (`option_type_id`) REFERENCES `OptionType` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `OptionValueImage`
--
ALTER TABLE `OptionValueImage`
  ADD CONSTRAINT `fk_ovi_option_value` FOREIGN KEY (`option_value_id`) REFERENCES `OptionValue` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `Order_Items`
--
ALTER TABLE `Order_Items`
  ADD CONSTRAINT `fk_commande_items` FOREIGN KEY (`commande_id`) REFERENCES `Commandes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_variant_items` FOREIGN KEY (`variant_id`) REFERENCES `ProductVariant` (`id`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `Product`
--
ALTER TABLE `Product`
  ADD CONSTRAINT `category` FOREIGN KEY (`category`) REFERENCES `Category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `ProductVariant`
--
ALTER TABLE `ProductVariant`
  ADD CONSTRAINT `fk_variant_product` FOREIGN KEY (`product_id`) REFERENCES `Product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `StockMovement`
--
ALTER TABLE `StockMovement`
  ADD CONSTRAINT `StockMovement_ibfk_1` FOREIGN KEY (`variant_id`) REFERENCES `ProductVariant` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `StockMovement_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `Commandes` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `VariantOptionValue`
--
ALTER TABLE `VariantOptionValue`
  ADD CONSTRAINT `fk_vov_value` FOREIGN KEY (`option_value_id`) REFERENCES `OptionValue` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_vov_variant` FOREIGN KEY (`variant_id`) REFERENCES `ProductVariant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
