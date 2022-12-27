import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

// services
import { NetplanGUIService } from "../netplan-gui.service";
import { NotificationService } from "@progress/kendo-angular-notification";

// progress
import { GridDataResult } from "@progress/kendo-angular-grid";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";

// interfaces
import { GridNetworkIntf } from "../interfaces/GridNetworkIntf";
import { eBoxNetworkIntf } from "../interfaces/linuxNetworkIntf";
import { SubnetDropdownIntf } from "../interfaces/SubnetDropdownIntf";

// Icons
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

// other
import { NGXLogger } from "ngx-logger";
import * as Chance from 'chance';

@Component({
  selector: "app-network",
  templateUrl: "./network.component.html",
  styleUrls: ["./network.component.scss"],
})
export class NetworkComponent implements OnInit {
  debug: boolean = true;
  loading: boolean = false;
  loadingBridge: boolean = false;
  loadingEth1: boolean = false;
  loadingEth2: boolean = false;
  loadingWiFi: boolean = false;
  private ipRegex: RegExp = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  // forms
  public BridgeForm: FormGroup;
  public BridgeGridForm!: FormGroup;
  public Eth1Form: FormGroup;
  public Eth1GridForm!: FormGroup;
  public Eth2Form: FormGroup;
  public Eth2GridForm!: FormGroup;
  public WiFiForm: FormGroup;
  public WiFiGridForm!: FormGroup;
  // grids
  subnetMaskCidr: Array<SubnetDropdownIntf> = [{
    subnetMask: "255.255.255.255",
    cidr: 32
  },
  {
    subnetMask: "255.255.255.254",
    cidr: 31
  },
  {
    subnetMask: "255.255.255.252",
    cidr: 30
  },
  {
    subnetMask: "255.255.255.248",
    cidr: 29
  },
  {
    subnetMask: "255.255.255.240",
    cidr: 28
  },
  {
    subnetMask: "255.255.255.224",
    cidr: 27
  },
  {
    subnetMask: "255.255.255.192",
    cidr: 26
  },
  {
    subnetMask: "255.255.255.128",
    cidr: 25
  },
  {
    subnetMask: "255.255.255.0",
    cidr: 24
  },
  {
    subnetMask: "255.255.254.0",
    cidr: 23
  },
  {
    subnetMask: "255.255.252.0",
    cidr: 22
  },
  {
    subnetMask: "255.255.248.0",
    cidr: 21
  },
  {
    subnetMask: "255.255.240.0",
    cidr: 20
  },
  {
    subnetMask: "255.255.224.0",
    cidr: 19
  },
  {
    subnetMask: "255.255.192.0",
    cidr: 18
  },
  {
    subnetMask: "255.255.128.0",
    cidr: 17
  },
  {
    subnetMask: "255.255.0.0",
    cidr: 16
  },
  {
    subnetMask: "255.254.0.0",
    cidr: 15
  },
  {
    subnetMask: "255.252.0.0",
    cidr: 14
  },
  {
    subnetMask: "255.248.0.0",
    cidr: 13
  },
  {
    subnetMask: "255.240.0.0",
    cidr: 12
  },
  {
    subnetMask: "255.224.0.0",
    cidr: 11
  },
  {
    subnetMask: "255.192.0.0",
    cidr: 10
  },
  {
    subnetMask: "255.128.0.0",
    cidr: 9
  },
  {
    subnetMask: "255.0.0.0",
    cidr: 8
  },
  {
    subnetMask: "254.0.0.0",
    cidr: 7
  },
  {
    subnetMask: "252.0.0.0",
    cidr: 6
  },
  {
    subnetMask: "248.0.0.0",
    cidr: 5
  },
  {
    subnetMask: "240.0.0.0",
    cidr: 4
  },
  {
    subnetMask: "224.0.0.0",
    cidr: 3
  },
  {
    subnetMask: "192.0.0.0",
    cidr: 2
  },
  {
    subnetMask: "128.0.0.0",
    cidr: 1
  },
  {
    subnetMask: "0.0.0.0",
    cidr: 0
  }
  ];
  public sort: SortDescriptor[] = [
    {
      field: "address",
      dir: "asc"
    }
  ];
  /// bridge grid
  bridgeGridData: Array<GridNetworkIntf> = [];
  bridgeGridView!: GridDataResult;
  bridgeGridRow: number = 0;
  bridgeGridEnabled: boolean = false;
  bridgeGridEditing: boolean = false;
  /// eth1 grid
  eth1GridData: Array<GridNetworkIntf> = [];
  eth1GridView!: GridDataResult;
  eth1GridRow: number = 0;
  eth1GridEnabled: boolean = false;
  eth1GridEditing: boolean = false;
  /// eth2 grid
  eth2GridData: Array<GridNetworkIntf> = [];
  eth2GridView!: GridDataResult;
  eth2GridRow: number = 0;
  eth2GridEnabled: boolean = false;
  eth2GridEditing: boolean = false;
  /// wifi grid
  wifiGridData: Array<GridNetworkIntf> = [];
  wifiGridView!: GridDataResult;
  wifiGridRow: number = 0;
  wifiGridEnabled: boolean = false;
  wifiGridEditing: boolean = false;
  // icons
  faPencilAlt = faPencilAlt;

  constructor(
    private netplanguiService: NetplanGUIService,
    private notificationService: NotificationService,
    private logger: NGXLogger,
    private formBuilder: FormBuilder,
  ) {
    // setup forms
    this.BridgeForm = this.formBuilder.group({
      enabled: [false, Validators.requiredTrue],
      gateway: ["", Validators.pattern(this.ipRegex)],
      nameserver1: ["", Validators.pattern(this.ipRegex)],
      nameserver2: ["", Validators.pattern(this.ipRegex)],
      addresses: [[], Validators.required],
    });
    this.Eth1Form = this.formBuilder.group({
      enabled: false,
      gateway: ["", Validators.pattern(this.ipRegex)],
      nameserver1: ["", Validators.pattern(this.ipRegex)],
      nameserver2: ["", Validators.pattern(this.ipRegex)],
      addresses: [[], Validators.required],
    });
    this.Eth2Form = this.formBuilder.group({
      enabled: false,
      gateway: ["", Validators.pattern(this.ipRegex)],
      nameserver1: ["", Validators.pattern(this.ipRegex)],
      nameserver2: ["", Validators.pattern(this.ipRegex)],
      addresses: [[], Validators.required],
    });
    this.WiFiForm = this.formBuilder.group({
      enabled: false,
      gateway: ["", Validators.pattern(this.ipRegex)],
      nameserver1: ["", Validators.pattern(this.ipRegex)],
      nameserver2: ["", Validators.pattern(this.ipRegex)],
      ssid: ["", Validators.required],
      ssidPassword: "",
      addresses: [[], Validators.required],
    });

    // subscribe to form changes
    this.BridgeForm.get("enabled")!.valueChanges.subscribe((enabled: boolean) => {
      this.bridgeGridEnabled = enabled;
      if (!enabled) {
        // reset fields
        this.BridgeForm.controls["gateway"].patchValue("");
        this.BridgeForm.controls["nameserver1"].patchValue("");
        this.BridgeForm.controls["nameserver2"].patchValue("");
        this.BridgeForm.controls["addresses"].patchValue([]);
        this.bridgeGridData = [];
      }

    });
    this.Eth1Form.get("enabled")!.valueChanges.subscribe((enabled: boolean) => {
      this.eth1GridEnabled = enabled;
      if (enabled) {
        // enable required field
        this.Eth1Form.controls["addresses"].enable();

        // clear fake data
        this.eth1GridData = [];
      } else {
        // reset fields
        this.Eth1Form.controls["gateway"].patchValue("");
        this.Eth1Form.controls["nameserver1"].patchValue("");
        this.Eth1Form.controls["nameserver2"].patchValue("");
        this.Eth1Form.controls["addresses"].patchValue([]);
        this.eth1GridData = [];

        // disable required field
        this.Eth1Form.controls["addresses"].disable();

        // push fake data to allow submit
        this.eth1GridData.push({
          "guid": "",
          "address": "",
          "cidr": 1,
        });
      }
    });
    this.Eth2Form.get("enabled")!.valueChanges.subscribe((enabled: boolean) => {
      this.eth2GridEnabled = enabled;
      if (enabled) {
        // enable required field
        this.Eth2Form.controls["addresses"].enable();

        // clear fake data
        this.eth2GridData = [];
      } else {
        // reset fields
        this.Eth2Form.controls["gateway"].patchValue("");
        this.Eth2Form.controls["nameserver1"].patchValue("");
        this.Eth2Form.controls["nameserver2"].patchValue("");
        this.Eth2Form.controls["addresses"].patchValue([]);
        this.eth2GridData = [];

        // disable required field
        this.Eth2Form.controls["addresses"].disable();

        // push fake data to allow submit
        this.eth2GridData.push({
          "guid": "",
          "address": "",
          "cidr": 1,
        });
      }
    });
    this.WiFiForm.get("enabled")!.valueChanges.subscribe((enabled: boolean) => {
      this.wifiGridEnabled = enabled;
      if (enabled) {
        // enable required fields
        this.WiFiForm.controls["ssid"].enable();
        this.WiFiForm.controls["addresses"].enable();

        // clear fake data
        this.wifiGridData = [];
      } else {
        // reset fields
        this.WiFiForm.controls["gateway"].patchValue("");
        this.WiFiForm.controls["nameserver1"].patchValue("");
        this.WiFiForm.controls["nameserver2"].patchValue("");
        this.WiFiForm.controls["ssid"].patchValue("");
        this.WiFiForm.controls["ssidPassword"].patchValue("");
        this.WiFiForm.controls["addresses"].patchValue([]);
        this.wifiGridData = [];

        // disable required fields
        this.WiFiForm.controls["ssid"].disable();
        this.WiFiForm.controls["addresses"].disable();

        // push fake data to allow submit
        this.wifiGridData.push({
          "guid": "",
          "address": "",
          "cidr": 1,
        });
      }
    });
  }

  async ngOnInit() {
    try {
      // set active class in navbar
      setTimeout(() => {
        this.netplanguiService.networkSelected$.emit(true);
      });

      // get eBox network
      await this.refreshNetwork();
    } catch (error: any) {
      this.logger.error("NetworkComponent.ngAfterViewChecked >> error = " + error);
    }
  }

  async refreshNetwork() {
    try {
      // show loading icon
      this.loading = true;

      // get eBox network
      const eBoxNetwork: eBoxNetworkIntf = await this.netplanguiService.getNetwork();

      // set form data
      this.BridgeForm.setValue({
        "enabled": eBoxNetwork.br0_addresses.length ? true : false,
        "gateway": eBoxNetwork.br0_gateway,
        "nameserver1": eBoxNetwork.br0_nameservers.length ? eBoxNetwork.br0_nameservers[0] : "",
        "nameserver2": eBoxNetwork.br0_nameservers.length > 1 ? eBoxNetwork.br0_nameservers[1] : "",
        "addresses": eBoxNetwork.br0_addresses,
      });
      this.Eth1Form.setValue({
        "enabled": eBoxNetwork.eth1_addresses.length ? true : false,
        "gateway": eBoxNetwork.eth1_gateway,
        "nameserver1": eBoxNetwork.eth1_nameservers.length ? eBoxNetwork.eth1_nameservers[0] : "",
        "nameserver2": eBoxNetwork.eth1_nameservers.length > 1 ? eBoxNetwork.eth1_nameservers[1] : "",
        "addresses": eBoxNetwork.eth1_addresses,
      });
      this.Eth2Form.setValue({
        "enabled": eBoxNetwork.eth2_addresses.length ? true : false,
        "gateway": eBoxNetwork.eth2_gateway,
        "nameserver1": eBoxNetwork.eth2_nameservers.length ? eBoxNetwork.eth2_nameservers[0] : "",
        "nameserver2": eBoxNetwork.eth2_nameservers.length > 1 ? eBoxNetwork.eth2_nameservers[1] : "",
        "addresses": eBoxNetwork.eth2_addresses,
      });
      this.WiFiForm.setValue({
        "enabled": eBoxNetwork.wifi_addresses.length ? true : false,
        "gateway": eBoxNetwork.wifi_gateway,
        "nameserver1": eBoxNetwork.wifi_nameservers.length ? eBoxNetwork.wifi_nameservers[0] : "",
        "nameserver2": eBoxNetwork.wifi_nameservers.length > 1 ? eBoxNetwork.wifi_nameservers[1] : "",
        "ssid": eBoxNetwork.wifi_ssid,
        "ssidPassword": eBoxNetwork.wifi_ssid_password,
        "addresses": eBoxNetwork.wifi_addresses,
      });

      // reset forms
      this.BridgeForm.markAsPristine();
      this.BridgeForm.markAsUntouched();
      this.Eth1Form.markAsPristine();
      this.Eth1Form.markAsUntouched();
      this.Eth2Form.markAsPristine();
      this.Eth2Form.markAsUntouched();
      this.WiFiForm.markAsPristine();
      this.WiFiForm.markAsUntouched();

      // clear IP address grid data
      this.bridgeGridData = [];
      this.eth1GridData = [];
      this.eth2GridData = [];
      this.wifiGridData = [];

      // set IP address grid data
      for (const data of eBoxNetwork.br0_addresses) {
        const parts: Array<string> = data.split("/");

        if (parts.length == 2) {
          this.bridgeGridData.push({
            "guid": Chance().guid(),
            "address": parts[0],
            "cidr": parseInt(parts[1]),
          })
        }
      }
      for (const data of eBoxNetwork.eth1_addresses) {
        const parts: Array<string> = data.split("/");

        if (parts.length == 2) {
          this.eth1GridData.push({
            "guid": Chance().guid(),
            "address": parts[0],
            "cidr": parseInt(parts[1]),
          })
        }
      }
      for (const data of eBoxNetwork.eth2_addresses) {
        const parts: Array<string> = data.split("/");

        if (parts.length == 2) {
          this.eth2GridData.push({
            "guid": Chance().guid(),
            "address": parts[0],
            "cidr": parseInt(parts[1]),
          })
        }
      }
      for (const data of eBoxNetwork.wifi_addresses) {
        const parts: Array<string> = data.split("/");

        if (parts.length == 2) {
          this.wifiGridData.push({
            "guid": Chance().guid(),
            "address": parts[0],
            "cidr": parseInt(parts[1]),
          })
        }
      }

      // show popup
      this.notificationService.show({
        content: "Data refreshed.",
        cssClass: "notification",
        position: { horizontal: "center", vertical: "top" },  // left/center/right, top/bottom
        type: { style: "success", icon: false },  // none, success, error, warning, info
        hideAfter: 2000,  // milliseconds
        animation: {
          type: "fade",
          duration: 150, // milliseconds (notif)
        },
      });

      // hide loading icon
      this.loading = false;
    } catch (error: any) {
      this.logger.error("NetworkComponent.refreshNetwork >> error = " + error);
      this.notificationService.show({
        content: error,
        closable: true,
        cssClass: "notification",
        position: { horizontal: "center", vertical: "top" },  // left/center/right, top/bottom
        type: { style: "error", icon: false },  // none, success, error, warning, info
        hideAfter: 10000,  // milliseconds
        animation: {
          type: "fade",
          duration: 150, // milliseconds (notif)
        },
      });
      this.loading = false;
    }
  }

  // Bridge Grid
  /* #region */

  async onSubmitBridge(e: any) {
    try {
      if (this.debug) {
        this.logger.debug("NetworkComponent.onSubmitBridge >> e.value = " + JSON.stringify(e.value));
      }

      // show loading icon
      this.loadingBridge = true;

      // build nameservers
      const nameservers: Array<string> = [];
      if (e.value.nameserver1) {
        nameservers.push(e.value.nameserver1);
      }
      if (e.value.nameserver2) {
        nameservers.push(e.value.nameserver2);
      }

      // send data
      await this.netplanguiService.submitBridge(e.value.gateway, e.value.addresses, nameservers);

      // show popup
      this.notificationService.show({
        content: "Bridge saved.  Please wait for settings to take affect.",
        cssClass: "notification",
        position: { horizontal: "center", vertical: "top" },  // left/center/right, top/bottom
        type: { style: "success", icon: false },  // none, success, error, warning, info
        hideAfter: 3000,  // milliseconds
        animation: {
          type: "fade",
          duration: 150, // milliseconds (notif)
        },
      });

      // hide loading icon
      this.loadingBridge = false;

      // reset form
      this.BridgeForm.markAsPristine();
      this.BridgeForm.markAsUntouched();
    } catch (error: any) {
      this.logger.error("NetworkComponent.onSubmitBridge >> error = " + error);
      this.notificationService.show({
        content: error,
        closable: true,
        cssClass: "notification",
        position: { horizontal: "center", vertical: "top" },  // left/center/right, top/bottom
        type: { style: "error", icon: false },  // none, success, error, warning, info
        hideAfter: 10000,  // milliseconds
        animation: {
          type: "fade",
          duration: 150, // milliseconds (notif)
        },
      });
      this.loadingBridge = false;
    }
  }

  public bridgeGridAdd({ sender }: any) {
    this.bridgeGridClose(sender);

    this.BridgeGridForm = this.formBuilder.group({
      guid: [Chance().guid()],
      address: ["", [Validators.required, Validators.pattern(this.ipRegex)]],
      cidr: ["", [Validators.required, Validators.min(1)]],
    });

    sender.addRow(this.BridgeGridForm);

    this.bridgeGridEditing = true;
  }

  public bridgeGridEdit({ sender, rowIndex, dataItem }: any) {
    if (this.debug) {
      this.logger.debug(JSON.stringify(dataItem))
    }
    this.bridgeGridClose(sender);

    this.BridgeGridForm = this.formBuilder.group({
      guid: [dataItem.guid],
      address: [dataItem.address, [Validators.required, Validators.pattern(this.ipRegex)]],
      cidr: [dataItem.cidr, [Validators.required, Validators.min(1)]],
    });

    this.bridgeGridRow = rowIndex;

    sender.editRow(rowIndex, this.BridgeGridForm);

    this.bridgeGridEditing = true;
  }

  public bridgeGridCancel({ sender, rowIndex }: any) {
    this.bridgeGridClose(sender, rowIndex);
  }

  public bridgeGridSave({ sender, rowIndex, formGroup, isNew }: any) {
    if (this.debug) {
      this.logger.debug("NetworkComponent.bridgeGridSave >> formGroup.value = " + JSON.stringify(formGroup.value));
    }

    // get data
    const data: GridNetworkIntf = formGroup.value;

    if (isNew) {
      // add record to array
      this.bridgeGridData.push(data);
    } else {
      const row: GridNetworkIntf | undefined = this.bridgeGridData.find((obj: GridNetworkIntf) => obj.guid == data.guid);

      if (row) {
        row.address = data.address;
        row.cidr = data.cidr;
      } else {
        this.logger.warn("NetworkComponent.bridgeGridRemove >> could not find row to update in grid data >> data = " + JSON.stringify(data));
      }
    }

    // update form
    this.updateBridgeFormAddresses();

    // close editing
    sender.closeRow(rowIndex);

    this.bridgeGridEditing = false;
  }

  public bridgeGridRemove({ dataItem }: any) {
    if (this.debug) {
      this.logger.debug("NetworkComponent.bridgeGridRemove >> dataItem = " + JSON.stringify(dataItem));
    }

    // get data
    const data: GridNetworkIntf = dataItem;

    // filter out removed row
    this.bridgeGridData = this.bridgeGridData.filter((obj: GridNetworkIntf) => {
      return obj.guid !== data.guid;
    });

    // update form
    this.updateBridgeFormAddresses();
  }

  private bridgeGridClose(grid: any, rowIndex = this.bridgeGridRow) {
    grid.closeRow(rowIndex);
    this.bridgeGridRow = 0;
    this.BridgeGridForm = undefined!;
    this.bridgeGridEditing = false;
  }

  private updateBridgeFormAddresses() {
    // build form data
    const addresses: Array<string> = [];
    for (const data of this.bridgeGridData) {
      addresses.push(data.address + "/" + data.cidr.toString());
    }

    // update form
    this.BridgeForm.controls["addresses"].patchValue(addresses);
  }

  /* #endregion */

  // Eth1 Grid
  /* #region */

  async onSubmitEth1(e: any) {
    try {
      if (this.debug) {
        this.logger.debug("NetworkComponent.onSubmitEth1 >> e.value = " + JSON.stringify(e.value));
      }

      // validate
      if (!this.validateNetwork()) {
        return;
      }

      // show loading icon
      this.loadingEth1 = true;

      // build nameservers
      const nameservers: Array<string> = [];
      if (e.value.nameserver1) {
        nameservers.push(e.value.nameserver1);
      }
      if (e.value.nameserver2) {
        nameservers.push(e.value.nameserver2);
      }

      // send data
      await this.netplanguiService.submitEth(1, e.value.gateway, e.value.addresses, nameservers, !this.eth1GridEnabled);

      // show popup
      this.notificationService.show({
        content: "Ethernet 1 saved.  Please wait for settings to take affect.",
        cssClass: "notification",
        position: { horizontal: "center", vertical: "top" },  // left/center/right, top/bottom
        type: { style: "success", icon: false },  // none, success, error, warning, info
        hideAfter: 3000,  // milliseconds
        animation: {
          type: "fade",
          duration: 150, // milliseconds (notif)
        },
      });

      // hide loading icon
      this.loadingEth1 = false;

      // reset form
      this.Eth1Form.markAsPristine();
      this.Eth1Form.markAsUntouched();
    } catch (error: any) {
      this.logger.error("NetworkComponent.onSubmitEth1 >> error = " + error);
      this.notificationService.show({
        content: error,
        closable: true,
        cssClass: "notification",
        position: { horizontal: "center", vertical: "top" },  // left/center/right, top/bottom
        type: { style: "error", icon: false },  // none, success, error, warning, info
        hideAfter: 10000,  // milliseconds
        animation: {
          type: "fade",
          duration: 150, // milliseconds (notif)
        },
      });
      this.loadingEth1 = false;
    }
  }

  public eth1GridAdd({ sender }: any) {
    this.eth1GridClose(sender);

    this.Eth1GridForm = this.formBuilder.group({
      guid: [Chance().guid()],
      address: ["", [Validators.required, Validators.pattern(this.ipRegex)]],
      cidr: ["", [Validators.required, Validators.min(1)]],
    });

    sender.addRow(this.Eth1GridForm);
    this.eth1GridEditing = true;
  }

  public eth1GridEdit({ sender, rowIndex, dataItem }: any) {
    if (this.debug) {
      this.logger.debug(JSON.stringify(dataItem))
    }
    this.eth1GridClose(sender);

    this.Eth1GridForm = this.formBuilder.group({
      guid: [dataItem.guid],
      address: [dataItem.address, [Validators.required, Validators.pattern(this.ipRegex)]],
      cidr: [dataItem.cidr, [Validators.required, Validators.min(1)]],
    });

    this.eth1GridRow = rowIndex;

    sender.editRow(rowIndex, this.Eth1GridForm);

    this.eth1GridEditing = true;
  }

  public eth1GridCancel({ sender, rowIndex }: any) {
    this.eth1GridClose(sender, rowIndex);
  }

  public eth1GridSave({ sender, rowIndex, formGroup, isNew }: any) {
    if (this.debug) {
      this.logger.debug("NetworkComponent.eth1GridSave >> formGroup.value = " + JSON.stringify(formGroup.value));
    }

    // get data
    const data: GridNetworkIntf = formGroup.value;

    if (isNew) {
      // add record to array
      this.eth1GridData.push(data);
    } else {
      const row: GridNetworkIntf | undefined = this.eth1GridData.find((obj: GridNetworkIntf) => obj.guid == data.guid);

      if (row) {
        row.address = data.address;
        row.cidr = data.cidr;
      } else {
        this.logger.warn("NetworkComponent.eth1GridRemove >> could not find row to update in grid data >> data = " + JSON.stringify(data));
      }
    }

    // update form
    this.updateEth1FormAddresses();

    // close editing
    sender.closeRow(rowIndex);
    this.eth1GridEditing = false;
  }

  public eth1GridRemove({ dataItem }: any) {
    if (this.debug) {
      this.logger.debug("NetworkComponent.eth1GridRemove >> dataItem = " + JSON.stringify(dataItem));
    }

    // get data
    const data: GridNetworkIntf = dataItem;

    // filter out removed row
    this.eth1GridData = this.eth1GridData.filter((obj: GridNetworkIntf) => {
      return obj.guid !== data.guid;
    });

    // update form
    this.updateEth1FormAddresses();
  }

  private eth1GridClose(grid: any, rowIndex = this.eth1GridRow) {
    grid.closeRow(rowIndex);
    this.eth1GridRow = 0;
    this.Eth1GridForm = undefined!;
    this.eth1GridEditing = false;
  }

  private updateEth1FormAddresses() {
    // build form data
    const addresses: Array<string> = [];
    for (const data of this.eth1GridData) {
      addresses.push(data.address + "/" + data.cidr.toString());
    }

    // update form
    this.Eth1Form.controls["addresses"].patchValue(addresses);
  }

  /* #endregion */

  // Eth2 Grid
  /* #region */

  async onSubmitEth2(e: any) {
    try {
      if (this.debug) {
        this.logger.debug("NetworkComponent.onSubmitEth2 >> e.value = " + JSON.stringify(e.value));
      }

      // validate
      if (!this.validateNetwork()) {
        return;
      }

      // show loading icon
      this.loadingEth2 = true;

      // build nameservers
      const nameservers: Array<string> = [];
      if (e.value.nameserver1) {
        nameservers.push(e.value.nameserver1);
      }
      if (e.value.nameserver2) {
        nameservers.push(e.value.nameserver2);
      }

      // send data
      await this.netplanguiService.submitEth(2, e.value.gateway, e.value.addresses, nameservers, !this.eth2GridEnabled);

      // show popup
      this.notificationService.show({
        content: "Ethernet 2 saved.  Please wait for settings to take affect.",
        cssClass: "notification",
        position: { horizontal: "center", vertical: "top" },  // left/center/right, top/bottom
        type: { style: "success", icon: false },  // none, success, error, warning, info
        hideAfter: 3000,  // milliseconds
        animation: {
          type: "fade",
          duration: 150, // milliseconds (notif)
        },
      });

      // hide loading icon
      this.loadingEth2 = false;

      // reset form
      this.Eth2Form.markAsPristine();
      this.Eth2Form.markAsUntouched();
    } catch (error: any) {
      this.logger.error("NetworkComponent.onSubmitEth2 >> error = " + error);
      this.notificationService.show({
        content: error,
        closable: true,
        cssClass: "notification",
        position: { horizontal: "center", vertical: "top" },  // left/center/right, top/bottom
        type: { style: "error", icon: false },  // none, success, error, warning, info
        hideAfter: 10000,  // milliseconds
        animation: {
          type: "fade",
          duration: 150, // milliseconds (notif)
        },
      });
      this.loadingEth2 = false;
    }
  }

  public eth2GridAdd({ sender }: any) {
    this.eth2GridClose(sender);

    this.Eth2GridForm = this.formBuilder.group({
      guid: [Chance().guid()],
      address: ["", [Validators.required, Validators.pattern(this.ipRegex)]],
      cidr: ["", [Validators.required, Validators.min(1)]],
    });

    sender.addRow(this.Eth2GridForm);

    this.eth2GridEditing = true;
  }

  public eth2GridEdit({ sender, rowIndex, dataItem }: any) {
    if (this.debug) {
      this.logger.debug(JSON.stringify(dataItem))
    }
    this.eth2GridClose(sender);

    this.Eth2GridForm = this.formBuilder.group({
      guid: [dataItem.guid],
      address: [dataItem.address, [Validators.required, Validators.pattern(this.ipRegex)]],
      cidr: [dataItem.cidr, [Validators.required, Validators.min(1)]],
    });

    this.eth2GridRow = rowIndex;

    sender.editRow(rowIndex, this.Eth2GridForm);

    this.eth2GridEditing = true;
  }

  public eth2GridCancel({ sender, rowIndex }: any) {
    this.eth2GridClose(sender, rowIndex);
  }

  public eth2GridSave({ sender, rowIndex, formGroup, isNew }: any) {
    if (this.debug) {
      this.logger.debug("NetworkComponent.eth2GridSave >> formGroup.value = " + JSON.stringify(formGroup.value));
    }

    // get data
    const data: GridNetworkIntf = formGroup.value;

    if (isNew) {
      // add record to array
      this.eth2GridData.push(data);
    } else {
      const row: GridNetworkIntf | undefined = this.eth2GridData.find((obj: GridNetworkIntf) => obj.guid == data.guid);

      if (row) {
        row.address = data.address;
        row.cidr = data.cidr;
      } else {
        this.logger.warn("NetworkComponent.eth2GridRemove >> could not find row to update in grid data >> data = " + JSON.stringify(data));
      }
    }

    // update form
    this.updateEth2FormAddresses();

    // close editing
    sender.closeRow(rowIndex);

    this.eth2GridEditing = false;
  }

  public eth2GridRemove({ dataItem }: any) {
    if (this.debug) {
      this.logger.debug("NetworkComponent.eth2GridRemove >> dataItem = " + JSON.stringify(dataItem));
    }

    // get data
    const data: GridNetworkIntf = dataItem;

    // filter out removed row
    this.eth2GridData = this.eth2GridData.filter((obj: GridNetworkIntf) => {
      return obj.guid !== data.guid;
    });

    // update form
    this.updateEth2FormAddresses();
  }

  private eth2GridClose(grid: any, rowIndex = this.eth2GridRow) {
    grid.closeRow(rowIndex);
    this.eth2GridRow = 0;
    this.Eth2GridForm = undefined!;
    this.eth2GridEditing = false;
  }

  private updateEth2FormAddresses() {
    // build form data
    const addresses: Array<string> = [];
    for (const data of this.eth2GridData) {
      addresses.push(data.address + "/" + data.cidr.toString());
    }

    // update form
    this.Eth2Form.controls["addresses"].patchValue(addresses);
  }

  /* #endregion */

  // WiFi Grid
  /* #region */

  async onSubmitWiFi(e: any) {
    try {
      if (this.debug) {
        this.logger.debug("NetworkComponent.onSubmitWiFi >> e.value = " + JSON.stringify(e.value));
      }

      // validate
      if (!this.validateNetwork()) {
        return;
      }

      // show loading icon
      this.loadingWiFi = true;

      // build nameservers
      const nameservers: Array<string> = [];
      if (e.value.nameserver1) {
        nameservers.push(e.value.nameserver1);
      }
      if (e.value.nameserver2) {
        nameservers.push(e.value.nameserver2);
      }

      // send data
      await this.netplanguiService.submitWiFi(e.value.gateway, e.value.addresses, nameservers, !this.wifiGridEnabled, e.value.ssid, e.value.ssidPassword);

      // show popup
      this.notificationService.show({
        content: "Wi-Fi saved.  Please wait for settings to take affect.",
        cssClass: "notification",
        position: { horizontal: "center", vertical: "top" },  // left/center/right, top/bottom
        type: { style: "success", icon: false },  // none, success, error, warning, info
        hideAfter: 3000,  // milliseconds
        animation: {
          type: "fade",
          duration: 150, // milliseconds (notif)
        },
      });

      // hide loading icon
      this.loadingWiFi = false;

      // reset form
      this.WiFiForm.markAsPristine();
      this.WiFiForm.markAsUntouched();
    } catch (error: any) {
      this.logger.error("NetworkComponent.onSubmitWiFi >> error = " + error);
      this.notificationService.show({
        content: error,
        closable: true,
        cssClass: "notification",
        position: { horizontal: "center", vertical: "top" },  // left/center/right, top/bottom
        type: { style: "error", icon: false },  // none, success, error, warning, info
        hideAfter: 10000,  // milliseconds
        animation: {
          type: "fade",
          duration: 150, // milliseconds (notif)
        },
      });
      this.loadingWiFi = false;
    }
  }

  public wifiGridAdd({ sender }: any) {
    this.wifiGridClose(sender);

    this.WiFiGridForm = this.formBuilder.group({
      guid: [Chance().guid()],
      address: ["", [Validators.required, Validators.pattern(this.ipRegex)]],
      cidr: ["", [Validators.required, Validators.min(1)]],
    });

    sender.addRow(this.WiFiGridForm);

    this.wifiGridEditing = true;
  }

  public wifiGridEdit({ sender, rowIndex, dataItem }: any) {
    if (this.debug) {
      this.logger.debug(JSON.stringify(dataItem))
    }
    this.wifiGridClose(sender);

    this.WiFiGridForm = this.formBuilder.group({
      guid: [dataItem.guid],
      address: [dataItem.address, [Validators.required, Validators.pattern(this.ipRegex)]],
      cidr: [dataItem.cidr, [Validators.required, Validators.min(1)]],
    });

    this.wifiGridRow = rowIndex;

    sender.editRow(rowIndex, this.WiFiGridForm);

    this.wifiGridEditing = true;
  }

  public wifiGridCancel({ sender, rowIndex }: any) {
    this.wifiGridClose(sender, rowIndex);
  }

  public wifiGridSave({ sender, rowIndex, formGroup, isNew }: any) {
    if (this.debug) {
      this.logger.debug("NetworkComponent.wifiGridSave >> formGroup.value = " + JSON.stringify(formGroup.value));
    }

    // get data
    const data: GridNetworkIntf = formGroup.value;

    if (isNew) {
      // add record to array
      this.wifiGridData.push(data);
    } else {
      const row: GridNetworkIntf | undefined = this.wifiGridData.find((obj: GridNetworkIntf) => obj.guid == data.guid);

      if (row) {
        row.address = data.address;
        row.cidr = data.cidr;
      } else {
        this.logger.warn("NetworkComponent.wifiGridRemove >> could not find row to update in grid data >> data = " + JSON.stringify(data));
      }
    }

    // update form
    this.updateWiFiFormAddresses();

    // close editing
    sender.closeRow(rowIndex);

    this.wifiGridEditing = false;
  }

  public wifiGridRemove({ dataItem }: any) {
    if (this.debug) {
      this.logger.debug("NetworkComponent.wifiGridRemove >> dataItem = " + JSON.stringify(dataItem));
    }

    // get data
    const data: GridNetworkIntf = dataItem;

    // filter out removed row
    this.wifiGridData = this.wifiGridData.filter((obj: GridNetworkIntf) => {
      return obj.guid !== data.guid;
    });

    // update form
    this.updateWiFiFormAddresses();
  }

  private wifiGridClose(grid: any, rowIndex = this.wifiGridRow) {
    grid.closeRow(rowIndex);
    this.wifiGridRow = 0;
    this.WiFiGridForm = undefined!;
    this.wifiGridEditing = false;
  }

  private updateWiFiFormAddresses() {
    // build form data
    const addresses: Array<string> = [];
    for (const data of this.wifiGridData) {
      addresses.push(data.address + "/" + data.cidr.toString());
    }

    // update form
    this.WiFiForm.controls["addresses"].patchValue(addresses);
  }

  /* #endregion */

  // other

  public getSubnetMask(cidr: number): any {
    return this.subnetMaskCidr.find((obj: SubnetDropdownIntf) => obj.cidr === cidr);
  }

  private validateNetwork(): boolean {
    const bridgeGatewayUsed: boolean = this.BridgeForm.controls["gateway"].value.length ? true : false;
    const eth1GatewayUsed: boolean = this.Eth1Form.controls["gateway"].value.length ? true : false;
    const eth2GatewayUsed: boolean = this.Eth2Form.controls["gateway"].value.length ? true : false;
    const wifiGatewayUsed: boolean = this.WiFiForm.controls["gateway"].value.length ? true : false;

    // check for multiple gateways
    const multipleGatewaysUsed: boolean = [bridgeGatewayUsed, eth1GatewayUsed, eth2GatewayUsed, wifiGatewayUsed].filter(Boolean).length >= 2;
    if (multipleGatewaysUsed) {
      this.notificationService.show({
        content: "Only one gateway is allowed.",
        cssClass: "notification",
        position: { horizontal: "center", vertical: "top" },  // left/center/right, top/bottom
        type: { style: "warning", icon: false },  // none, success, error, warning, info
        hideAfter: 3000,  // milliseconds
        animation: {
          type: "fade",
          duration: 150, // milliseconds (notif)
        },
      });
      return false;
    }

    // make sure at least one option is selected
    if (!this.bridgeGridEnabled && !this.eth1GridEnabled && !this.eth2GridEnabled) {
      this.notificationService.show({
        content: "Please enable at least one ethernet port.",
        cssClass: "notification",
        position: { horizontal: "center", vertical: "top" },  // left/center/right, top/bottom
        type: { style: "warning", icon: false },  // none, success, error, warning, info
        hideAfter: 4000,  // milliseconds
        animation: {
          type: "fade",
          duration: 150, // milliseconds (notif)
        },
      });
      return false;
    }

    return true;
  }

}
