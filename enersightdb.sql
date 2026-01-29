-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 29, 2026 at 03:36 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `enersightdb`
--
CREATE DATABASE IF NOT EXISTS `enersightdb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `enersightdb`;

-- --------------------------------------------------------

--
-- Table structure for table `savedpoints`
--

CREATE TABLE `savedpoints` (
  `ID` int(10) UNSIGNED NOT NULL,
  `Longitude` decimal(8,5) NOT NULL,
  `Latitude` decimal(8,5) NOT NULL,
  `StartDate` date NOT NULL,
  `EndDate` date NOT NULL,
  `PredictedEnergy` decimal(10,3) UNSIGNED NOT NULL,
  `PredictedElectricity` decimal(10,3) UNSIGNED NOT NULL,
  `WindVelocity` decimal(5,2) UNSIGNED DEFAULT NULL,
  `UV_nm` decimal(6,2) DEFAULT NULL,
  `IsBuildable` tinyint(1) NOT NULL DEFAULT 0,
  `TimePeriod` enum('1 month','3 months','6 months','year') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `savedpoints`
--

INSERT INTO `savedpoints` (`ID`, `Longitude`, `Latitude`, `StartDate`, `EndDate`, `PredictedEnergy`, `PredictedElectricity`, `WindVelocity`, `UV_nm`, `IsBuildable`, `TimePeriod`) VALUES
(6, 33.22220, 35.55500, '2026-01-02', '2026-01-29', 0.000, 0.000, 0.00, 0.00, 1, 'year'),
(7, 12.00000, 231.00000, '2026-01-01', '2026-01-16', 0.000, 0.000, 0.00, 0.00, 1, 'year'),
(8, 123.00000, 22.00000, '2026-01-01', '2026-01-16', 0.000, 0.000, 0.00, 0.00, 1, 'year'),
(9, 44.00000, 44.00000, '2026-01-01', '2026-01-23', 0.000, 0.000, 0.00, 0.00, 1, 'year'),
(10, 1.00000, 1.00000, '2026-01-16', '2026-01-23', 0.000, 0.000, 0.00, 0.00, 1, 'year'),
(11, 3.00000, 3.00000, '2026-01-01', '2026-01-30', 0.000, 0.000, 0.00, 0.00, 1, 'year');

-- --------------------------------------------------------

--
-- Table structure for table `solarpanels`
--

CREATE TABLE `solarpanels` (
  `ID` int(10) UNSIGNED NOT NULL,
  `Status` tinyint(1) NOT NULL DEFAULT 0,
  `Power` decimal(10,3) UNSIGNED NOT NULL,
  `KWH` decimal(10,3) UNSIGNED NOT NULL,
  `Length` decimal(5,2) UNSIGNED NOT NULL,
  `Width` decimal(5,2) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `solarpanels`
--

INSERT INTO `solarpanels` (`ID`, `Status`, `Power`, `KWH`, `Length`, `Width`) VALUES
(1, 0, 12.000, 12.000, 12.00, 12.00),
(2, 0, 333.000, 333.000, 333.00, 333.00),
(3, 0, 1.000, 1.000, 1.00, 1.00),
(4, 0, 12.000, 12.000, 12.00, 12.00),
(5, 0, 23.000, 23.000, 34.00, 34.00);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UserName` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `Password` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `Email` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `IsManager` tinyint(1) NOT NULL,
  `Status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserName`, `Password`, `Email`, `IsManager`, `Status`) VALUES
('Bar', '$2b$10$Iy/DmJ5f56ARBcAMJE7GV.2RTmHku6aK1ruINnOPsTKCwf0TOjlTK', 'barsho26@gmail.com', 0, 1),
('Koala', '$2b$10$1nWS5YoAk3YhqX6WhPgRlO0rD2DA31FWqMb7MMpodACiSGbeSdnPi', 'koala@zoo.com', 0, 1),
('natali', '$2b$10$UOSbInxJDWWlosUeUMA6vum0FxZUHkBrGuiHZLfo/mHeAUZbo6Xjm', 'n@gmail.com', 0, 1),
('Roy', '$2b$10$ZQ.mBRynYsV8PWVLsgj1TOl1EiX5G4U93UeAokxbmUvdofr28Ycqm', 'Roy@walla.com', 0, 1),
('Vika', '$2b$10$HS9lOoMzGdIGtYHvjKS7W.08frYFPjLbubMdXzicbG5BsVwRz4JL.', 'vika@gmail.com', 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `windturbines`
--

CREATE TABLE `windturbines` (
  `ID` int(10) UNSIGNED NOT NULL,
  `Status` tinyint(1) NOT NULL DEFAULT 0,
  `Power` decimal(10,3) UNSIGNED NOT NULL,
  `KWH` decimal(10,3) UNSIGNED NOT NULL,
  `Height` decimal(5,2) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `windturbines`
--

INSERT INTO `windturbines` (`ID`, `Status`, `Power`, `KWH`, `Height`) VALUES
(2, 0, 444.000, 444.000, 444.00),
(4, 0, 32.000, 32.000, 12.00),
(5, 0, 45.000, 45.000, 45.00);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `savedpoints`
--
ALTER TABLE `savedpoints`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `solarpanels`
--
ALTER TABLE `solarpanels`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserName`);

--
-- Indexes for table `windturbines`
--
ALTER TABLE `windturbines`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `savedpoints`
--
ALTER TABLE `savedpoints`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `solarpanels`
--
ALTER TABLE `solarpanels`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `windturbines`
--
ALTER TABLE `windturbines`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
