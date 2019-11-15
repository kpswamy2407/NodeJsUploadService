CREATE TABLE `dms_process_xml_status` (
  `id` BIGINT unsigned NOT NULL AUTO_INCREMENT,
  `context` LONGTEXT NOT NULL,
  `service_name` varchar(255) NOT NULL,
  `status` tinyint(2) DEFAULT '0',
  `start_time` datetime NOT NULL ,
  `end_time` datetime NOT NULL ,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1 ;