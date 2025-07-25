# Netplan-GUI

## About

- Graphical User Interface to configure Netplan YAML file on Ubuntu 18+ specifically (other linux OS should work too)
  - Netplan Documentation: <https://netplan.io/>
- Front end uses Angular and the back end uses Python
  - [pm2](https://pm2.keymetrics.io/) is used to run two apps:
    - [Node.js](https://nodejs.org/en/) [express](https://expressjs.com/) app serving the compiled Angular application
    - [REST](https://www.geeksforgeeks.org/rest-api-introduction/#) web service using [FastAPI](https://github.com/tiangolo/fastapi)
- See [`INSTRUCTIONS.md`](https://github.com/xinthose/Netplan-GUI/blob/master/INSTRUCTIONS.md) for installation instructions.

## Features

- Can add multiple IP addresses with different subnets to a single NIC/bridge.
- Ability to setup a bridge with two NICs attached to it.
- Can individually setup network on two different NICs.
- Can setup network to connect to an existing Wi-Fi network.
- Can run helpful commands: reboot, shutdown, clear logs, change log file persmissions so that they can be viewed remotely over apache, view your device's network with the linux command [`ip a`](https://linux.die.net/man/8/ip).
- Mobile friendly and works in all modern browsers (see [`.browserslistrc`](https://github.com/xinthose/Netplan-GUI/blob/master/.browserslistrc))

![Screenshot](https://github.com/xinthose/Netplan-GUI/raw/master/ref/screenshot_network.png)
&nbsp;
![Screenshot](https://github.com/xinthose/Netplan-GUI/raw/master/ref/screenshot_commands.png)

## Use Cases

- Linux unattended kiosk that needs easy network configuration via the browser (especially for those without programming knowledge)

## Testing Matrix

| **SW Vers**   | **OS Tested** |
| ------------- | ------------- |
| 1.3.0         | Ubuntu 24     |
| 1.1.0, 1.2.0  | Ubuntu 23     |
| 1.0.0 - 1.0.5 | Ubuntu 22     |

## 3rd Party Licenses

- This software cannot be used commercially due to the use of [Kendo UI](https://www.telerik.com/kendo-angular-ui) widgets (unless you buy a license)
- see the file `3rdpartylicenses.txt` for the software release version for more information
