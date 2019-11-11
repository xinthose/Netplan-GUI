DROP TABLE IF EXISTS StationWiFi;
CREATE TABLE
StationWiFi(
   ID int not null,
   Description nvarchar(255),
   Val nvarchar(255),
   PRIMARY KEY (`ID`)
);
insert into StationWiFi(ID, Description, Val) values(1, "enable_wifi", "0");
insert into StationWiFi(ID, Description, Val) values(2, "network_name", "Ubuntu_WiFi_1");
insert into StationWiFi(ID, Description, Val) values(3, "network_password", "ubuntu");
insert into StationWiFi(ID, Description, Val) values(4, "broadcast_type", "1"); /* (1: bridge, 2: access point) */
insert into StationWiFi(ID, Description, Val) values(5, "network_ap_gateway", "192.168.12.1");
