#!/usr/bin/python

import web
import log
import os
import threading
import time
import simplejson as json
import yaml
import io
from benedict import benedict
import mysql.connector

# Configuration

# region

VERSION = "1.0.0"
DATABASE = "NetplanConfig"
DATABASE_USER = "user1"
DATABASE_PASSWORD = "superleet"
NETPLAN = "/etc/netplan/01-network-manager-all.yaml"

logger = log.setup_custom_logger('root')

urls = (
    '/get_interfaces1', 'get_interfaces1',
    '/change_interfaces1/(.*)', 'change_interfaces1',

    '/submitBridge/(.*)', 'submitBridge',
    '/submitEth1/(.*)', 'submitEth1',
    '/submitEth2/(.*)', 'submitEth2',
    '/submitWiFi/(.*)', 'submitWiFi',
    '/get_station_wifi', 'get_station_wifi',
    '/update_station_wifi/(.*)', 'update_station_wifi',

    '/clear_all_log_files', 'clear_all_log_files',
    '/change_log_file_perm', 'change_log_file_perm',
    '/reboot_station', 'reboot_station',
    '/shutdown_station', 'shutdown_station',
    '/flush_mysql_hosts', 'flush_mysql_hosts',
)

application = web.application(urls, globals())

# endregion

# API

# region


class get_interfaces1:
    def GET(self):
        try:
            web.header('Content-Type', 'application/json')
            web.header('Access-Control-Allow-Origin', '*')
            web.header('Access-Control-Allow-Credentials', 'true')

            debug = True
            response_obj = {}
            netplan_config_file = "/etc/netplan/01-network-manager-all.yaml"

            # get network data
            with open(netplan_config_file, "r") as stream:
                try:
                    netplan_config = yaml.safe_load(stream)
                    if (debug):
                        logger.debug("netplan_config = " +
                                     json.dumps(netplan_config))
                    stream.close()
                except yaml.YAMLError as exc:
                    logger.error(str(exc))
                    return web.internalerror('{ "message": "' + str(exc) + '" }')
            network = netplan_config.get("network")
            if (debug):
                logger.debug("network = " + json.dumps(network))

            # Bridge 0
            br0_addresses = ""
            br0_gateway = ""
            br0_nameservers = ""

            bridges = network.get("bridges", "")
            if bridges:
                if (debug):
                    logger.debug("bridges = " + json.dumps(bridges))
                br0 = bridges.get("br0", "")
                if br0:
                    br0_addresses = br0.get("addresses", "")
                    br0_gateway = br0.get("gateway4", "")
                    br0_nameservers = br0.get(
                        "nameservers", "").get("addresses", "")

            # Ethernet Port 1 (LAN1)
            eth1_addresses = ""
            eth1_gateway = ""
            eth1_nameservers = ""
            eth2_addresses = ""
            eth2_gateway = ""
            eth2_nameservers = ""

            ethernets = network.get("ethernets", "")
            if ethernets:
                if (debug):
                    logger.debug("ethernets = " + json.dumps(ethernets))
                eth1 = ethernets.get("enp3s0", "")  # LAN1
                if eth1:
                    eth1_addresses = eth1.get("addresses", "")
                    eth1_gateway = eth1.get("gateway4", "")
                    nameservers = eth1.get("nameservers", "")
                    if nameservers:
                        eth1_nameservers = nameservers.get("addresses", "")
                eth2 = ethernets.get("enp4s0", "")  # LAN2
                if eth2:
                    eth2_addresses = eth2.get("addresses", "")
                    eth2_gateway = eth2.get("gateway4", "")
                    nameservers = eth2.get("nameservers", "")
                    if nameservers:
                        eth2_nameservers = nameservers.get("addresses", "")

            # Wi-Fi
            wifi_addresses = ""
            wifi_gateway = ""
            wifi_nameservers = ""
            wifi_ssid = ""
            wifi_ssid_password = ""

            wifis = network.get("wifis", "")
            if wifis:
                if (debug):
                    logger.debug("wifis = " + json.dumps(wifis))
                wifi = wifis.get("wlp1s0", "")
                if wifi:
                    wifi_addresses = wifi.get("addresses", "")
                    wifi_gateway = wifi.get("gateway4", "")
                    wifi_nameservers = wifi.get(
                        "nameservers", "").get("addresses", "")
                    wifi_access_points = wifi.get("access-points", "")
                    for key in wifi_access_points.keys():
                        wifi_ssid = key
                    wifi_ssid_password = wifi_access_points[wifi_ssid].get(
                        "password", "")

            # add to response
            response_obj["br0_addresses"] = br0_addresses
            response_obj["br0_gateway"] = br0_gateway
            response_obj["br0_nameservers"] = br0_nameservers

            response_obj["eth1_addresses"] = eth1_addresses
            response_obj["eth1_gateway"] = eth1_gateway
            response_obj["eth1_nameservers"] = eth1_nameservers

            response_obj["eth2_addresses"] = eth2_addresses
            response_obj["eth2_gateway"] = eth2_gateway
            response_obj["eth2_nameservers"] = eth2_nameservers

            response_obj["wifi_addresses"] = wifi_addresses
            response_obj["wifi_gateway"] = wifi_gateway
            response_obj["wifi_nameservers"] = wifi_nameservers
            response_obj["wifi_ssid"] = wifi_ssid
            response_obj["wifi_ssid_password"] = wifi_ssid_password

            # return data
            # converts json object to string
            ret_str = json.dumps(response_obj)
            if (debug):
                logger.info("ret_str = " + ret_str)
            return ret_str
        except Exception as e:
            logger.error(str(e))
            return web.internalerror('{ "message": "' + str(e) + '" }')


class change_interfaces1:
    def GET(self, param):
        try:
            web.header('Content-Type', 'application/json')
            web.header('Access-Control-Allow-Origin', '*')
            web.header('Access-Control-Allow-Credentials', 'true')

            debug = True
            netplan_config_file = "/etc/netplan/01-network-manager-all.yaml"

            # get data
            params = json.loads(param)
            if (debug):
                logger.debug("params = " + json.dumps(params))

            br0_enabled = params["br0_enabled"]
            br0_addresses = params["br0_addresses"]
            br0_gateway = params["br0_gateway"]
            br0_nameservers = params["br0_nameservers"]

            eth1_enabled = params["eth1_enabled"]
            eth1_addresses = params["eth1_addresses"]
            eth1_gateway = params["eth1_gateway"]
            eth1_nameservers = params["eth1_nameservers"]

            eth2_enabled = params["eth2_enabled"]
            eth2_addresses = params["eth2_addresses"]
            eth2_gateway = params["eth2_gateway"]
            eth2_nameservers = params["eth2_nameservers"]

            wifi_enabled = params["wifi_enabled"]
            wifi_addresses = params["wifi_addresses"]
            wifi_gateway = params["wifi_gateway"]
            wifi_nameservers = params["wifi_nameservers"]
            wifi_ssid = params["wifi_ssid"]
            wifi_ssid_password = params["wifi_ssid_password"]

            contr_ip_addr = params["contr_ip_addr"]
            reader_ip_addr = params["reader_ip_addr"]

            # create netplan objects (https://netplan.io/)
            netplan_config = {
                "network": {
                    "version": 2,
                    "renderer": "NetworkManager",
                    "ethernets": {
                        "enp3s0": {
                            "dhcp4": False
                        },
                        "enp4s0": {
                            "dhcp4": False
                        }
                    }
                }
            }
            netplan_config_bridge = {
                "br0": {
                    "interfaces": [
                        "enp3s0",
                        "enp4s0"
                    ],
                    "addresses": br0_addresses,
                    "nameservers": {
                        "addresses": br0_nameservers
                    }
                }
            }
            netplan_config_eth1 = {
                "dhcp4": False,
                "dhcp6": False,
                "addresses": eth1_addresses,
                "nameservers": {
                    "addresses": eth1_nameservers
                }
            }
            netplan_config_eth2 = {
                "dhcp4": False,
                "dhcp6": False,
                "addresses": eth2_addresses,
                "nameservers": {
                    "addresses": eth2_nameservers
                }
            }
            netplan_config_wifi = {
                "wlp1s0": {
                    "dhcp4": False,
                    "dhcp6": False,
                    "addresses": wifi_addresses,
                    "nameservers": {
                        "addresses": wifi_nameservers
                    },
                    "access-points": {
                        "'" + wifi_ssid + "'": {
                            "password": "'" + wifi_ssid_password + "'"
                        }
                    }
                }
            }

            # handle enabled
            if br0_enabled:
                netplan_config["network"]["bridges"] = netplan_config_bridge
            if eth1_enabled:
                netplan_config["network"]["ethernets"]["enp3s0"] = netplan_config_eth1
            if eth2_enabled:
                netplan_config["network"]["ethernets"]["enp4s0"] = netplan_config_eth2
            if wifi_enabled:
                netplan_config["network"]["wifis"] = netplan_config_wifi

            # set gateway (only one allowed)
            if br0_gateway:
                netplan_config["network"]["bridges"]["br0"]["gateway4"] = br0_gateway
            elif eth1_gateway:
                netplan_config["network"]["ethernets"]["enp3s0"]["gateway4"] = eth1_gateway
            elif eth2_gateway:
                netplan_config["network"]["ethernets"]["enp4s0"]["gateway4"] = eth2_gateway
            elif wifi_gateway:
                netplan_config["network"]["wifis"]["wlp1s0"]["gateway4"] = wifi_gateway

            if (debug):
                logger.debug("netplan_config = " + json.dumps(netplan_config))

            # update netplan config file
            with io.open(netplan_config_file, "w", encoding="utf8") as outfile:
                yaml.safe_dump(netplan_config, outfile)

            # apply changes
            thr = threading.Thread(target=delayed_netplan_change)
            thr.start()
            return '{"status":"success", "response":""}'
        except Exception as e:
            logger.error(str(e))
            return web.internalerror('{ "message": "' + str(e) + '" }')


class submitBridge:
    def GET(self, param):
        try:
            # pip install python-benedict
            web.header('Content-Type', 'application/json')
            web.header('Access-Control-Allow-Origin', '*')
            web.header('Access-Control-Allow-Credentials', 'true')

            debug = True

            # get data
            params = json.loads(param)
            if (debug):
                logger.debug("params = " + json.dumps(params))

            gateway = params["gateway"]
            addresses = params["addresses"]
            nameservers = params["nameservers"]

            # create netplan objects (https://netplan.io/)
            netplan_bridge = {
                "br0": {
                    "interfaces": [
                        "enp3s0",
                        "enp4s0"
                    ],
                    "gateway4": gateway,
                    "addresses": addresses,
                    "nameservers": {
                        "addresses": nameservers
                    }
                }
            }
            netplan_ethernet = {
                "enp3s0": {
                    "dhcp4": False
                },
                "enp4s0": {
                    "dhcp4": False
                }
            }
            if (debug):
                logger.debug("netplan_bridge = " + json.dumps(netplan_bridge))

            # get netplan file
            netplan_config = benedict.from_yaml(NETPLAN)

            # update netplan file
            netplan_config["network.bridges"] = netplan_bridge
            netplan_config["network.ethernets"] = netplan_ethernet

            # remove unused values <https://github.com/fabiocaccamo/python-benedict#keylist>
            if not gateway:
                del netplan_config["network.bridges.br0.gateway4"]
                del netplan_config["network.bridges.br0.nameservers"]

            # write netplan changes
            netplan_config.to_yaml(filepath=NETPLAN)

            # apply changes
            thr = threading.Thread(target=delayed_netplan_change)
            thr.start()

            return '{"status":"success", "response":""}'
        except Exception as e:
            logger.error(str(e))
            return web.internalerror('{ "message": "' + str(e) + '" }')


class submitEth1:
    def GET(self, param):
        try:
            web.header('Content-Type', 'application/json')
            web.header('Access-Control-Allow-Origin', '*')
            web.header('Access-Control-Allow-Credentials', 'true')

            debug = True

            # get data
            params = json.loads(param)
            if (debug):
                logger.debug("params = " + json.dumps(params))

            gateway = params["gateway"]
            addresses = params["addresses"]
            nameservers = params["nameservers"]
            delete = params["delete"]

            # create netplan objects (https://netplan.io/)
            netplan_eth1 = {
                "dhcp4": False,
                "dhcp6": False,
                "gateway4": gateway,
                "addresses": addresses,
                "nameservers": {
                    "addresses": nameservers
                }
            }
            if (debug):
                logger.debug("netplan_eth1 = " + json.dumps(netplan_eth1))

            # get netplan file
            netplan_config = benedict.from_yaml(NETPLAN)

            # update netplan file
            netplan_config["network.ethernets.enp3s0"] = netplan_eth1

            # remove unused values <https://github.com/fabiocaccamo/python-benedict#keylist>
            if delete:
                if "network.ethernets.enp3s0" in netplan_config:
                    del netplan_config["network.ethernets.enp3s0"]
            else:
                if "network.bridges" in netplan_config:
                    del netplan_config["network.bridges"]
                if not gateway:
                    del netplan_config["network.ethernets.enp3s0.gateway4"]

            # write netplan changes
            netplan_config.to_yaml(filepath=NETPLAN)

            # apply changes
            thr = threading.Thread(target=delayed_netplan_change)
            thr.start()

            return '{"status":"success", "response":""}'
        except Exception as e:
            logger.error(str(e))
            return web.internalerror('{ "message": "' + str(e) + '" }')


class submitEth2:
    def GET(self, param):
        try:
            web.header('Content-Type', 'application/json')
            web.header('Access-Control-Allow-Origin', '*')
            web.header('Access-Control-Allow-Credentials', 'true')

            debug = True

            # get data
            params = json.loads(param)
            if (debug):
                logger.debug("params = " + json.dumps(params))

            gateway = params["gateway"]
            addresses = params["addresses"]
            nameservers = params["nameservers"]
            delete = params["delete"]

            # create netplan objects (https://netplan.io/)
            netplan_eth2 = {
                "dhcp4": False,
                "dhcp6": False,
                "gateway4": gateway,
                "addresses": addresses,
                "nameservers": {
                    "addresses": nameservers
                }
            }
            if (debug):
                logger.debug("netplan_eth2 = " + json.dumps(netplan_eth2))

            # get netplan file
            netplan_config = benedict.from_yaml(NETPLAN)

            # update netplan file
            netplan_config["network.ethernets.enp4s0"] = netplan_eth2

            # remove unused values <https://github.com/fabiocaccamo/python-benedict#keylist>
            if delete:
                if "network.ethernets.enp4s0" in netplan_config:
                    del netplan_config["network.ethernets.enp4s0"]
            else:
                if "network.bridges" in netplan_config:
                    del netplan_config["network.bridges"]
                if not gateway:
                    del netplan_config["network.ethernets.enp4s0.gateway4"]

            # write netplan changes
            netplan_config.to_yaml(filepath=NETPLAN)

            # apply changes
            thr = threading.Thread(target=delayed_netplan_change)
            thr.start()

            return '{"status":"success", "response":""}'
        except Exception as e:
            logger.error(str(e))
            return web.internalerror('{ "message": "' + str(e) + '" }')


class submitWiFi:
    def GET(self, param):
        try:
            web.header('Content-Type', 'application/json')
            web.header('Access-Control-Allow-Origin', '*')
            web.header('Access-Control-Allow-Credentials', 'true')

            debug = True

            # get data
            params = json.loads(param)
            if (debug):
                logger.debug("params = " + json.dumps(params))

            gateway = params["gateway"]
            addresses = params["addresses"]
            nameservers = params["nameservers"]
            ssid = params["ssid"]
            ssidPassword = params["ssidPassword"]
            delete = params["delete"]

            # create netplan objects (https://netplan.io/)
            netplan_wifi = {
                "dhcp4": False,
                "dhcp6": False,
                "addresses": addresses,
                "gateway4": gateway,
                "nameservers": {
                    "addresses": nameservers
                },
                "access-points": {
                    ssid: {
                        "password": ssidPassword
                    }
                }
            }
            netplan_ap_no_password = {
                ssid: {}
            }

            if (debug):
                logger.debug("netplan_wifi = " + json.dumps(netplan_wifi))

            # get netplan file
            netplan_config = benedict.from_yaml(NETPLAN)

            # update netplan file
            netplan_config["network.wifis.wlp1s0"] = netplan_wifi
            if not ssidPassword:
                netplan_config["network.wifis.wlp1s0.access-points"] = netplan_ap_no_password

            # remove unused values <https://github.com/fabiocaccamo/python-benedict#keylist>
            if delete:
                if "network.wifis" in netplan_config:
                    del netplan_config["network.wifis"]
            else:
                if not gateway:
                    del netplan_config["network.wifis.wlp1s0.gateway4"]

            # write netplan changes
            netplan_config.to_yaml(filepath=NETPLAN)

            # apply changes
            thr = threading.Thread(target=delayed_netplan_change)
            thr.start()

            return '{"status":"success", "response":""}'
        except Exception as e:
            logger.error(str(e))
            return web.internalerror('{ "message": "' + str(e) + '" }')


class get_station_wifi:
    def GET(self):
        try:
            web.header('Content-Type', 'application/json')
            web.header('Access-Control-Allow-Origin', '*')
            web.header('Access-Control-Allow-Credentials', 'true')

            debug = False
            ret_obj = {}

            # connect to MySQL
            cnx = mysql.connector.connect(
                host="localhost", port=3306, user=DATABASE_USER, passwd=DATABASE_PASSWORD, db=DATABASE)
            cursor = cnx.cursor(dictionary=True)

            # get Controller IP Address
            cursor.execute("select Description, Val from StationWiFi")
            for row in cursor:
                ret_obj[row["Description"]] = row["Val"]

            # close connection
            cursor.close()
            cnx.close()

            # return data
            ret_str = json.dumps(ret_obj)  # converts json object to string
            if (debug):
                logger.info("ret_str = " + ret_str)
            return ret_str
        except Exception as e:
            logger.error(str(e))
            return web.internalerror('{ "message": "' + str(e) + '" }')


class update_station_wifi:
    def GET(self, param):
        try:
            web.header('Content-Type', 'application/json')
            web.header('Access-Control-Allow-Origin', '*')
            web.header('Access-Control-Allow-Credentials', 'true')

            # get data
            params = json.loads(param)
            enabled = params["enabled"]
            network_name = params["network_name"]
            network_password = params["network_password"]
            enable_bridge = params["enable_bridge"]
            network_ap_gateway = params["network_ap_gateway"]
            logger.info("enabled = " + str(enabled) + "; network_name = " + network_name + "; network_password = " +
                        network_password + "; enable_bridge = " + str(enable_bridge) + "; network_ap_gateway = " + network_ap_gateway)

            # connect to MySQL
            cnx = mysql.connector.connect(
                host="localhost", port=3306, user=DATABASE_USER, passwd=DATABASE_PASSWORD, db=DATABASE)
            cursor = cnx.cursor(dictionary=True)

            # update Controller IP Address
            query = ("insert into StationWiFi (ID, Val) values " +
                     "(1,'" + str(enabled) + "')," +
                     "(2,'" + network_name + "')," +
                     "(3,'" + network_password + "')," +
                     "(4,'" + str(enable_bridge) + "')," +
                     "(5,'" + network_ap_gateway + "')" +
                     " on duplicate key update ID=values(ID),Val=values(Val);")
            cursor.execute(query)

            # commit
            cnx.commit()

            # close connection
            cursor.close()
            cnx.close()

            # apply changes
            thr = threading.Thread(target=delayed_reboot)
            thr.start()
            return '{"status":"success", "response":""}'
        except Exception as e:
            logger.error(str(e))
            return web.internalerror('{ "message": "' + str(e) + '" }')

# endregion

# Commands

# region


class clear_all_log_files:
    def GET(self):
        try:
            web.header('Content-Type', 'application/json')
            web.header('Access-Control-Allow-Origin', '*')
            web.header('Access-Control-Allow-Credentials', 'true')
            EXECUTABLE = "rm -f /var/www/html/logs/*.log"
            os.system(EXECUTABLE)
            return '{"status":"success", "response":""}'
        except Exception as e:
            logger.error(str(e))
            return web.internalerror('{ "message": "' + str(e) + '" }')


class change_log_file_perm:
    def GET(self):
        try:
            web.header('Content-Type', 'application/json')
            web.header('Access-Control-Allow-Origin', '*')
            web.header('Access-Control-Allow-Credentials', 'true')
            EXECUTABLE = "chmod -R 777 /var/www/html/logs"
            os.system(EXECUTABLE)
            return '{"status":"success", "response":""}'
        except Exception as e:
            logger.error(str(e))
            return web.internalerror('{ "message": "' + str(e) + '" }')


class reboot_station:
    def GET(self):
        try:
            web.header('Content-Type', 'application/json')
            web.header('Access-Control-Allow-Origin', '*')
            web.header('Access-Control-Allow-Credentials', 'true')
            thr = threading.Thread(target=delayed_reboot)
            thr.start()
            return '{"status":"success", "response":""}'
        except Exception as e:
            logger.error(str(e))
            return web.internalerror('{ "message": "' + str(e) + '" }')


class shutdown_station:
    def GET(self):
        try:
            web.header('Content-Type', 'application/json')
            web.header('Access-Control-Allow-Origin', '*')
            web.header('Access-Control-Allow-Credentials', 'true')
            thr = threading.Thread(target=delayed_shutdown)
            thr.start()
            return '{"status":"success", "response":""}'
        except Exception as e:
            logger.error(str(e))
            return web.internalerror('{ "message": "' + str(e) + '" }')


# endregion

# Threads

# region


def delayed_reboot():
    try:
        time.sleep(3)
        EXECUTABLE = "reboot"
        os.system(EXECUTABLE)
    except Exception as e:
        logger.error("error = " + str(e))


def delayed_shutdown():
    try:
        time.sleep(3)
        EXECUTABLE = "shutdown now"
        os.system(EXECUTABLE)
    except Exception as e:
        logger.error("error = " + str(e))


def delayed_netplan_change():
    try:
        time.sleep(1)
        os.system("sync")  # commit buffer cache to disk
        # generate config for the renderers
        os.system("netplan generate")
        time.sleep(1)
        # apply config for the renderers
        os.system("netplan apply")
        time.sleep(1)
        # apply config for the renderers
        # os.system(
        #     "/etc/init.d/network-manager restart")
    except Exception as e:
        logger.error("error = " + str(e))

# endregion


if __name__ == "__main__":
    logger.info("webpy started; version = " + VERSION)
    application.run()

# Notes
# logger.info("")		// Detailed information, typically of interest only when diagnosing problems.
# logger.debug("")		// Confirmation that things are working as expected.
# logger.warning("")	// An indication that something unexpected happened, or indicative of some problem in the near future
# logger.error("")		// Due to a more serious problem, the software has not been able to perform some function.
# logger.critical("")	// A serious error, indicating that the program itself may be unable to continue running.
