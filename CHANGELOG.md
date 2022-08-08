# Netplan GUI Changelog

## 1.0.3 (8/7/2022)

- update packages
- replace [web.py](https://github.com/webpy/webpy) with [FastAPI](https://github.com/tiangolo/fastapi) for REST service

## 1.0.2 (3/12/2022)

- update packages
  - kendo button: `[primary]="true"` became `themeColor="primary"`
  - use rxjs `firstValueFrom` instead of deprecated `toPromise`
- update installation instructions (was not correct before)

## 1.0.1 (1/2/2022)

- *Bug*: in `netplan-gui.service.ts`, `SERVER` should have been `localhost`

## 1.0.0 (9/26/2021)

- project converted from kendo mobile (jQuery) to Angular
