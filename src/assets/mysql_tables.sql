DROP TABLE IF EXISTS StationWiFi;
CREATE TABLE
StationWiFi(
   ID int not null,
   Description nvarchar(255),
   Val nvarchar(255),
   PRIMARY KEY (`ID`)
);
insert into StationWiFi(ID, Description, Val) values(1, "enable_wifi", "0");
insert into StationWiFi(ID, Description, Val) values(2, "network_name", "MyWiFi");
insert into StationWiFi(ID, Description, Val) values(3, "network_password", "leet");
insert into StationWiFi(ID, Description, Val) values(4, "enable_bridge", "1");
insert into StationWiFi(ID, Description, Val) values(5, "network_ap_gateway", "192.168.12.1");
