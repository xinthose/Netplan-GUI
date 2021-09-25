# Installation

## Install software

- Operating System: Linux using netplan
- `sudo apt update`
- `sudo apt install npm nodejs nodejs-dev node-gyp php libapache2-mod-php apache2-utils libssl1.0-dev`
- `pip install mysql-connector simplejson pyyaml python-benedict`

## MySQL

- login to mysql server
  - `mysql -u root -p`
- `create database NetplanConfig;`
- `CREATE USER 'user1'@'localhost' IDENTIFIED BY 'superleet';
- `GRANT ALL PRIVILEGES ON NetplanConfig.* TO 'user1'@'localhost';`
- `FLUSH PRIVILEGES;`
- copy, paste, and run text in `mysql_tables.sql`
- `exit;`

## Build client

- `cd client`
- `npm i`
- `npm run build`

## Move files

- `sudo mkdir /var/www/html/admin`
- copy files in `front_end` to `/var/www/html/admin`
- run server in `back_end`
  - `python rest.py`

## Access Admin Webpage

- enter this URL in a browser: `http://localhost/admin`
