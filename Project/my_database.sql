-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:8000
-- Generation Time: Apr 29, 2025 at 06:33 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `my_database`
--

-- --------------------------------------------------------

--
-- Table structure for table `billing`
--

CREATE TABLE `billing` (
  `BillingID` int(11) NOT NULL,
  `OrderID` int(11) DEFAULT NULL,
  `BillingDate` date DEFAULT NULL,
  `CustomerName` varchar(100) DEFAULT NULL,
  `Product` varchar(100) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `Price` decimal(10,2) DEFAULT NULL,
  `Total` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inwardtransactions`
--

CREATE TABLE `inwardtransactions` (
  `InwardID` int(11) NOT NULL,
  `ProductName` varchar(100) NOT NULL,
  `HSNCode` varchar(50) DEFAULT NULL,
  `Sender` varchar(100) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `Price` decimal(10,3) DEFAULT NULL,
  `EntryDate` date DEFAULT NULL,
  `Material` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inwardtransactions`
--

INSERT INTO `inwardtransactions` (`InwardID`, `ProductName`, `HSNCode`, `Sender`, `Quantity`, `Price`, `EntryDate`, `Material`) VALUES
(1, 'qw', '12', 'qw', 12, 12.000, '2025-04-07', 'Product'),
(2, 'er', '123', 'er', 123, 1121.000, '2025-04-30', 'Product'),
(3, 'df', 'd', 'df', 65, 565.000, '2025-04-28', 'Product'),
(4, 'rter', 'jhh', 'kjhbbjh', 454, 45.000, '2025-04-07', 'Product'),
(5, '12', '12', '12', 12, 12.000, '2025-04-07', 'Product'),
(6, 'fedrg', '4657', 'jlhk', 4657, 4675.000, '2025-04-21', 'Raw'),
(7, 'Brass Bolt', 'BR123', 'ABC Industries', 520, 520.000, '2025-04-22', 'Product'),
(8, 'Brass Rods', 'BRR365', 'Shreedeep Indutries', 100, 500.000, '2025-04-09', 'Raw'),
(9, 'er', '123', 'er', 123, 1121.000, '2025-04-30', 'Product'),
(10, '123', '123', '123', 123, 123.000, '2025-04-29', 'Product');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `OrderID` int(11) NOT NULL,
  `CustomerName` varchar(100) DEFAULT NULL,
  `Product` varchar(100) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `Status` varchar(50) DEFAULT NULL,
  `OrderDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`OrderID`, `CustomerName`, `Product`, `Quantity`, `Status`, `OrderDate`) VALUES
(123, '123', '123', 123, 'Shipped', '2025-04-25'),
(174, 'Bhavik', 'Brass Rods', 174, 'Active', '2025-04-25');

-- --------------------------------------------------------

--
-- Table structure for table `outwardtransactions`
--

CREATE TABLE `outwardtransactions` (
  `OutwardID` int(11) NOT NULL,
  `ProductName` varchar(100) NOT NULL,
  `HSNCode` varchar(50) DEFAULT NULL,
  `Receiver` varchar(100) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `Cost` decimal(10,3) DEFAULT NULL,
  `EntryDate` date DEFAULT NULL,
  `Material` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `ProductID` int(11) NOT NULL,
  `ProductName` varchar(100) NOT NULL,
  `HSNCode` varchar(50) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `Price` decimal(10,3) DEFAULT NULL,
  `EntryDate` char(10) DEFAULT NULL,
  `Supplier` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`ProductID`, `ProductName`, `HSNCode`, `Quantity`, `Price`, `EntryDate`, `Supplier`) VALUES
(1, 'qw', '12', 12, 12.000, '2025-04-07', 'qw'),
(2, 'er', '123', 123, 1121.000, '2025-04-30', 'er'),
(3, 'df', 'd', 65, 565.000, '2025-04-28', 'df'),
(4, 'rter', 'jhh', 454, 45.000, '2025-04-07', 'kjhbbjh'),
(5, '12', '12', 12, 12.000, '2025-04-07', '12'),
(6, 'Brass Bolt', 'BR123', 520, 520.000, '2025-04-22', 'ABC Industries'),
(7, 'er', '123', 123, 1121.000, '2025-04-30', 'er'),
(8, '123', '123', 123, 123.000, '2025-04-29', '123');

-- --------------------------------------------------------

--
-- Table structure for table `rawmaterials`
--

CREATE TABLE `rawmaterials` (
  `RawMaterialID` int(11) NOT NULL,
  `MaterialName` varchar(100) NOT NULL,
  `Supplier` varchar(100) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `Cost` decimal(10,3) DEFAULT NULL,
  `EntryDate` date DEFAULT NULL,
  `HSNCode` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rawmaterials`
--

INSERT INTO `rawmaterials` (`RawMaterialID`, `MaterialName`, `Supplier`, `Quantity`, `Cost`, `EntryDate`, `HSNCode`) VALUES
(1, 'fgd', 'ffs', 34545, 445.000, '2025-05-07', '43345'),
(2, 'ffgs', 'fdgs', 65, 55.000, '2025-04-02', 'erw'),
(3, 'fedrg', 'jlhk', 4657, 4675.000, '2025-04-21', '4657'),
(4, 'Brass Rods', 'Shreedeep Indutries', 100, 500.000, '2025-04-09', 'BRR365');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `created_at`) VALUES
(1, 'Bhavik', 'bc@gmail.com', '$2y$10$fOowxqvUzcYZMX7v6VI2E.rIUCtuoSSgPk/gAATSI8YB7n4HxPxbi', '2025-04-06 14:25:13'),
(2, 'Bhavik', 'bv@gmail.com', '$2y$10$ltoEqK9o4e.XWdBlrHP3HuQO6E52C0dJ0VLVOR9V9bLQUwFAsd9l.', '2025-04-06 14:25:35'),
(3, 'fdsa', 'dfds@gmail.com', '$2y$10$lYuVz49O5V/pCakRhqhDNOIFuk5z/CJbZpqW9.wJVDbNVi.F2ptjS', '2025-04-06 14:26:24'),
(4, 'adsf', 'dsaEA@GMAIL.COM', '$2y$10$/e6P1Q.Mgut5wGADUppa0O5h511gk8w61qiGBKv/QPOQh/dbBNphi', '2025-04-06 14:27:16'),
(5, 'HETANSH', 'DS@GMAIL.XCOIM', '$2y$10$Tf2fXtXQJujiw1JTU0djo.LmSWgA6qINikOOd7hYVdDuWytAxIwl.', '2025-04-06 14:31:52'),
(6, 'a', 'a@gmail.com', '$2y$10$uRMu0PMAlL822LO5F5HS/eWhZREqURS0sKe9Y/dPHzz.xHlZt4WnC', '2025-04-06 14:50:20'),
(7, 'ig', 'ig@gmail.com', '$2y$10$Bwu8eqIoYQadtR0csueLlOLtKXxDTjEdhsClLqUrq1nsRfa8.71Oq', '2025-04-06 14:59:24'),
(8, 'jig', 'jig@gmail.com', '$2y$10$NMfO.xIPbhpsrhiQYmA6SOqA/T6eWpCb26wzibqM.RG1mFLTPgg3y', '2025-04-07 08:17:34'),
(9, '1', '1@gmail.com', '$2y$10$5Y2ulvXwKW46xwjYIdAdl.PatUzaQGNd9jKQ1FSuAdJtKSsXYQ3bG', '2025-04-25 05:52:33');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `billing`
--
ALTER TABLE `billing`
  ADD PRIMARY KEY (`BillingID`),
  ADD KEY `OrderID` (`OrderID`);

--
-- Indexes for table `inwardtransactions`
--
ALTER TABLE `inwardtransactions`
  ADD PRIMARY KEY (`InwardID`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`OrderID`);

--
-- Indexes for table `outwardtransactions`
--
ALTER TABLE `outwardtransactions`
  ADD PRIMARY KEY (`OutwardID`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`ProductID`);

--
-- Indexes for table `rawmaterials`
--
ALTER TABLE `rawmaterials`
  ADD PRIMARY KEY (`RawMaterialID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `billing`
--
ALTER TABLE `billing`
  MODIFY `BillingID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inwardtransactions`
--
ALTER TABLE `inwardtransactions`
  MODIFY `InwardID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `OrderID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=175;

--
-- AUTO_INCREMENT for table `outwardtransactions`
--
ALTER TABLE `outwardtransactions`
  MODIFY `OutwardID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `ProductID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `rawmaterials`
--
ALTER TABLE `rawmaterials`
  MODIFY `RawMaterialID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `billing`
--
ALTER TABLE `billing`
  ADD CONSTRAINT `billing_ibfk_1` FOREIGN KEY (`OrderID`) REFERENCES `orders` (`OrderID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
