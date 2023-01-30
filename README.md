# Netplan-GUI

## About

- Graphical User Interface to configure Netplan YAML file on Ubuntu 18+ specifically (other linux OS should work too)
  - Netplan Documentation: <https://netplan.io/>
- Front end uses Angular and the back end uses Python
  - pm2 is used to run two apps:
    - Node.js express app serving the compiled Angular application
    - python3 REST web service (FastAPI)
  - *Note*: the front end uses non-open source Kendo UI widgets: grid
- Read [`INSTALL.md`](https://github.com/xinthose/Netplan-GUI/blob/master/INSTALL.md) for installation instructions

## Features

- Can add multiple IP addresses with different subnets to a single NIC/bridge
- Ability to setup a bridge with two NICs attached to it
- Can individually setup network on two different NICs
- Can setup network to connect to an existing Wi-Fi network
- Can run helpful commands (`reboot`, `shutdown`, clear logs, change log file persmissions so that they can be viewed remotely over apache)
- mobile friendly and works in all modern browsers

![Screenshot](https://github.com/xinthose/Netplan-GUI/raw/master/ref/screenshot.png)

## Use Cases

- linux unattended kiosk that needs easy network configuration
  - especially for those without programming knowledge
