# Installation

## Requirements

- Python version 3
  - Check with this command `python3 --version`
- Linux Operating System that uses Netplan to configure its network
  - Directory `/etc/netplan` should exist in your file system

## Install Linux Software

- `sudo apt update`
- `sudo apt install npm nodejs php libapache2-mod-php apache2-utils`
- `sudo pip install mysql-connector-python simplejson pyyaml python-benedict web.py`
- `npm i -g pm2`

## Setup MySQL

- login to mysql server
  - `mysql -u root -p`
- `create database NetplanConfig;`
- `CREATE USER 'user1'@'localhost' IDENTIFIED BY 'superleet';`
- `GRANT ALL PRIVILEGES ON NetplanConfig.* TO 'user1'@'localhost';`
- `FLUSH PRIVILEGES;`
- copy, paste, and run text in `mysql_tables.sql`
- `exit;`

## Install Netplan GUI

- download latest release of `netplan-gui` and unzip folder
  - <https://github.com/xinthose/Netplan-GUI/releases>
- copy the folder `netplan-gui` inside it to this directory `/var/www/html`
  - `cd ~/Downloads/netplan-gui-*`  // name of folder may be different if you have multiple versions downloaded
  - `sudo cp -r netplan-gui /var/www/html`  // copy folder
- `cd /var/www/html/netplan-gui`  // change directories
- `sudo npm i express compression`  // install packages required for application to run
- `pm2 start pm2.json`
  - both should show a status of `online`, consult Troubleshooting steps below if it is `errored`
- `sudo chmod -R 777 /etc/netplan`  // allow 01-network-manager-all.yaml file to be changed by non-root app

## Updating to New Version

- TODO

## Troubleshooting

- TODO
