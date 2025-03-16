-- -------------------------------------------------------------
-- TablePlus 5.6.0(514)
--
-- https://tableplus.com/
--
-- Database: restaurant_db
-- Generation Time: 2025-03-16 21:27:10.6890
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


CREATE TABLE `menu` (
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` varchar(255) NOT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `deletedAt` timestamp(6) NULL DEFAULT NULL,
  `id` varchar(36) NOT NULL,
  `category` enum('일식','중식','양식') NOT NULL,
  `restaurantId` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_menu_price` (`price`),
  KEY `idx_menu_name` (`name`),
  KEY `idx_menu_category` (`category`),
  KEY `idx_menu_restaurant_id` (`restaurantId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;;

CREATE TABLE `reservation` (
  `customerId` varchar(255) NOT NULL,
  `restaurantId` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `phone` varchar(255) NOT NULL,
  `peopleCount` int NOT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `deletedAt` timestamp(6) NULL DEFAULT NULL,
  `id` varchar(36) NOT NULL,
  `startTime` time NOT NULL,
  `endTime` time NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_reservation_customer` (`customerId`),
  KEY `idx_reservation_start_time` (`startTime`),
  KEY `idx_reservation_end_time` (`endTime`),
  KEY `idx_reservation_people` (`peopleCount`),
  KEY `idx_reservation_phone` (`phone`),
  KEY `idx_reservation_restaurant_date` (`restaurantId`,`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;;

CREATE TABLE `reservation_menus_menu` (
  `reservationId` varchar(36) NOT NULL,
  `menuId` varchar(36) NOT NULL,
  PRIMARY KEY (`reservationId`,`menuId`),
  KEY `IDX_8a937c2673a60db25a3dd17dc6` (`reservationId`),
  KEY `IDX_3450614b0b68d0109f44cd5d0e` (`menuId`),
  CONSTRAINT `FK_3450614b0b68d0109f44cd5d0e3` FOREIGN KEY (`menuId`) REFERENCES `menu` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_8a937c2673a60db25a3dd17dc69` FOREIGN KEY (`reservationId`) REFERENCES `reservation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;;

INSERT INTO `menu` (`name`, `price`, `description`, `createdAt`, `deletedAt`, `id`, `category`, `restaurantId`) VALUES
('스튜', 18000.00, '크림', '2025-03-16 16:44:02.446792', NULL, '38684e6a-96b3-4276-8951-928ebd925ac3', '양식', 'restaurant2'),
('음료수', 7000.00, '아사히', '2025-03-16 16:41:51.525686', NULL, '3b77f45d-da66-4867-932b-fbbad8492ed2', '일식', 'restaurant1'),
('음료수', 7000.00, '삿포루', '2025-03-16 16:41:56.542402', NULL, '5d71d25a-9170-460d-9042-310a69c57f3b', '일식', 'restaurant1'),
('음료수', 2000.00, '콜라', '2025-03-16 16:41:39.680612', NULL, '7b64b04d-e670-4362-8000-80823c03c7e2', '일식', 'restaurant1'),
('라멘', 9000.00, '돈사골 라멘', '2025-03-16 16:40:58.719208', NULL, '7dc02b95-4c30-4791-8344-609f3c3baf32', '일식', 'restaurant1'),
('티본 스테이크', 28000.00, '호주산', '2025-03-16 16:43:34.582757', NULL, '8aa76ee0-3327-4c27-b368-be603719e3ae', '양식', 'restaurant2'),
('로제 스튜', 19500.00, '로제', '2025-03-16 17:57:43.035408', NULL, '90032cc0-9f93-4505-9b14-8ee5150eae75', '양식', 'restaurant2'),
('스테이크', 22000.00, '호주산', '2025-03-16 16:43:23.748632', NULL, '95fc6ef9-9084-4588-a11b-c180f4885be4', '양식', 'restaurant2'),
('오물렛', 12000.00, '계란이 톡 터지는 오물렛', '2025-03-16 16:40:31.183068', NULL, 'c20f9553-449d-4f2b-825c-f110d9e9d5c9', '일식', 'restaurant1'),
('교자만두', 5000.00, '육즙팡', '2025-03-16 16:41:16.004103', NULL, 'c214e9c7-d407-4647-b867-d8b5d720d8ea', '일식', 'restaurant1'),
('토마토 파스타', 11000.00, '건면 파스타', '2025-03-16 16:43:08.714022', NULL, 'ddf8fb64-9fd0-49d6-80f6-301683bcf053', '양식', 'restaurant2'),
('음료수', 2000.00, '환타', '2025-03-16 16:41:42.624230', NULL, 'e113fbaa-ac83-4d6a-a266-662a36d2b155', '일식', 'restaurant1'),
('로제 스튜', 19500.00, '로제', '2025-03-16 16:44:09.566194', NULL, 'f0636ebc-d993-4080-b274-3ff7e52b8a0f', '양식', 'restaurant2');

INSERT INTO `reservation` (`customerId`, `restaurantId`, `date`, `phone`, `peopleCount`, `createdAt`, `deletedAt`, `id`, `startTime`, `endTime`) VALUES
('customer1', 'restaurant2', '2025-04-01', '010-2222-5678', 2, '2025-03-16 18:00:54.939082', NULL, '07665f4e-a0ec-4595-8124-ff3f0f5624ac', '20:30:00', '22:00:00'),
('customer1', 'restaurant2', '2025-04-01', '010-1234-5678', 2, '2025-03-16 17:58:58.584094', NULL, '3e674c33-f396-4dab-afdc-0726452e7e1a', '18:30:00', '20:00:00'),
('customer2', 'restaurant2', '2025-04-03', '010-5555-5678', 5, '2025-03-16 18:03:29.753380', '2025-03-16 21:23:32.000000', 'f823b8b1-042b-4e8c-9d96-5d9ca2ac91d9', '20:30:00', '22:00:00');

INSERT INTO `reservation_menus_menu` (`reservationId`, `menuId`) VALUES
('07665f4e-a0ec-4595-8124-ff3f0f5624ac', '8aa76ee0-3327-4c27-b368-be603719e3ae'),
('07665f4e-a0ec-4595-8124-ff3f0f5624ac', 'ddf8fb64-9fd0-49d6-80f6-301683bcf053'),
('3e674c33-f396-4dab-afdc-0726452e7e1a', '38684e6a-96b3-4276-8951-928ebd925ac3'),
('3e674c33-f396-4dab-afdc-0726452e7e1a', '90032cc0-9f93-4505-9b14-8ee5150eae75'),
('f823b8b1-042b-4e8c-9d96-5d9ca2ac91d9', '95fc6ef9-9084-4588-a11b-c180f4885be4'),
('f823b8b1-042b-4e8c-9d96-5d9ca2ac91d9', 'f0636ebc-d993-4080-b274-3ff7e52b8a0f');



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;