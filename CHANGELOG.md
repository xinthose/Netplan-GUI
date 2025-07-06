# Netplan GUI Changelog

## 1.3.0 (7/5/2025) - [Issue #12](https://github.com/xinthose/Netplan-GUI/issues/12))

- update packages (Angular 20)

## 1.2.0 (11/24/2023) - [Issue #11](https://github.com/xinthose/Netplan-GUI/issues/11))

- update packages (Angular 17)
- **Feat**: in commands, add new buttons "Get Ethernet 1 Status", "Get Ethernet 2 Status", "Get 'ip a'"
- **Feat**: add DHCP option for Ethernet 1 and 2
- *Bug*: in file `rest.py` do not use `hasattr`, as `yaml.safe_load` returns a dictionary and not a list ([SO Post](https://stackoverflow.com/a/77538548/4056146)) - (
- *Bug*: Only show error popup in `http-error.interceptor.ts`
- *Bug*: allow Submit button to be clicked on Ethernet port if it was disabled
- Style changes to GUI

## 1.1.0 (7/4/2023)

- update packages (Angular 16)
- remove popup warning about the MAC address being changed (doesn't always work right and is annoying in my opinion)
- replace `mdb-angular-ui-kit` with `bootstrap` (more mainstream)
- allow REST app to run in Ubuntu 23 due to move away from `pip install`

## 1.0.5 (1/29/2023)

- in `network` component, add a Mac Address field for each interface; use more generic `eth0` and `eth1` names instead of hardware specific names like `enp3s0` and `enp4s0`, which can change between devices
- in file `rest.py` add `macaddress` and `set-name` to ethernet interfaces, rename them to `eth0` and `eth1`
- in file `models.py` add `mac`, `mac1`, `mac2`
- update packages

## 1.0.4 (8/31/2022)

- *Bug*: in file `models.py`, use python `List` instead of `list` to allow for backwards compatibility for python versions lower than 3.9: [PEP 585](https://docs.python.org/3/whatsnew/3.9.html#type-hinting-generics-in-standard-collections) ([Issue #9](https://github.com/xinthose/Netplan-GUI/issues/9))

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

- *Bug*: in file `netplan-gui.service.ts`, `SERVER` should have been `localhost` ([Issue #1](https://github.com/xinthose/Netplan-GUI/issues/1))

## 1.0.0 (9/26/2021)

- project converted from kendo mobile (jQuery) to Angular
