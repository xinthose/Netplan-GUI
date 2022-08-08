#!/usr/bin/python

# This file is subject to the terms and conditions defined in
# file 'LICENSE.txt', which is part of this source code.

# Run app:
# DEV: uvicorn rest:app --reload --host 0.0.0.0 --port 8080
# PROD: gunicorn -w 4 -b 0.0.0.0:8080 -k uvicorn.workers.UvicornWorker rest:app


import log
import os
import os.path
import threading
import time
import simplejson as json
import yaml
from benedict import benedict
from datetime import datetime

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
import models   # models.py

# Configuration

# region

VERSION = "1.0.3"
NETPLAN = "/etc/netplan/01-network-manager-all.yaml"

logger = log.setup_custom_logger('root')

# endregion

# Initialization

# region

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
logger.info(f"netplan gui REST started; version = {VERSION}")

# endregion

# Netplan GUI

# region

# GET requests


@ app.get("/get_interfaces1")
async def get_interfaces1():
    try:
        debug = False
        ret_obj = {}

        # get network data
        with open(NETPLAN, "r") as stream:
            try:
                netplan_config = yaml.safe_load(stream)
                if (debug):
                    logger.debug("netplan_config = " +
                                 json.dumps(netplan_config))
                stream.close()
            except yaml.YAMLError as e:
                logger.error(f"error = {str(e)}")
                raise HTTPException(status_code=500, detail=str(e))
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
                routes = br0.get("routes", "")
                nameservers = br0.get("nameservers", "")
                if routes:
                    br0_gateway = routes[0].get("via", "")
                if nameservers:
                    br0_nameservers = nameservers.get("addresses", "")

        # Ethernet Ports
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
                routes = eth1.get("routes", "")
                nameservers = eth1.get("nameservers", "")
                if routes:
                    eth1_gateway = routes[0].get("via", "")
                if nameservers:
                    eth1_nameservers = nameservers.get("addresses", "")
            eth2 = ethernets.get("enp4s0", "")  # LAN2
            if eth2:
                eth2_addresses = eth2.get("addresses", "")
                routes = eth2.get("routes", "")
                nameservers = eth2.get("nameservers", "")
                if routes:
                    eth2_gateway = routes[0].get("via", "")
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
                routes = wifi.get("routes", "")
                nameservers = wifi.get("nameservers", "")
                if routes:
                    wifi_gateway = routes[0].get("via", "")
                if nameservers:
                    wifi_nameservers = nameservers.get("addresses", "")
                wifi_access_points = wifi.get("access-points", "")
                for key in wifi_access_points.keys():
                    wifi_ssid = key
                wifi_ssid_password = wifi_access_points[wifi_ssid].get(
                    "password", "")

        # add to response
        ret_obj["br0_addresses"] = br0_addresses
        ret_obj["br0_gateway"] = br0_gateway
        ret_obj["br0_nameservers"] = br0_nameservers

        ret_obj["eth1_addresses"] = eth1_addresses
        ret_obj["eth1_gateway"] = eth1_gateway
        ret_obj["eth1_nameservers"] = eth1_nameservers

        ret_obj["eth2_addresses"] = eth2_addresses
        ret_obj["eth2_gateway"] = eth2_gateway
        ret_obj["eth2_nameservers"] = eth2_nameservers

        ret_obj["wifi_addresses"] = wifi_addresses
        ret_obj["wifi_gateway"] = wifi_gateway
        ret_obj["wifi_nameservers"] = wifi_nameservers
        ret_obj["wifi_ssid"] = wifi_ssid
        ret_obj["wifi_ssid_password"] = wifi_ssid_password

        # return data
        # converts json object to string
        if (debug):
            logger.info(f"ret_obj = {json.dumps(ret_obj)}")
        return ret_obj
    except Exception as e:
        logger.error(f"error = {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@ app.get("/get_date_time")
async def get_date_time():
    try:
        debug = False
        ret_obj = {}

        # datetime object containing current date and time
        now = datetime.now()

        # Sun Sep 8 07:06:05 2013
        dt_string = now.strftime("%c")

        ret_obj["data"] = dt_string

        # return data
        if (debug):
            logger.info(f"ret_obj = {json.dumps(ret_obj)}")
        return ret_obj
    except Exception as e:
        logger.error(f"error = {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# GET requests - commands


@ app.get("/clear_all_log_files")
async def clear_all_log_files():
    try:
        EXECUTABLE = "rm -f /var/www/html/logs/*.log"
        os.system(EXECUTABLE)
        return {"response": "OK"}
    except Exception as e:
        logger.error(f"error = {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@ app.get("/change_log_file_perm")
async def change_log_file_perm():
    try:
        EXECUTABLE = "chmod -R 777 /var/www/html/logs"
        os.system(EXECUTABLE)
        return {"response": "OK"}
    except Exception as e:
        logger.error(f"error = {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@ app.get("/reboot_station")
async def reboot_station():
    try:
        thr = threading.Thread(target=delayed_reboot)
        thr.start()
        return {"response": "OK"}
    except Exception as e:
        logger.error(f"error = {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@ app.get("/shutdown_station")
async def shutdown_station():
    try:
        thr = threading.Thread(target=delayed_shutdown)
        thr.start()
        return {"response": "OK"}
    except Exception as e:
        logger.error(f"error = {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# POST requests

@app.post("/submitBridge")
async def submitBridge(data: models.SubmitBridge):
    try:
        debug = False
        data = jsonable_encoder(data)

        if (debug):
            logger.debug(f"submitBridge >> data = {json.dumps(data)}")

        # create netplan objects (https://netplan.io/)
        netplan_bridge = {
            "br0": {
                "interfaces": [
                    "enp3s0",
                    "enp4s0"
                ],
                "routes": [
                    {
                        "to": "default",
                        "via": data["gateway"]
                    }
                ],
                "addresses": data["addresses"],
                "nameservers": {
                    "addresses": data["nameservers"]
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
        if not data["gateway"]:
            del netplan_config["network.bridges.br0.routes"]
            del netplan_config["network.bridges.br0.nameservers"]

        # write netplan changes
        netplan_config.to_yaml(filepath=NETPLAN)

        # apply changes
        thr = threading.Thread(target=delayed_netplan_change)
        thr.start()

        return {"response": "OK"}
    except Exception as e:
        logger.error(f"error = {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/submitEth1")
async def submitEth1(data: models.SubmitEth):
    try:
        debug = False
        data = jsonable_encoder(data)

        if (debug):
            logger.debug(f"data = {json.dumps(data)}")

        # create netplan objects (https://netplan.io/)
        netplan_eth1 = {
            "dhcp4": False,
            "dhcp6": False,
            "routes": [
                {
                    "to": "default",
                    "via": data["gateway"]
                }
            ],
            "addresses": data["addresses"],
            "nameservers": {
                "addresses": data["nameservers"]
            }
        }
        if (debug):
            logger.debug("netplan_eth1 = " + json.dumps(netplan_eth1))

        # get netplan file
        netplan_config = benedict.from_yaml(NETPLAN)

        # update netplan file
        netplan_config["network.ethernets.enp3s0"] = netplan_eth1

        # remove unused values <https://github.com/fabiocaccamo/python-benedict#keylist>
        if data["deleteEth"]:
            if "network.ethernets.enp3s0" in netplan_config:
                del netplan_config["network.ethernets.enp3s0"]
        else:
            if "network.bridges" in netplan_config:
                del netplan_config["network.bridges"]
            if not data["gateway"]:
                del netplan_config["network.ethernets.enp3s0.routes"]

        # write netplan changes
        netplan_config.to_yaml(filepath=NETPLAN)

        # apply changes
        thr = threading.Thread(target=delayed_netplan_change)
        thr.start()

        return {"response": "OK"}
    except Exception as e:
        logger.error(f"error = {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/submitEth2")
async def submitEth2(data: models.SubmitEth):
    try:
        debug = False
        data = jsonable_encoder(data)

        if (debug):
            logger.debug(f"data = {json.dumps(data)}")

        # create netplan objects (https://netplan.io/)
        netplan_eth2 = {
            "dhcp4": False,
            "dhcp6": False,
            "routes": [
                {
                    "to": "default",
                    "via": data["gateway"]
                }
            ],
            "addresses": data["addresses"],
            "nameservers": {
                "addresses": data["nameservers"]
            }
        }
        if (debug):
            logger.debug("netplan_eth2 = " + json.dumps(netplan_eth2))

        # get netplan file
        netplan_config = benedict.from_yaml(NETPLAN)

        # update netplan file
        netplan_config["network.ethernets.enp4s0"] = netplan_eth2

        # remove unused values <https://github.com/fabiocaccamo/python-benedict#keylist>
        if data["deleteEth"]:
            if "network.ethernets.enp4s0" in netplan_config:
                del netplan_config["network.ethernets.enp4s0"]
        else:
            if "network.bridges" in netplan_config:
                del netplan_config["network.bridges"]
            if not data["gateway"]:
                del netplan_config["network.ethernets.enp4s0.routes"]

        # write netplan changes
        netplan_config.to_yaml(filepath=NETPLAN)

        # apply changes
        thr = threading.Thread(target=delayed_netplan_change)
        thr.start()

        return {"response": "OK"}
    except Exception as e:
        logger.error(f"error = {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/submitWiFi")
async def submitWiFi(data: models.SubmitWiFi):
    try:
        debug = False
        data = jsonable_encoder(data)

        if (debug):
            logger.debug(f"data = {json.dumps(data)}")

        # create netplan objects (https://netplan.io/)
        netplan_wifi = {
            "dhcp4": False,
            "dhcp6": False,
            "addresses": data["addresses"],
            "routes": [
                {
                    "to": "default",
                    "via": data["gateway"]
                }
            ],
            "nameservers": {
                "addresses": data["nameservers"]
            },
            "access-points": {
                data["ssid"]: {
                    "password": data["ssidPassword"]
                }
            }
        }
        netplan_ap_no_password = {
            data["ssid"]: {}
        }

        if (debug):
            logger.debug("netplan_wifi = " + json.dumps(netplan_wifi))

        # get netplan file
        netplan_config = benedict.from_yaml(NETPLAN)

        # update netplan file
        netplan_config["network.wifis.wlp1s0"] = netplan_wifi
        if not data["ssidPassword"]:
            netplan_config["network.wifis.wlp1s0.access-points"] = netplan_ap_no_password

        # remove unused values <https://github.com/fabiocaccamo/python-benedict#keylist>
        if data["deleteWiFi"]:
            if "network.wifis" in netplan_config:
                del netplan_config["network.wifis"]
        else:
            if not data["gateway"]:
                del netplan_config["network.wifis.wlp1s0.routes"]

        # write netplan changes
        netplan_config.to_yaml(filepath=NETPLAN)

        # apply changes
        thr = threading.Thread(target=delayed_netplan_change)
        thr.start()

        return {"response": "OK"}
    except Exception as e:
        logger.error(f"error = {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@ app.post("/setdate")
async def setdate(data: models.SetDate):
    try:
        data = jsonable_encoder(data)

        # set new date/time
        EXECUTABLE = f"date --set '{data['ServerTime']}'"
        os.system(EXECUTABLE)

        # permanently save new date/time
        EXECUTABLE2 = "hwclock -w"
        os.system(EXECUTABLE2)

        # return success
        return {"response": "OK"}
    except Exception as e:
        logger.error(f"error = {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# endregion

# Threads

# region


def delayed_reboot():
    try:
        time.sleep(3)
        EXECUTABLE = 'reboot'
        os.system(EXECUTABLE)
    except Exception as e:
        logger.error(f"error = {str(e)}")


def delayed_shutdown():
    try:
        time.sleep(3)
        EXECUTABLE = 'shutdown now'
        os.system(EXECUTABLE)
    except Exception as e:
        logger.error(f"error = {str(e)}")


def delayed_netplan_change():
    try:
        time.sleep(1)
        os.system("sync")  # commit buffer cache to disk
        # generate config for the renderers
        os.system("netplan generate")
        time.sleep(1)
        # apply config for the renderers
        os.system("netplan apply")
    except Exception as e:
        logger.error(f"error = {str(e)}")


def delayed_vpn_server_change():
    try:
        os.system("sync")  # Synchronize cached writes to persistent storage

        time.sleep(1)

        os.system("service openvpn@server restart")

        time.sleep(3)

        os.system("brctl addif br0 tap0")

        time.sleep(1)

        os.system("ifconfig tap0 0.0.0.0 promisc up")
    except Exception as e:
        logger.error(f"error = {str(e)}")

# endregion


# Notes
# logger.info("")		// Detailed information, typically of interest only when diagnosing problems.
# logger.debug("")		// Confirmation that things are working as expected.
# logger.warning("")	// An indication that something unexpected happened, or indicative of some problem in the near future
# logger.error("")		// Due to a more serious problem, the software has not been able to perform some function.
# logger.critical("")	// A serious error, indicating that the program itself may be unable to continue running.
