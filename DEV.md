# Notes for Developers

## Bench Testing

### app

- `npm i -g @angular/cli`
- `ng serve`

### REST

- install regular packages mentioned in `INSTALL.md`
- `pip install "uvicorn[standard]"`
- `cd src/assets/rest`
- `sudo uvicorn rest:app --reload --host 0.0.0.0 --port 8080`

## Build Release

- `npm run build`
- zip `dist/netplan-gui`
- upload ZIP as new tag for project [releases](https://github.com/xinthose/Netplan-GUI/releases)

## Update Packages

- `npm install -g npm-check-updates`
- `ncu -u`
- `npm i --force`

## Troubleshooting

- `ERROR in The Angular Compiler requires TypeScript >=4.4.2 and <4.6.0 but 4.62 was found instead.`
  - `npm i typescript@">=4.4.2 <4.6.0"`
