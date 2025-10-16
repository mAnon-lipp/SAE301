-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : jeu. 16 oct. 2025 à 07:50
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
-- Structure de la table `Product`
--

CREATE TABLE `Product` (
  `id` int(11) NOT NULL,
  `name` varchar(256) NOT NULL,
  `prix` decimal(11,0) NOT NULL,
  `image` varchar(150) NOT NULL,
  `category` int(11) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Déchargement des données de la table `Product`
--

INSERT INTO `Product` (`id`, `name`, `prix`, `image`, `category`, `description`) VALUES
(1, 'Vintage W', '490', 'vintage.jpg', 1, 'Vintage inspired cow leather sneakers for comfort and style. Retro color accents and cracked leather effect in the heel add unique vintage expressions. Wax coated laces stay flat and neat. \r\n\r\nMade in Italy\r\nCow leather\r\nWax coated shoelace'),
(2, 'Desert W', '590', 'desert.jpg', 1, 'Crafted from Italian Mediterranean buffalo leather and individually hand dipped in the pool of vibrant dyes by Italian artisans. This hand-dip dye method creates a fabulously gradient hue from the tip of the toe to the heel as well as the shoelaces. \r\n\r\nHandmade in Italy\r\nItalian Mediterranean Buffalo leather\r\nHand-dip dyed'),
(3, 'Princeton W', '590', 'princeton.jpg', 1, 'The clean, simple white leather sneaker crafted from very soft premium deerskin. \r\n\r\nHandmade in Italy\r\nDeerskin\r\nWhite rubber sole'),
(4, 'Bonbon', '690', 'bonbon.jpg', 2, 'BonBon Sandal Collection encapsulates the essence of Mediterranean sunshine and effortless Italian glamour. Elegant with leather strap and a sumptuous leather bow, BonBon\'s 70mm block heel provides the perfect height for comfort and style.\r\n\r\nHandmade in Italy\r\nWoven canvas and leather\r\n70mm (~2.76 inches)'),
(5, 'Claire', '1190', 'claire.jpg\r\n', 2, 'A refined ankle boot with skinny heel for an elegant enhancement. Crafted from premium kangaroo leather that stretches and molds to your figure, allowing great comfort. Leather lined with zipper on the side for ease. Hand painted colors and elegant sheen give a polished look. \r\n\r\nHandmade in Italy\r\nKangaroo leather\r\nHand painted\r\nZipper on the side \r\nLeather sole\r\n75MM heel'),
(6, 'Beatrice', '850', 'beatrice.jpg', 2, 'Beatrice, an alluringly chic pump with a subtly retro feel. Comfortable with pointed but roomy toe and elasticized sling back design. Beige in kangaroo leather. \r\n\r\nHandmade in Italy\r\nKangaroo leather\r\nLined with leather \r\nLeather sole \r\nSling back\r\n75MM heel'),
(7, 'Daria', '1900', 'daria.jpg', 3, 'Super light crinkly leather tote with roomy space. A balance of minimalistic urban cool. Two pockets inside to stay organized. Zipper closure at the top. \r\n\r\nHandmade in Japan\r\nCrinkly leather\r\nZipper closure\r\nPockets inside\r\nStuds (bag feet) at bottom'),
(8, 'Sophia', '3900', 'sophia.jpg', 3, 'A unique and elegant handbag crafted from crocodile printed leather, speckled with real gold leaf. Luxurious kimono in black and gold pattern on the side. Top-handle with shoulder strap.      \r\n\r\nHandmade in Japan\r\nCrocodile printed leather\r\nReal gold leaf\r\nKimono'),
(9, 'Lungomare', '2500', 'lungomare.jpg', 3, 'Beautiful basket bag adorned in stunning deep blue crocodile skin. Cotton drawstring bag securely holds the items inside. Perfect size for the city and the beach.  \r\n\r\nHandmade in Italy\r\nExotic leather - crocodile skin \r\nBasket bag');

-- --------------------------------------------------------

--
-- Structure de la table `ProductImage`
--

CREATE TABLE `ProductImage` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `image_path` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `ProductImage`
--

INSERT INTO `ProductImage` (`id`, `product_id`, `image_path`) VALUES
(1, 1, 'vintage2.jpg'),
(2, 2, 'desert2.jpg'),
(3, 2, 'desert3.jpg'),
(4, 3, 'princeton2.jpg'),
(5, 6, 'beatrice2.jpg'),
(6, 6, 'beatrice3.jpg'),
(7, 6, 'beatrice4.jpg'),
(8, 4, 'bonbon2.jpg'),
(9, 5, 'claire2.jpg'),
(10, 5, 'claire3.jpg'),
(11, 5, 'claire4.jpg'),
(12, 7, 'daria2.jpg'),
(13, 8, 'sophia2.jpg'),
(14, 9, 'lungomare2.jpg'),
(15, 9, 'lungomare3.jpg'),
(16, 9, 'lungomare4.jpg');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `Category`
--
ALTER TABLE `Category`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Product`
--
ALTER TABLE `Product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category` (`category`);

--
-- Index pour la table `ProductImage`
--
ALTER TABLE `ProductImage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `Category`
--
ALTER TABLE `Category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `Product`
--
ALTER TABLE `Product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT pour la table `ProductImage`
--
ALTER TABLE `ProductImage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `Product`
--
ALTER TABLE `Product`
  ADD CONSTRAINT `category` FOREIGN KEY (`category`) REFERENCES `Category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `ProductImage`
--
ALTER TABLE `ProductImage`
  ADD CONSTRAINT `ProductImage_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `Product` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
