-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: eu-cdbr-west-02.cleardb.net    Database: heroku_ea021ad9b3e8665
-- ------------------------------------------------------
-- Server version	5.6.42-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `inventaris`
--

DROP TABLE IF EXISTS `inventaris`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `inventaris` (
  `idProduct` int(11) NOT NULL AUTO_INCREMENT,
  `productnaam` varchar(255) NOT NULL,
  `laatstBesteld` datetime NOT NULL,
  `Aantal` int(11) NOT NULL DEFAULT '0',
  `prijs` decimal(10,2) NOT NULL,
  `punten` int(11) NOT NULL DEFAULT '20',
  `prijsinpunten` int(11) NOT NULL DEFAULT '500',
  PRIMARY KEY (`idProduct`)
) ENGINE=InnoDB AUTO_INCREMENT=2011 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventaris`
--

LOCK TABLES `inventaris` WRITE;
/*!40000 ALTER TABLE `inventaris` DISABLE KEYS */;
INSERT INTO `inventaris` VALUES (1,'cola','2018-12-19 15:54:04',986,1.00,20,500),(11,'water','2018-12-19 15:54:04',995,1.00,20,500),(171,'Cola Zero','2018-12-19 15:54:04',996,1.00,20,500),(181,'Ice Tea','2018-12-19 15:54:04',988,1.00,20,500),(191,'Pint','2018-12-19 15:54:04',991,1.00,20,500),(201,'Kriek','2018-12-19 15:54:04',997,2.00,40,1000),(221,'Witte wijn','2018-12-19 15:54:04',997,2.00,40,1000),(231,'Omer','2018-12-19 15:54:04',997,2.00,40,1000),(251,'Strongbow appel','2018-12-19 15:54:04',994,5.00,100,2500),(261,'Strongbow rode bessen','2018-12-19 15:54:04',990,5.00,100,2500),(271,'chips paprika','2018-12-19 15:54:04',9,1.15,23,575),(921,'Rode wijn','2018-12-19 15:54:04',991,3.00,60,1500),(931,'Chips zout','2018-12-19 15:54:04',999,1.00,20,500),(941,'Ne meter = 11 pinten','2018-12-19 15:54:04',484,10.25,205,5125),(1541,'testproduct','2018-12-19 15:54:04',100,1.00,10,1000001),(1551,'testproduct','2018-12-19 15:54:04',100,1.00,10,500),(1571,'testproduct','2018-12-19 15:54:04',100,1.00,10,500),(1941,'testproduct','2018-12-19 15:54:04',100,1.00,10,500),(1951,'testproduct','2018-12-19 15:54:04',100,1.00,10,500),(1991,'testproduct','2018-12-19 15:54:04',100,1.00,10,500);
/*!40000 ALTER TABLE `inventaris` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rollen`
--

DROP TABLE IF EXISTS `rollen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rollen` (
  `idrollen` int(11) NOT NULL,
  `rolnaam` varchar(255) NOT NULL,
  PRIMARY KEY (`idrollen`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rollen`
--

LOCK TABLES `rollen` WRITE;
/*!40000 ALTER TABLE `rollen` DISABLE KEYS */;
INSERT INTO `rollen` VALUES (1,'admin'),(2,'barman'),(3,'gebruiker');
/*!40000 ALTER TABLE `rollen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales`
--

DROP TABLE IF EXISTS `sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sales` (
  `idProduct` int(11) NOT NULL,
  `datum` date NOT NULL,
  `amount` int(11) NOT NULL,
  PRIMARY KEY (`idProduct`,`datum`),
  CONSTRAINT `fk_prod` FOREIGN KEY (`idProduct`) REFERENCES `inventaris` (`idProduct`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales`
--

LOCK TABLES `sales` WRITE;
/*!40000 ALTER TABLE `sales` DISABLE KEYS */;
INSERT INTO `sales` VALUES (1,'2018-11-15',16),(1,'2018-11-16',3),(1,'2018-11-17',114),(1,'2018-12-01',3),(1,'2018-12-06',8),(1,'2018-12-07',1),(1,'2018-12-17',4),(1,'2018-12-19',2),(11,'2018-11-15',14),(11,'2018-11-16',2),(11,'2018-11-17',9),(11,'2018-12-06',1),(11,'2018-12-17',4),(11,'2018-12-19',1),(171,'2018-11-15',1),(171,'2018-11-17',1),(171,'2018-12-06',2),(171,'2018-12-17',1),(171,'2018-12-19',2),(181,'2018-11-15',209),(181,'2018-11-17',1),(181,'2018-12-01',3),(181,'2018-12-06',4),(181,'2018-12-13',1),(181,'2018-12-17',9),(191,'2018-11-15',5),(191,'2018-11-16',10),(191,'2018-11-17',4),(191,'2018-12-06',3),(191,'2018-12-07',5),(191,'2018-12-17',4),(201,'2018-11-15',213),(201,'2018-11-16',3),(201,'2018-11-17',2),(201,'2018-12-01',3),(201,'2018-12-06',7),(201,'2018-12-19',1),(221,'2018-11-15',4),(221,'2018-11-16',2),(221,'2018-12-06',3),(221,'2018-12-07',1),(231,'2018-11-15',14),(231,'2018-11-16',2),(231,'2018-12-06',4),(231,'2018-12-07',1),(231,'2018-12-18',1),(251,'2018-11-15',3),(251,'2018-11-17',4),(251,'2018-12-06',2),(251,'2018-12-07',1),(251,'2018-12-19',4),(261,'2018-11-15',1),(261,'2018-11-16',1),(261,'2018-11-17',1),(261,'2018-12-06',16),(261,'2018-12-07',6),(271,'2018-11-15',289),(271,'2018-11-16',1),(271,'2018-12-06',9),(271,'2018-12-13',1),(271,'2018-12-17',2),(271,'2018-12-19',1093),(921,'2018-12-06',2),(921,'2018-12-13',2),(921,'2018-12-17',4),(921,'2018-12-19',1),(931,'2018-12-19',1),(941,'2018-12-06',1),(941,'2018-12-07',1),(941,'2018-12-18',1),(941,'2018-12-19',15);
/*!40000 ALTER TABLE `sales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userrollen`
--

DROP TABLE IF EXISTS `userrollen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userrollen` (
  `iduser` int(11) NOT NULL,
  `idrollen` int(11) NOT NULL,
  PRIMARY KEY (`iduser`,`idrollen`),
  KEY `fk_rollen_idx` (`idrollen`),
  CONSTRAINT `fk_rollen` FOREIGN KEY (`idrollen`) REFERENCES `rollen` (`idrollen`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_user` FOREIGN KEY (`iduser`) REFERENCES `users` (`idusers`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userrollen`
--

LOCK TABLES `userrollen` WRITE;
/*!40000 ALTER TABLE `userrollen` DISABLE KEYS */;
INSERT INTO `userrollen` VALUES (32,1),(92,1),(861,1),(2,2),(1491,2),(171,3),(661,3),(881,3),(891,3),(901,3),(911,3),(921,3),(931,3),(941,3),(951,3),(961,3),(971,3),(981,3),(991,3),(1001,3),(1011,3),(1021,3),(1031,3),(1191,3),(1331,3);
/*!40000 ALTER TABLE `userrollen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `idusers` int(11) NOT NULL AUTO_INCREMENT,
  `voornaam` varchar(255) DEFAULT NULL,
  `familienaam` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `punten` int(11) DEFAULT '0',
  `lastactive` datetime DEFAULT NULL,
  `geboortedatum` date DEFAULT NULL,
  `wachtwoord` varchar(255) DEFAULT NULL,
  `visits` int(11) DEFAULT '1',
  PRIMARY KEY (`idusers`)
) ENGINE=InnoDB AUTO_INCREMENT=2621 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'mathias','standaert','MathiasS',NULL,'2018-12-13 08:04:31','1996-06-26','$2a$10$5SkAxIKXVYPsAdf8h7sZe.Nc2h5Jx2EQq4SQcRYot54N2L08SGu8O',1),(32,'admin','admin','admin',29,'2018-12-19 20:30:29','1970-01-01','$2a$10$gTDelxNTF4bcPaCDEfX4buNp0n1Y1hLGqriqiMkyjlUIOoZASd7Ii',0),(92,'Hayk','Avetisyan','hayk',999000,'2018-12-19 17:12:14','1983-02-08','$2a$10$BaWxeh8v1qE9kkRaLkdg4.LiAIMqoyTjv4Ujsa0uec01S739J7sei',0),(171,'Seb','Lem','selem',39,'2018-12-19 11:09:23','1999-08-07','$2a$10$yfxufWDnU3yXXD6BmkwdGOB5DT8u5YBRdXgzOm8ynXLTmVcL.iDk6',0),(661,'charlotte','standaert','CharlotteS',25,'2018-11-07 14:58:53','1999-07-08','$2a$10$lrg8LtBi89JlwYTeJ2VOruRAwFYtUAArSya4x9Mj2uzG7IKWIbglW',1),(861,'Admin','Voorbeeld','AdminVoorbeeld',5,'2018-12-17 07:37:48','1990-09-13','$2a$10$hGUitzwkw4F/ZxsajW3DAu6rdIooWwk9jpT1UCr0khng7alt6urjC',1),(881,'Janne','Vandenbussche','Janne',2,'2018-12-13 18:10:59','1998-07-27','$2a$10$s4AwPeC47/K6jWLIqMX73Oist/YLKfuhvDhQZZLxjW7i18SYqIkhy',1),(891,'Manon','Viaene','Hand',4,'2018-12-08 13:02:53','2001-07-13','$2a$10$VElTTaTctILDn5UsJHZKaOjXpu34OPlKBZBMc06.QkAYUPx4c4V8O',1),(901,'Melissa','Amssoms','MelissaAmssoms',1,'2018-12-11 16:42:18','1994-03-03','$2a$10$ruM3gICQ0NGW0PNfQnDhhetGUQ8vUa7K1dQWTHofra/DOMGDJwcri',1),(911,'Robbe','Van Biervliet','RobbeVB',1,NULL,'2000-10-06','$2a$10$3Jou3WgmZ6kI/zePnqudke2465sfBtoMJjp/aOURbn/JHdFTIz2eO',1),(921,'Louise','Devos','Louise',1,'2018-12-07 21:42:05','1998-12-02','$2a$10$9/lcRFSUk3DBs2IUeTc9P.Mj9boi/Oz1IpAA.qz7MzYHnDKza7da6',1),(931,'Anders','Vanden Bogaerde','Anders',2,'2018-12-15 08:22:19','2000-10-05','$2a$10$NvYx1zbPIsokejVeLZO1v.u8IS5sYMitUbLpLwhaJ7QcEWCkHeMbe',1),(941,'Klunten','Oliebrood','D-RYAN',0,'2018-12-08 15:57:51','1995-02-21','$2a$10$LwtHI3s4hurV3vo9CLg2deRMrX0iT51bEMSB1GNiQsXjhjxDAaocG',1),(951,'Charlotte','Parmentier','Charrie',1,NULL,'1994-10-18','$2a$10$ahXK15/FQA2ud4vaCEyXr.L1Pgt4Jy5GU0jZYR1wPchkS5XimY.ui',1),(961,'Arne','Vander Massen','Hahahappy',0,'2018-12-17 12:28:59','1999-07-24','$2a$10$IPe/z15jzncucraMPyim9OKDEkgZt1mtAxRkUwYAkBJVhRTNxK4zy',1),(971,'Brecht','Callewaert','Brecht',1,'2018-12-08 14:45:46','2000-05-04','$2a$10$IJWNLfT2kK.vaLlZ7ZRL8ukCCBWVFYZcesgN8lAr27Gzs0A7TpfPW',1),(981,'Lowie','Adyns','Lowie',3,'2018-12-07 23:02:20','1998-02-19','$2a$10$vJfdMy3inxDRypTEaFtJru3U094nckXFn95z3XraAl1WNs0xkOLvK',1),(991,'Thibault','Vantieghem','Thibaulttv',0,NULL,'1998-06-13','$2a$10$JumJQdIteLa2hObSbfJ1lOzgNhub6NW0NFVplPq9B/KF2p/p9P/2O',1),(1001,'Kevin','Depreytere','D-Kevin-D',0,NULL,'1998-04-03','$2a$10$Knv2vMGfq.oVBKZyrvwj5u1iUmlankicDkEzlNVlORtQyUztSw2jC',1),(1011,'Emile','Vanooteghem','EmileV',0,NULL,'1998-04-08','$2a$10$wU1..6XgvbrQCMfXU6JUW.u/cxwsuXA/AvpBvvALEuDqwGD9dVD4u',1),(1021,'Daphne','Moeyaert','Stoeipoes2',0,NULL,'2000-06-28','$2a$10$.BFWu11N3q9NjgltJmJcHuMPO6gNrLG90hgGrexRCnAKye6XT6rx6',1),(1031,'Wannes','Vandenbussche','DJ Wainz',0,NULL,'1994-05-01','$2a$10$.77aUcmVeVp6Cfyv8Y78Y.6NjD8dxzOAkIFaKhVX4iGwvb8izipZ6',1),(1191,'koe','koe','koe',9,'2018-12-19 15:43:50','1994-10-16','$2a$10$ZEfwQN9Fp2ZL6JPFhxvvaeztri2HNTVd6uiZcsXpLw6fMeZ1UrJLC',1),(1331,'meh','meh','meh',0,'2018-12-17 15:23:47','1977-01-05','$2a$10$LZYux17TzaDj.ZvmMXD6heT8uFPCy8tEI3DKHtyd1Umi836zqjBFa',1),(1491,'hond','hond','hond',5,NULL,'1989-10-12','$2a$10$1aw/xuVT2cUIrDz8N46tZuBIoMtEEFnaZQ26j44pzijqFBRZmQSn.',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-12-20  9:18:22
