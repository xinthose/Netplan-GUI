# Netplan GUI Changelog

## 1.0.4 (8/31/2022)

- *Bug*: in file `models.py`, use python `List` instead of `list` to allow for backwards compatibility for python versions lower than 3.9: [PEP 585](https://docs.python.org/3/whatsnew/3.9.html#type-hinting-generics-in-standard-collections)

## 1.0.3 (8/7/2022)

- update packages
- replace [web.py](https://github.com/webpy/webpy) with [FastAPI](https://github.com/tiangolo/fastapi) for REST service
- remove Station Wi-Fi, focus on netplan configuration instead

## 1.0.2 (3/12/2022)

- update packages
  - kendo button: `[primary]="true"` became `themeColor="primary"`
  - use rxjs `firstValueFrom` instead of deprecated `toPromise`
- update installation instructions (was not correct before)

## 1.0.1 (1/2/2022)

- *Bug*: in file `netplan-gui.service.ts`, `SERVER` should have been `localhost`

## 1.0.0 (9/26/2021)

- project converted from kendo mobile (jQuery) to Angular
