# Installation

## Install software

- Operating System: Linux using netplan
- `sudo apt update`
- `sudo apt install php libapache2-mod-php apache2-utils mysql-server`
- `pip install simplejson pathlib mysql-connector pyyaml`

## MySQL

- login to server
  - `mysql -u root -p`
- `create database NetplanConfig;`
- copy, paste, and run text in `mysql_tables.sql`
- `exit;`

## Move files

- `sudo mkdir /var/www/html/admin`
- copy files in `front_end` to `/var/www/html/admin`
- run server in `back_end`
  - `python rest.py`

## Access Admin Webpage

- enter this URL in a browser: `http://localhost/admin`
