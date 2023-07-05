# Installation

## Requirements

- Python version 3.7+ ([FastAPI Requirements](https://fastapi.tiangolo.com/#requirements))
  - Check with this command `python3 --version`
- Linux Operating System that uses Netplan to configure its network
  - Directory `/etc/netplan` should exist in your file system

## Install Linux Software

- `sudo apt update`
- `sudo apt install npm nodejs php libapache2-mod-php apache2-utils`
- `sudo pip install fastapi gunicorn simplejson`
  - If using Ubuntu 23 / Debian 11+, run this command instead: `sudo apt install python3-fastapi python3-gunicorn python3-simplejson`
- `npm i -g pm2`

## Install Netplan GUI

- download [latest release](https://github.com/xinthose/Netplan-GUI/releases) of `netplan-gui` and unzip folder
- `sudo su` // become root user
- copy the folder `netplan-gui` inside it to this directory `/var/www/html`
  - `cd ~/Downloads`
  - `cp -r netplan-gui /var/www/html`  // copy folder
- `cd /var/www/html/netplan-gui`  // change directories
- `npm i express compression`  // install packages required for application to run
- `pm2 start pm2.json`  // start client app
- `cd assets/rest`  // pm2 start command needs to be run from the same directory as the app, so change directories to it
- `pm2 start pm2.json`  // start REST app
  - both apps should show a status of `online`, consult [Troubleshooting](#troubleshooting) steps below if it is `errored`
- `pm2 save`  // save these applications so that `pm2 resurrect` can easily bring them up again on boot
- `chmod -R 777 /etc/netplan`  // allow 01-network-manager-all.yaml file to be changed by non-root app
- Netplan GUI can now be accessed locally from this URL: <http://localhost:3000>
  - change `localhost` to the IP address of the computer to accesss it remotely

### Run services on boot

- `sudo su` // become root if you are not already
- `crontab -e`
- add this line to the end of your file:

```text
@reboot pm2 resurrect
```

- if the `pm2 save` command was run previously with the `netplan-gui` and `netplan-gui-rest` applications saved, the `pm2 resurrect` command will bring them back up after a reboot

### Notes

- if the name and location of your netplan configuration file is different than this: `/etc/netplan/01-network-manager-all.yaml`, change it in this file: `/var/www/html/netplan-gui/assets/rest/rest.py` >> variable: `NETPLAN`
  - if the file is changed, you need to reboot the pm2 service
    - `pm2 ls`  // find the ID of the app named "netplan-gui-rest"
    - `pm2 restart #` // # is the ID just found
- log files for the application can be viewed in your browser at <http://localhost/logs>
- to find the MAC address for your network interfaces, run this command: `ifconfig`; your MAC address for the device will be the value for `ether`

```shell
adam@adam-desktop:~/Downloads$ ifconfig
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.4.31  netmask 255.255.252.0  broadcast 192.168.7.255
        inet6 fe80::264b:feff:fee2:1c4a  prefixlen 64  scopeid 0x20<link>
        ether 24:4b:fe:e2:1c:4a  txqueuelen 1000  (Ethernet)
        RX packets 1440037  bytes 2097934652 (2.0 GB)
        RX errors 0  dropped 284  overruns 0  frame 0
        TX packets 569692  bytes 57722464 (57.7 MB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 11601  bytes 16936595 (16.9 MB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 11601  bytes 16936595 (16.9 MB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

wlp3s0: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500
        ether 9c:29:76:03:e2:4c  txqueuelen 1000  (Ethernet)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

## Updating to New Version

- TODO

## Troubleshooting

- consult the following log files for errors (they can be viewed in a browser on the same PC at <http://localhost/logs>)
  - `/var/www/html/logs/netplan-gui-error.log`
  - `/var/www/html/logs/netplan-gui-rest-error.log`
  - `/var/www/html/logs/netplan-gui-rest.log`
