#!/usr/bin/python

import web, log, os, logging, threading, time
import simplejson as json
import mysql.connector
import yaml
import io

VERSION = "1.00"

# Configuration
PORT=3306
HOST="localhost"
DATABASE = "NetplanConfig"
USERNAME = "admin"
PASSWORD = "admin"

logger = log.setup_custom_logger('root')

urls = (
	'/get_interfaces', 'get_interfaces',
	'/change_interfaces/(.*)', 'change_interfaces',
	'/get_vpn_server_bridge', 'get_vpn_server_bridge',
	'/update_vpn_server_bridge/(.*)', 'update_vpn_server_bridge',
	'/get_station_wifi', 'get_station_wifi',
	'/update_station_wifi/(.*)', 'update_station_wifi',
	'/reboot_station', 'reboot_station',
)
# Note: check commas in URL's

application = web.application(urls, globals())

class get_interfaces:
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
						logger.debug("netplan_config = " + json.dumps(netplan_config))
					stream.close()
				except yaml.YAMLError as exc:
					logger.error(str(exc))
					return web.internalerror('{ "message": "' + str(exc) + '" }')
			network = netplan_config.get("network")
			if (debug): logger.debug("network = " + json.dumps(network))

			## Bridge 0
			br0_addresses = ""
			br0_gateway = ""
			br0_nameservers = ""

			bridges = network.get("bridges", "")
			if bridges:
				if (debug): logger.debug("bridges = " + json.dumps(bridges))
				br0 = bridges.get("br0", "")
				if br0:
					br0_addresses = br0.get("addresses", "")
					br0_gateway = br0.get("gateway4", "")
					br0_nameservers = br0.get("nameservers", "").get("addresses", "")

			## Ethernet Port 1 (LAN1)
			eth1_addresses = ""
			eth1_gateway = ""
			eth1_nameservers = ""
			eth2_addresses = ""
			eth2_gateway = ""
			eth2_nameservers = ""

			ethernets = network.get("ethernets", "")
			if ethernets:
				if (debug): logger.debug("ethernets = " + json.dumps(ethernets))
				eth1 = ethernets.get("enp3s0", "")	# LAN1
				if eth1:
					eth1_addresses = eth1.get("addresses", "")
					eth1_gateway = eth1.get("gateway4", "")
					nameservers = eth1.get("nameservers", "")
					if nameservers:
						eth1_nameservers = nameservers.get("addresses", "")
				eth2 = ethernets.get("enp4s0", "")	# LAN2
				if eth2:
					eth2_addresses = eth2.get("addresses", "")
					eth2_gateway = eth2.get("gateway4", "")
					nameservers = eth2.get("nameservers", "")
					if nameservers:
						eth2_nameservers = nameservers.get("addresses", "")

			## Wi-Fi
			wifi_addresses = ""
			wifi_gateway = ""
			wifi_nameservers = ""
			wifi_ssid = ""
			wifi_ssid_password = ""

			wifis = network.get("wifis", "")
			if wifis:
				if (debug): logger.debug("wifis = " + json.dumps(wifis))
				wifi = wifis.get("wlp1s0", "")
				if wifi:
					wifi_addresses = wifi.get("addresses", "")
					wifi_gateway = wifi.get("gateway4", "")
					wifi_nameservers = wifi.get("nameservers", "").get("addresses", "")
					wifi_access_points = wifi.get("access-points", "")
					for key in wifi_access_points.keys(): 
						wifi_ssid = key
					wifi_ssid_password = wifi_access_points[wifi_ssid].get("password", "")

			## add to response
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
			ret_str = json.dumps(response_obj)	# converts json object to string
			if (debug): logger.info("ret_str = " + ret_str)
		except Exception, e:
			logger.error(str(e))
			return web.internalerror('{ "message": "' + str(e) + '" }')

		return ret_str

class change_interfaces:
	def GET(self, param):
		try:
			web.header('Content-Type', 'application/json')
			web.header('Access-Control-Allow-Origin', '*')
			web.header('Access-Control-Allow-Credentials', 'true')

			debug = True
			netplan_config_file = "/etc/netplan/01-network-manager-all.yaml"
			str_found = False

			# get data
			params = json.loads(param)
			if (debug): logger.debug("params = " + json.dumps(params))

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
				"dhcp4": False,
				"dhcp6": False,
				"addresses": wifi_addresses,
				"nameservers": {
					"addresses": wifi_nameservers
				},
				"access-points": {
					wifi_ssid: {
						"password": wifi_ssid_password
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
				netplan_config["network"]["wifis"]["gateway4"] = wifi_gateway

			if (debug):
				logger.debug("netplan_config = " + json.dumps(netplan_config))

			# update netplan config file
			with io.open(netplan_config_file, "w", encoding="utf8") as outfile:
				yaml.safe_dump(netplan_config, outfile)

			# apply changes
			thr = threading.Thread(target=delayed_netplan_change)
			thr.start()
		except Exception, e:
			logger.error(str(e))
			return web.internalerror('{ "message": "' + str(e) + '" }')

		return '{"status":"success", "response":""}'

class get_vpn_server_bridge:
	def GET(self):
		try:
			web.header('Content-Type', 'application/json')
			web.header('Access-Control-Allow-Origin', '*')
			web.header('Access-Control-Allow-Credentials', 'true')

			debug = False

			ret_obj = {}
			netplan_config_file = "/etc/netplan/01-network-manager-all.yaml"
			openvpn_server_file = "/etc/openvpn/server.conf"

			# get data from OpenVPN server file
			# example line: server-bridge 10.0.0.2 255.255.255.0 10.0.0.50 10.0.0.99
			server_file = open(openvpn_server_file, "r")
			
			# read lines in file
			lines = server_file.readlines();
			
			# close file
			server_file.close()

			# find server-bridge line
			line_arr = []
			for line in lines:
				if line.startswith("server-bridge"):
					line_arr = line.split()
					break

			# get data from line
			server_ip = line_arr[1]
			server_subnet = line_arr[2]
			server_dhcp_range_start = line_arr[3]
			server_dhcp_range_end = line_arr[4]

			# get network data
			with open(netplan_config_file, "r") as stream:
				try:
					netplan_config = yaml.safe_load(stream)
					if (debug): logger.debug("netplan_config = " + json.dumps(netplan_config))
					stream.close()
				except yaml.YAMLError as exc:
					logger.error(str(exc))
					return web.internalerror('{ "message": "' + str(exc) + '" }')

			## bridge 0
			bridges = netplan_config.get("network").get("bridges")
			br0_addresses = ""
			bridge_index = 0
			if bridges is not None:
				br0 = netplan_config.get("network").get("bridges").get("br0")
				br0_addresses = br0["addresses"]

				## find bridge index of server IP
				for idx, addr in enumerate(br0_addresses):
					if addr.find(server_ip) != -1:
						bridge_index = idx
						break

			# put data into return object
			ret_obj["server_ip"] = server_ip
			ret_obj["server_subnet"] = server_subnet
			ret_obj["server_dhcp_range_start"] = server_dhcp_range_start
			ret_obj["server_dhcp_range_end"] = server_dhcp_range_end
			ret_obj["br0_addresses"] = br0_addresses
			ret_obj["bridge_index"] = bridge_index

			# return data
			ret_str = json.dumps(ret_obj)	# converts json to string
			if (debug): logger.info("ret_str = " + ret_str)
			return ret_str
		except Exception, e:
			logger.error(str(e))
			return web.internalerror('{ "message": "' + str(e) + '" }')

class update_vpn_server_bridge:
	def GET(self, param):
		try:
			web.header('Content-Type', 'application/json')
			web.header('Access-Control-Allow-Origin', '*')
			web.header('Access-Control-Allow-Credentials', 'true')

			openvpn_server_file = "/etc/openvpn/server.conf"

			# get data
			params = json.loads(param)
			update_line = params["update_line"]
			logger.info("update_line = " + update_line)

			# get lines in OpenVPN configuration file, make backup for safety
			# example: server-bridge 10.0.0.2 255.255.255.0 10.0.0.99 10.0.0.99
			os.rename(openvpn_server_file, openvpn_server_file + ".bak")
			read_file = open(openvpn_server_file + ".bak", 'r')
			lines = read_file.readlines()
			read_file.close()

			# rewrite entire configuration file with new server-bridge line
			write_file = open(openvpn_server_file, 'w')
			for line in lines:
				if line.startswith("server-bridge"):
					str_found = True
					line = update_line + "\n"
				write_file.write(line)
			if not str_found:
				logger.error("The string 'server-bridge' was not found in file " + openvpn_server_file)
			write_file.close()

			# apply changes
			thr = threading.Thread(target=delayed_vpn_server_change)
			thr.start()
		except Exception, e:
			logger.error(str(e))
			return web.internalerror('{ "message": "' + str(e) + '" }')
		
		return '{"status":"success", "response":""}'

class get_station_wifi:
	def GET(self):
		try:
			web.header('Content-Type', 'application/json')
			web.header('Access-Control-Allow-Origin', '*')
			web.header('Access-Control-Allow-Credentials', 'true')

			debug = False
			ret_obj = {}

			# connect to MySQL
			cnx = mysql.connector.connect(host=HOST, port=PORT, user=USERNAME, passwd=PASSWORD, db=DATABASE)
			cursor = cnx.cursor(dictionary=True)

			# get Controller IP Address
			cursor.execute("select Description, Val from StationWiFi")
			for row in cursor:
				ret_obj[row["Description"]] = row["Val"]

			# close connection
			cnx.close()

			# return data
			ret_str = json.dumps(ret_obj)	# converts json object to string
			if (debug): logger.info("ret_str = " + ret_str)
		except Exception, e:
			logger.error(str(e))
			return web.internalerror('{ "message": "' + str(e) + '" }')

		return ret_str

class update_station_wifi:
	def GET(self, param):
		try:
			web.header('Content-Type', 'application/json')
			web.header('Access-Control-Allow-Origin', '*')
			web.header('Access-Control-Allow-Credentials', 'true')

			# get data
			params = json.loads(param)
			broadcast_wifi_enabled = params["broadcast_wifi_enabled"]
			wifi_network_name = params["wifi_network_name"]
			wifi_network_password = params["wifi_network_password"]
			wifi_broadcast_type = params["wifi_broadcast_type"]
			wifi_network_ap_gateway = params["wifi_network_ap_gateway"]
			logger.info("broadcast_wifi_enabled = " + str(broadcast_wifi_enabled) + "; wifi_network_name = " + wifi_network_name + "; wifi_network_password = " + wifi_network_password + "; wifi_broadcast_type = " + str(wifi_broadcast_type) + "; wifi_network_ap_gateway = " + wifi_network_ap_gateway)

			# connect to MySQL
			cnx = mysql.connector.connect(host=HOST, port=PORT, user=USERNAME, passwd=PASSWORD, db=DATABASE)
			cursor = cnx.cursor(dictionary=True)

			# update Controller IP Address
			query = ("insert into StationWiFi (ID, Val) values " + 
				"(1,'" + str(broadcast_wifi_enabled) + "')," + 
				"(2,'" + wifi_network_name + "')," + 
				"(3,'" + wifi_network_password + "')," + 
				"(4,'" + str(wifi_broadcast_type) + "')," + 
				"(5,'" + wifi_network_ap_gateway + "')" + 
				" on duplicate key update ID=values(ID),Val=values(Val);")
			cursor.execute(query)

			# commit
			cnx.commit()

			# close connection
			cnx.close()

			# apply changes
			thr = threading.Thread(target=delayed_reboot)
			thr.start()			
		except Exception, e:
			logger.error(str(e))
			return web.internalerror('{ "message": "' + str(e) + '" }')

		return '{"status":"success", "response":""}'

## Commands

class reboot_station:
	def GET(self):
		try:
			web.header('Content-Type', 'application/json')
			web.header('Access-Control-Allow-Origin', '*')
			web.header('Access-Control-Allow-Credentials', 'true')
			thr = threading.Thread(target=delayed_reboot)
			thr.start()
		except Exception, e:
			logger.error(str(e))
			return web.internalerror('{ "message": "' + str(e) + '" }')

		return '{"status":"success", "response":""}'

## Threads

def delayed_reboot():
	time.sleep(3)
	EXECUTABLE = 'echo EleMech0587 | sudo -S /home/elemech/Documents/pal5/shell/reboot.sh'
	os.system(EXECUTABLE)

def delayed_netplan_change():
	time.sleep(1)
	os.system("sync")	# commit buffer cache to disk
	os.system("echo EleMech0587 | sudo -S netplan generate")	# generate config for the renderers
	time.sleep(1)
	os.system("echo EleMech0587 | sudo -S netplan apply")	# apply config for the renderers
	time.sleep(1)
	os.system("echo EleMech0587 | sudo -S /etc/init.d/network-manager restart")	# apply config for the renderers

def delayed_vpn_server_change():
	os.system("sync")	# Synchronize cached writes to persistent storage

	time.sleep(1)

	os.system("echo EleMech0587 | sudo -S service openvpn restart")

	time.sleep(3)

	os.system("echo EleMech0587 | sudo -S brctl addif br0 tap0")

	time.sleep(1)

	os.system("echo EleMech0587 | sudo -S ifconfig tap0 0.0.0.0 promisc up")

if __name__ == "__main__":
	logger.info("webpy started; version = " + VERSION)
	application.run()

################################# Notes ################################
# ##############################################################################################################
# logger.info("")		// Detailed information, typically of interest only when diagnosing problems.
# logger.debug("")		// Confirmation that things are working as expected.
# logger.warning("")	// An indication that something unexpected happened, or indicative of some problem in the near future
# logger.error("")		// Due to a more serious problem, the software has not been able to perform some function.
# logger.critical("")	// A serious error, indicating that the program itself may be unable to continue running.
# ##############################################################################################################
# 		try:
# 		except Exception, e:
# 			logger.error(str(e))
# 			return web.internalerror('{ "message": "' + str(e) + '" }')
# ##############################################################################################################
# class blank_function:
# 	def GET(self, param):
# 		try:
# 			web.header('Content-Type', 'application/json')
# 			web.header('Access-Control-Allow-Origin', '*')
# 			web.header('Access-Control-Allow-Credentials', 'true')

# 			debug = False
# 			ret_obj = {}
# 			response_obj = {}

# 			# 1. get data
# 			params = json.loads(param)
# 			account_number = params["account_number"]

# 			# 2. build return

# 			# 3. return data
# 			ret_obj["status"] = "success"
# 			ret_obj["response"] = response_obj
# 			ret_str = json.dumps(ret_obj)
# 			if (debug): logger.info("ret_str = " + ret_str)
# 		except Exception, e:
# 			logger.error(str(e))
# 			return web.internalerror('{ "message": "' + str(e) + '" }')

# 		return ret_str
# ##############################################################################################################
# Windows package installation:
# 	cd C:\Users\adunsmoor\AppData\Local\Programs\Python\Python37-32\Scripts
# 	easy_install.exe web.py