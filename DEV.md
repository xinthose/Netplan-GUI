# Notes for Developer

## Build Release

- `npm run build`

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

## Troubleshooting

- `ERROR in The Angular Compiler requires TypeScript >=4.4.2 and <4.6.0 but 4.62 was found instead.`
  - `npm i typescript@">=4.4.2 <4.6.0"`
