# Installation

## Requirements

- Python version 3
- Linux Operating System that uses Netplan to configure its network

## Install software

- Operating System: Linux using netplan
- `sudo apt update`
- `sudo apt install npm nodejs nodejs-dev node-gyp php libapache2-mod-php apache2-utils libssl1.0-dev`
- `pip install mysql-connector simplejson pyyaml python-benedict`

## Setup MySQL

- login to mysql server
  - `mysql -u root -p`
- `create database NetplanConfig;`
- `CREATE USER 'user1'@'localhost' IDENTIFIED BY 'superleet';
- `GRANT ALL PRIVILEGES ON NetplanConfig.* TO 'user1'@'localhost';`
- `FLUSH PRIVILEGES;`
- copy, paste, and run text in `mysql_tables.sql`
- `exit;`

## Install Application

- `cd client`
- `npm i`
- `npm run build`
- copy `package.json` to `dist/admin` folder
- `sudo mkdir /var/www/html/netplan-gui`
- `sudo cp -R dist/admin/* /var/www/html/netplan-gui`
- install node packages for production: `cd /var/www/html/netplan-gui` --> `npm i`
- `pm2 start pm2.json`
- `pm2 save`
- webpage can now be accessed `http://localhost:3000`
- set netplan-gui to run automatically on bootup
  - as root, run `crontab -e`
  - add this line: `@reboot pm2 resurrect && python3 /var/www/html/netplan-gui/assets/rest.py`
