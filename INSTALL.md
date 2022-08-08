# Installation

## Requirements

- Python version 3
  - Check with this command `python3 --version`
- Linux Operating System that uses Netplan to configure its network
  - Directory `/etc/netplan` should exist in your file system

## Install Linux Software

- `sudo apt update`
- `sudo apt install npm nodejs php libapache2-mod-php apache2-utils`
- `sudo pip install simplejson pyyaml python-benedict fastapi gunicorn`
- `npm i -g pm2`

## Install Netplan GUI

- download [latest release](https://github.com/xinthose/Netplan-GUI/releases) of `netplan-gui` and unzip folder
- `sudo su` // become root user
- copy the folder `netplan-gui` inside it to this directory `/var/www/html`
  - `cd ~/Downloads/netplan-gui-*`  // name of folder may be different if you have multiple versions downloaded
  - `cp -r netplan-gui /var/www/html`  // copy folder
- `cd /var/www/html/netplan-gui`  // change directories
- `npm i express compression`  // install packages required for application to run
- `pm2 start pm2.json`  // start client app
- `cd assets/rest`  // pm2 start command needs to be run from the same directory as the app, so change directories to it
- `pm2 start pm2.json`  // start REST app
  - both apps should show a status of `online`, consult Troubleshooting steps below if it is `errored`
- `pm2 save`  // save these applications so that `pm2 resurrect` can easily bring them up again on boot
- `chmod -R 777 /etc/netplan`  // allow 01-network-manager-all.yaml file to be changed by non-root app
- Netplan GUI can now be access locally from this URL: <http://localhost:3000>
  - change `localhost` to the IP address of the computer to accesss it remotely

### Run services on boot

- `sudo su` // become root if you are not already
- `crontab -e`
- add this line to the end of your file:

```text
@reboot pm2 resurrect
```

- if the `pm2 save` command was run previously with the `netplan-gui` and `netplan-gui-rest` applications saved, the `pm2 resurrect` command will bring them back up after a reboot

## Updating to New Version

- TODO

## Troubleshooting

- TODO
