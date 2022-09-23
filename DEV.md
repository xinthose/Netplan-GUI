# Notes for Developers

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
