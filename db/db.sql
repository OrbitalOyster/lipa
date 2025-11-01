-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Nov 01, 2025 at 01:17 PM
-- Server version: 12.0.2-MariaDB-ubu2404
-- PHP Version: 8.3.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `INSERT_DB_NAME`
--
CREATE DATABASE IF NOT EXISTS `INSERT_DB_NAME` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci;
USE `INSERT_DB_NAME`;

-- --------------------------------------------------------

--
-- Table structure for table `orgs`
--

DROP TABLE IF EXISTS `orgs`;
CREATE TABLE IF NOT EXISTS `orgs` (
  `id` varchar(64) NOT NULL,
  `ord` int(4) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `shortName` varchar(256) DEFAULT NULL,
  `address` varchar(256) DEFAULT NULL,
  `passwordHash` varchar(64) NOT NULL,
  `parent` varchar(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ord` (`ord`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Dumping data for table `orgs`
--

INSERT INTO `orgs` (`id`, `ord`, `name`, `shortName`, `address`, `passwordHash`, `parent`) VALUES
('1000', 1, 'Бар \"Утонувший огурец\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', NULL),
('10000', 10, 'Пельменная \"Жир на боках\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', '13000'),
('11000', 11, 'Пельменная \"Судный день\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', '18000'),
('12000', 12, 'Рюмочная \"Доколе\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', '15000'),
('13000', 13, 'Салун \"Вой на болотах\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', NULL),
('14000', 14, 'Салун \"Корова на льду\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', NULL),
('15000', 15, 'Таверна \"Здесь рыбы нет\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', NULL),
('16000', 16, 'Таверна \"Минное поле\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', NULL),
('17000', 17, 'Таверна \"Ноги и брови\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', NULL),
('18000', 18, 'Таверна \"Пол-литра\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', '6000'),
('19000', 19, 'Трактир \"Бес в ребро\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', NULL),
('2000', 2, 'Варьете \"Силь-ву-пле\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', '1000'),
('20000', 22, 'Трактир \"Старый гремлин\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', NULL),
('21000', 21, 'Яхт-клуб \"Треугольник печали\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', NULL),
('22000', 20, 'Бар \"Девять из десяти\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', '18000'),
('3000', 3, 'Варьете \"Цыган не заказывали\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', '15000'),
('4000', 4, 'Конюшня \"Конечно\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', NULL),
('5000', 5, 'Корчма \"Косой банан\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', NULL),
('6000', 6, 'Корчма \"Три орка\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', NULL),
('7000', 7, 'Парная \"Ирония судьбы\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', '6000'),
('8000', 8, 'Парная \"Копытная\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', NULL),
('9000', 9, 'Парная \"Он сам пришёл\"', NULL, NULL, '3df10ee4be4338179e7ee74aca0b0619d174ffe22eb56cd8bd9ed92592cf8a5e', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `name` varchar(64) NOT NULL,
  `passwordHash` varchar(64) NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`name`, `passwordHash`) VALUES
('admin', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8');

-- --------------------------------------------------------

--
-- Table structure for table `xlsx`
--

DROP TABLE IF EXISTS `xlsx`;
CREATE TABLE IF NOT EXISTS `xlsx` (
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  `userId` varchar(64) NOT NULL,
  `filename` varchar(256) NOT NULL,
  `hash` varchar(64) NOT NULL,
  `serialized` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '{}' CHECK (json_valid(`serialized`)),
  PRIMARY KEY (`filename`),
  UNIQUE KEY `hash` (`hash`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Dumping data for table `xlsx`
--

INSERT INTO `xlsx` (`date`, `userId`, `filename`, `hash`, `serialized`) VALUES
('2025-10-31 09:52:02', '5000', 'foo.xlsx', '8277744ca01b9b5ec14fee423919796c98723686f16643e644d319ca33ecb721', '[{\"name\":\"I\",\"rows\":[[],[{\"address\":\"A2\",\"type\":0,\"value\":null},{\"address\":\"B2\",\"type\":3,\"value\":\"Отчёт смешной\"},{\"address\":\"C2\",\"type\":1,\"value\":\"Отчёт смешной\"},{\"address\":\"D2\",\"type\":1,\"value\":\"Отчёт смешной\"},{\"address\":\"E2\",\"type\":3,\"value\":\"(1000)\"}],[{\"address\":\"A3\",\"type\":0,\"value\":null},{\"address\":\"B3\",\"type\":3,\"value\":\"Товар\"},{\"address\":\"C3\",\"type\":3,\"value\":\"№ строки\"},{\"address\":\"D3\",\"type\":3,\"value\":\"Куплено\"},{\"address\":\"E3\",\"type\":3,\"value\":\"Продано\"}],[{\"address\":\"A4\",\"type\":0,\"value\":null},{\"address\":\"B4\",\"type\":2,\"value\":1},{\"address\":\"C4\",\"type\":2,\"value\":2},{\"address\":\"D4\",\"type\":2,\"value\":3},{\"address\":\"E4\",\"type\":2,\"value\":4}],[{\"address\":\"A5\",\"type\":0,\"value\":null},{\"address\":\"B5\",\"type\":3,\"value\":\"Пельмени\"},{\"address\":\"C5\",\"type\":2,\"value\":1},{\"address\":\"D5\",\"type\":0,\"value\":null},{\"address\":\"E5\",\"type\":0,\"value\":null}],[{\"address\":\"A6\",\"type\":0,\"value\":null},{\"address\":\"B6\",\"type\":3,\"value\":\"Рулька\"},{\"address\":\"C6\",\"type\":2,\"value\":2},{\"address\":\"D6\",\"type\":0,\"value\":null},{\"address\":\"E6\",\"type\":0,\"value\":null}],[{\"address\":\"A7\",\"type\":0,\"value\":null},{\"address\":\"B7\",\"type\":3,\"value\":\"Сырные изделия\"},{\"address\":\"C7\",\"type\":2,\"value\":3},{\"address\":\"D7\",\"type\":0,\"value\":null},{\"address\":\"E7\",\"type\":0,\"value\":null}],[{\"address\":\"A8\",\"type\":0,\"value\":null},{\"address\":\"B8\",\"type\":3,\"value\":\"из них сырников\"},{\"address\":\"C8\",\"type\":2,\"value\":3.1},{\"address\":\"D8\",\"type\":0,\"value\":null},{\"address\":\"E8\",\"type\":0,\"value\":null}],[{\"address\":\"A9\",\"type\":0,\"value\":null},{\"address\":\"B9\",\"type\":3,\"value\":\"из них пирожных\"},{\"address\":\"C9\",\"type\":2,\"value\":3.2},{\"address\":\"D9\",\"type\":0,\"value\":null},{\"address\":\"E9\",\"type\":0,\"value\":null}],[{\"address\":\"A10\",\"type\":0,\"value\":null},{\"address\":\"B10\",\"type\":3,\"value\":\"Кабачки\"},{\"address\":\"C10\",\"type\":2,\"value\":4},{\"address\":\"D10\",\"type\":0,\"value\":null},{\"address\":\"E10\",\"type\":3,\"value\":\"X\"}],[{\"address\":\"A11\",\"type\":0,\"value\":null},{\"address\":\"B11\",\"type\":0,\"value\":null},{\"address\":\"C11\",\"type\":0,\"value\":null},{\"address\":\"D11\",\"type\":0,\"value\":null},{\"address\":\"E11\",\"type\":0,\"value\":null}],[{\"address\":\"A12\",\"type\":0,\"value\":null},{\"address\":\"B12\",\"type\":0,\"value\":null},{\"address\":\"C12\",\"type\":0,\"value\":null},{\"address\":\"D12\",\"type\":3,\"value\":\"Подпись:\"},{\"address\":\"E12\",\"type\":0,\"value\":null}]],\"tables\":[{\"name\":\"(1000)\",\"width\":4,\"height\":8,\"range\":\"B3:E10\"}],\"merges\":[\"B2:D2\"],\"rowHeights\":[12.8,12.8,12.8,12.8,12.8,12.8,12.8,12.8,12.8,12.8,12.8,12.8],\"colWidths\":[11.53515625,25.04,13.37,11.53515625,11.53515625]},{\"name\":\"II\",\"rows\":[[],[],[],[],[{\"address\":\"A5\",\"type\":0,\"value\":null},{\"address\":\"B5\",\"type\":0,\"value\":null},{\"address\":\"C5\",\"type\":3,\"value\":\"Пустой лист\"},{\"address\":\"D5\",\"type\":1,\"value\":\"Пустой лист\"},{\"address\":\"E5\",\"type\":1,\"value\":\"Пустой лист\"},{\"address\":\"F5\",\"type\":1,\"value\":\"Пустой лист\"}],[],[{\"address\":\"A7\",\"type\":0,\"value\":null},{\"address\":\"B7\",\"type\":0,\"value\":null},{\"address\":\"C7\",\"type\":0,\"value\":null},{\"address\":\"D7\",\"type\":3,\"value\":\"Тут ничего нет\"},{\"address\":\"E7\",\"type\":1,\"value\":\"Тут ничего нет\"}]],\"tables\":[],\"merges\":[\"C5:F5\",\"D7:E7\"],\"rowHeights\":[12.8,12.8,12.8,12.8,12.8,12.8,12.8],\"colWidths\":[11.53515625,11.53515625,11.53515625,11.53515625,11.53515625,11.53515625]},{\"name\":\"III\",\"rows\":[[{\"address\":\"A1\",\"type\":0,\"value\":null},{\"address\":\"B1\",\"type\":0,\"value\":null},{\"address\":\"C1\",\"type\":3,\"value\":\"(3001)\"}],[{\"address\":\"A2\",\"type\":3,\"value\":\"Показатель\"},{\"address\":\"B2\",\"type\":3,\"value\":\"#\"},{\"address\":\"C2\",\"type\":3,\"value\":\"Значение\"}],[{\"address\":\"A3\",\"type\":2,\"value\":1},{\"address\":\"B3\",\"type\":2,\"value\":2},{\"address\":\"C3\",\"type\":2,\"value\":3}],[{\"address\":\"A4\",\"type\":3,\"value\":\"Одинокая циферка\"},{\"address\":\"B4\",\"type\":2,\"value\":1},{\"address\":\"C4\",\"type\":0,\"value\":null}]],\"tables\":[{\"name\":\"(3001)\",\"width\":3,\"height\":3,\"range\":\"A2:C4\"}],\"merges\":[],\"rowHeights\":[12.8,12.8,12.8,12.8],\"colWidths\":[26.57,10.01,11.53515625]}]');
COMMIT;
