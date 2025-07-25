#!/usr/bin/python3

import yaml
import simplejson as json

NETPLAN = "/etc/netplan/01-network-manager-all.yaml"

# get netplan file
with open(NETPLAN, "r") as stream:
    try:
        netplan_config = yaml.safe_load(stream)
        print("netplan_config = " + json.dumps(netplan_config))
        stream.close()
    except yaml.YAMLError as e:
        print(f"error = {str(e)}")

# test 1
if "ethernets" in netplan_config["network"]:
    print("mark1")
else:
    print("mark2")

# test 2
if "ethernets1" in netplan_config["network"]:
    print("mark3")
else:
    print("mark4")
