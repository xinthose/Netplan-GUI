# Notes for Developers

## Create App

- `npm i -g @angular/cli`
- `ng new netplan-gui`
- `npm i change @types/chance`

## Bench Testing

### app

- `ng serve`

### REST

- install regular packages mentioned in `INSTRUCTIONS.md`
- `pip install "uvicorn[standard]"`
- `cd src/assets/rest`
- `sudo uvicorn rest:app --reload --host 0.0.0.0 --port 8080`

## Build Release

- `npm run build`
- zip the files inside this folder: `dist/netplan-gui/browser` and name it `netplan-gui`
- upload `netplan-gui.zip` as a new release in project [releases](https://github.com/xinthose/Netplan-GUI/releases) along with the file `3rdpartylicenses.txt`

## Update Packages

- `npm install -g npm-check-updates`
- `ncu -u`
- `npm i --force`

## Package Documentation

- [Kendo UI for Angular](https://www.telerik.com/kendo-angular-ui/components/)
- [Bootstrap](https://getbootstrap.com)
- [FastAPI](https://fastapi.tiangolo.com/)

## Troubleshooting

- `ERROR in The Angular Compiler requires TypeScript >=4.4.2 and <4.6.0 but 4.62 was found instead.`
  - `npm i typescript@">=4.4.2 <4.6.0"`
