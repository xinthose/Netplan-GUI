import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

// services
import { NetplanGUIService } from "../netplan-gui.service";
import { NotificationService } from "@progress/kendo-angular-notification";

// progress
import { GridDataResult } from "@progress/kendo-angular-grid";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";

// interfaces
import { InterfacesGridIntf } from "../interfaces/InterfacesGridIntf";
import { NetworkGridIntf } from "../interfaces/NetworkGridIntf";
import { eBoxNetworkIntf } from "../interfaces/linuxNetworkIntf";
import { SubnetDropdownIntf } from "../interfaces/SubnetDropdownIntf";

// Icons
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';

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
  private ipRegex: RegExp = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  InterfaceTypes: Array<{ InterfaceTypeDesc: string, InterfaceTypeID: number }> = [
    {
      "InterfaceTypeDesc": "Ethernet",
      "InterfaceTypeID": 0
    },
    {
      "InterfaceTypeDesc": "Bridge",
      "InterfaceTypeID": 1
    },
    {
      "InterfaceTypeDesc": "VLAN",
      "InterfaceTypeID": 2
    },
  ];
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
  // interfaces grid
  public InterfacesGridForm!: FormGroup;
  public interfacesGridSort: SortDescriptor[] = [
    {
      field: "name",
      dir: "asc"
    }
  ];
  interfacesGridData: Array<InterfacesGridIntf> = [];
  interfacesGridRow: number = 0;
  // network grid
  public NetworkGridForm!: FormGroup;
  public networkGridSort: SortDescriptor[] = [
    {
      field: "name",
      dir: "asc"
    }
  ];
  networkGridData: Array<NetworkGridIntf> = [];
  networkGridRow: number = 0;
  // icons
  faPencilAlt = faPencilAlt;
  faCircleQuestion = faCircleQuestion;

  constructor(
    private netplanguiService: NetplanGUIService,
    private notificationService: NotificationService,
    private logger: NGXLogger,
    private formBuilder: FormBuilder,
  ) {
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

  // Interfaces Grid
  /* #region */

  public interfacesGridAdd({ sender }: any) {
    this.interfacesGridClose(sender);

    this.InterfacesGridForm = this.formBuilder.group({
      "guid": [Chance().guid()],
      "name": ["", [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      "id": [{ value: "", disabled: true }, [Validators.minLength(1), Validators.maxLength(50)]],
      "InterfaceType": [undefined, [Validators.required, Validators.min(0)]],
    });
    sender.addRow(this.InterfacesGridForm);
  }

  public interfacesGridEdit({ sender, rowIndex, dataItem }: any) {
    if (this.debug) {
      this.logger.debug(JSON.stringify(dataItem))
    }
    this.interfacesGridClose(sender);

    const data: InterfacesGridIntf = dataItem;

    this.InterfacesGridForm = this.formBuilder.group({
      "guid": [data.guid],
      "name": [data.name, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      "id": [{ value: data.id, disabled: data.InterfaceType != 2 }, [Validators.minLength(1), Validators.maxLength(50)]],
      "InterfaceType": [data.InterfaceType, [Validators.required, Validators.min(0)]],
    });

    this.interfacesGridRow = rowIndex;

    sender.editRow(rowIndex, this.InterfacesGridForm);
  }

  public interfacesGridCancel({ sender, rowIndex }: any) {
    this.interfacesGridClose(sender, rowIndex);
  }

  public interfacesGridSave({ sender, rowIndex, formGroup, isNew }: any) {
    if (this.debug) {
      this.logger.debug("NetworkComponent.interfacesGridSave >> formGroup.value = " + JSON.stringify(formGroup.value));
    }

    // get data
    const data: InterfacesGridIntf = formGroup.value;

    if (isNew) {
      // add record to array
      this.interfacesGridData.push(data);
    } else {
      // update specific record in array
      for (const row of this.interfacesGridData) {
        if (row.guid === data.guid) {
          row.name = data.name;
          row.InterfaceType = data.InterfaceType;
          row.id = data.id;
          break;
        }
      }
    }

    // close editing
    sender.closeRow(rowIndex);
  }

  public interfacesGridRemove({ dataItem }: any) {
    if (this.debug) {
      this.logger.debug("NetworkComponent.interfacesGridRemove >> dataItem = " + JSON.stringify(dataItem));
    }

    // get data
    const data: InterfacesGridIntf = dataItem;

    // filter out removed row
    this.interfacesGridData = this.interfacesGridData.filter((obj: InterfacesGridIntf) => {
      return obj.guid !== data.guid;
    });
  }

  private interfacesGridClose(grid: any, rowIndex = this.interfacesGridRow) {
    grid.closeRow(rowIndex);
    this.interfacesGridRow = 0;
    this.InterfacesGridForm = undefined!;
  }

  public InterfaceTypeChange(formGroup: FormGroup) {
    if (this.debug) {
      this.logger.debug("NetworkComponent.InterfaceTypeChange >> formGroup.value = " + JSON.stringify(formGroup.value));
    }

    if (formGroup.controls["InterfaceType"].value == 2) {
      formGroup.controls["id"].enable();
    } else {
      formGroup.controls["id"].setValue("");
      formGroup.controls["id"].disable();
    }
  }

  /* #endregion */

  // other

  public GetInterfaceTypeDesc(id: number): any {
    return this.InterfaceTypes.find(x => x.InterfaceTypeID === id);
  }

  public getSubnetMask(cidr: number): any {
    return this.subnetMaskCidr.find((obj: SubnetDropdownIntf) => obj.cidr === cidr);
  }

}
