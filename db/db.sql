-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Mar 24, 2025 at 12:19 PM
-- Server version: 11.7.2-MariaDB-ubu2404
-- PHP Version: 8.2.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `INSERT_DB_NAME`
--
DROP DATABASE IF EXISTS `INSERT_DB_NAME`;
CREATE DATABASE IF NOT EXISTS `INSERT_DB_NAME` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci;
USE `INSERT_DB_NAME`;

-- --------------------------------------------------------

--
-- Table structure for table `orgs`
--

CREATE TABLE IF NOT EXISTS `orgs` (
  `id` varchar(16) NOT NULL,
  `ord` int(4) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `shortName` varchar(256) DEFAULT NULL,
  `address` varchar(256) DEFAULT NULL,
  `passwordHash` varchar(64) NOT NULL,
  `parent` varchar(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ord` (`ord`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Dumping data for table `orgs`
--

INSERT INTO `orgs` (`id`, `ord`, `name`, `shortName`, `address`, `passwordHash`, `parent`) VALUES
('1000', 1, 'Бар \"Утонувший огурец\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', NULL),
('10000', 10, 'Пельменная \"Жир на боках\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', NULL),
('11000', 11, 'Пельменная \"Судный день\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', NULL),
('12000', 12, 'Рюмочная \"Доколе\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', NULL),
('13000', 13, 'Салун \"Вой на болотах\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', NULL),
('14000', 14, 'Салун \"Корова на льду\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', NULL),
('15000', 15, 'Таверна \"Здесь рыбы нет\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', NULL),
('16000', 16, 'Таверна \"Минное поле\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', NULL),
('17000', 17, 'Таверна \"Ноги и брови\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', NULL),
('18000', 18, 'Таверна \"Пол-литра\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', NULL),
('19000', 19, 'Трактир \"Бес в ребро\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', NULL),
('2000', 2, 'Варьете \"Силь-ву-пле\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', NULL),
('20000', 20, 'Трактир \"Старый гремлин\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', NULL),
('21000', 21, 'Яхт-клуб \"Треугольник печали\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', NULL),
('22000', 22, 'Бар \"Девять из десяти\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', '18000'),
('3000', 3, 'Варьете \"Цыган не заказывали\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', NULL),
('4000', 4, 'Конюшня \"Конечно\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', NULL),
('5000', 5, 'Корчма \"Косой банан\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', NULL),
('6000', 6, 'Корчма \"Три орка\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', NULL),
('7000', 7, 'Парная \"Ирония судьбы\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', NULL),
('8000', 8, 'Парная \"Копытная\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', NULL),
('9000', 9, 'Парная \"Он сам пришёл\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', NULL);
COMMIT;
