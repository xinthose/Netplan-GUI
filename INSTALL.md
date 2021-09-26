# Installation

## Requirements

- Python version 3
- Linux Operating System that uses Netplan to configure its network

## Install software

- Operating System: Linux using netplan
- `sudo apt update`
- `sudo apt install npm nodejs node-gyp php libapache2-mod-php apache2-utils`
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

## Install Application

- `cd client`
- `npm i`
- `npm run build`
- `sudo mkdir /var/www/html/netplan-gui /var/www/html/logs`
- `sudo cp -r dist/netplan-gui/* /var/www/html/netplan-gui`
- install node packages for server
  - `cd /var/www/html/netplan-gui`
  - `npm i express compression`
- `pm2 start pm2.json`
- `pm2 save`
- `python3 /var/www/html/netplan-gui/assets/rest.py`
- webpage can now be accessed `http://localhost:3000`
- set `netplan-gui` to run automatically on bootup
  - `sudo crontab -e`
  - add this line: `@reboot pm2 resurrect && python3 /var/www/html/netplan-gui/assets/rest.py`
