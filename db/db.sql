-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Mar 23, 2025 at 07:39 AM
-- Server version: 11.7.2-MariaDB-ubu2404
-- PHP Version: 8.2.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `INSERT_DB_NAME`
--

-- --------------------------------------------------------

--
-- Table structure for table `orgs`
--

DROP TABLE IF EXISTS `orgs`;
CREATE TABLE IF NOT EXISTS `orgs` (
  `id` varchar(16) NOT NULL,
  `ord` int(4) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `shortName` varchar(256) DEFAULT NULL,
  `address` varchar(256) DEFAULT NULL,
  `passwordHash` varchar(64) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ord` (`ord`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Dumping data for table `orgs`
--

INSERT INTO `orgs` (`id`, `ord`, `name`, `shortName`, `address`, `passwordHash`) VALUES
('1000', 1, 'Бар \"Утонувший огурец\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e'),
('2000', 2, 'Варьете \"Силь-ву-пле\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e'),
('3000', 3, 'Варьете \"Цыган не заказывали\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e'),
('4000', 4, 'Конюшня \"Конечно\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e'),
('5000', 5, 'Корчма \"Косой банан\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e'),
('6000', 6, 'Корчма \"Три орка\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e'),
('7000', 7, 'Парная \"Ирония судьбы\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e'),
('8000', 8, 'Парная \"Копытная\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e'),
('9000', 9, 'Парная \"Он сам пришёл\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e'),
('10000', 10, 'Пельменная \"Жир на боках\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e'),
('11000', 11, 'Пельменная \"Судный день\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e'),
('12000', 12, 'Рюмочная \"Доколе\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e'),
('13000', 13, 'Салун \"Вой на болотах\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e'),
('14000', 14, 'Салун \"Корова на льду\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e'),
('15000', 15, 'Таверна \"Здесь рыбы нет\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e'),
('16000', 16, 'Таверна \"Минное поле\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e'),
('17000', 17, 'Таверна \"Ноги и брови\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e'),
('18000', 18, 'Таверна \"Пол-литра\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e'),
('19000', 19, 'Трактир \"Бес в ребро\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e'),
('20000', 20, 'Трактир \"Старый гремлин\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e'),
('21000', 21, 'Яхт-клуб \"Треугольник печали\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
