#!/usr/bin/python

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
if hasattr(netplan_config["network"], "ethernets"):
    print("mark1")
else:
    print("mark2")

# test 2
if netplan_config["network"]["ethernets1"]:
    print("mark3")
else:
    print("mark4")
