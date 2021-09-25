import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, AbstractControl, Validators } from "@angular/forms";

// services
import { NetplanGUIService } from "../netplan-gui.service";
import { NotificationService } from "@progress/kendo-angular-notification";

// interfaces
import { StationWifiIntf } from "../interfaces/StationWifiIntf";

// other
import { NGXLogger } from "ngx-logger";

@Component({
  selector: 'app-wifi',
  templateUrl: './wifi.component.html',
  styleUrls: ['./wifi.component.scss']
})
export class WifiComponent implements OnInit {
  debug: boolean = true;
  loading: boolean = false;
  loading1: boolean = false;
  private ipRegex: RegExp = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  private ssidRegex: RegExp = /^[^!#;+\]\/"\t][^+\]\/"\t]{0,30}[^ +\]\/"\t]$|^[^ !#;+\]\/"\t]$/;
  // forms
  public WifiForm: FormGroup;

  constructor(
    private netplanguiService: NetplanGUIService,
    private notificationService: NotificationService,
    private logger: NGXLogger,
    private formBuilder: FormBuilder,
  ) {
    this.WifiForm = this.formBuilder.group({
      enabled: false,
      networkName: ["", [Validators.required, Validators.maxLength(32), Validators.minLength(3), Validators.pattern(this.ssidRegex)]],
      networkPassword: ["", [Validators.maxLength(30), Validators.minLength(3)]],
      enableBridge: false,
      acessPointGateway: ["", [Validators.required, Validators.pattern(this.ipRegex)]],
    });

    // subscribe to form changes
    this.WifiForm.get("enabled")!.valueChanges.subscribe((enabled: boolean) => {
      if (enabled) {
        // enable required fields
        this.WifiForm.controls["networkName"].enable();
        this.WifiForm.controls["networkPassword"].enable();
        this.WifiForm.controls["enableBridge"].enable();
      } else {
        // reset fields
        this.WifiForm.controls["networkName"].patchValue("");
        this.WifiForm.controls["networkPassword"].patchValue("");
        this.WifiForm.controls["enableBridge"].patchValue(false);

        // disable required fields
        this.WifiForm.controls["networkName"].disable();
        this.WifiForm.controls["networkPassword"].disable();
        this.WifiForm.controls["enableBridge"].disable();
      }
    });
    this.WifiForm.get("enableBridge")!.valueChanges.subscribe((enabled: boolean) => {
      if (enabled) {
        this.WifiForm.controls["acessPointGateway"].enable();
      } else {
        // reset fields
        this.WifiForm.controls["acessPointGateway"].patchValue("");

        // disable required fields
        this.WifiForm.controls["acessPointGateway"].disable();
      }
    });

    // get eBox network
    this.refreshNetwork();
  }

  ngOnInit() {
    // set active class in navbar
    setTimeout(() => {
      this.netplanguiService.wifiSelected$.emit(true);
    });
  }

  async refreshNetwork() {
    try {
      // show loading icon
      this.loading = true;

      // get eBox network
      const stationWifi: StationWifiIntf = await this.netplanguiService.getStationWifi();
      if (this.debug) {
        this.logger.debug("WifiComponent.refreshNetwork >> stationWifi = " + JSON.stringify(stationWifi));
      }

      // set form data
      this.WifiForm.setValue({
        "enabled": !!parseInt(stationWifi.enable_wifi),
        "networkName": stationWifi.network_name,
        "networkPassword": stationWifi.network_password,
        "enableBridge": !!parseInt(stationWifi.enable_bridge),
        "acessPointGateway": stationWifi.network_ap_gateway,
      });

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
      this.logger.error("WifiComponent.refreshNetwork >> error = " + error);
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

  async onSubmit(e: any) {
    try {
      if (this.debug) {
        this.logger.debug("WifiComponent.onSubmit >> " + JSON.stringify(e.value));
      }

      // show loading icon
      this.loading1 = true;

      // build URL
      const data = {
        "enabled": e.value.enabled ? "1" : "0",
        "network_name": "networkName" in e.value ? e.value.networkName : "",
        "network_password": "networkPassword" in e.value ? e.value.networkPassword : "",
        "enable_bridge": "enableBridge" in e.value ? (e.value.enableBridge ? "1" : "0") : "0",
        "network_ap_gateway": "acessPointGateway" in e.value ? e.value.acessPointGateway : "",
      };
      const URL = "update_station_wifi/" + JSON.stringify(data);
      if (this.debug) {
        this.logger.debug("WifiComponent.onSubmit >> URL =" + URL);
      }

      // send data
      const response = await this.netplanguiService.query(URL);
      if (this.debug) {
        this.logger.debug("WifiComponent.onSubmit >> response = " + JSON.stringify(response));
      }

      // show popup
      this.notificationService.show({
        content: "Wi-Fi saved.",
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
      this.loading1 = false;
    } catch (error: any) {
      this.logger.error("WifiComponent.onSubmit >> error = " + error);
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
      this.loading1 = false;
    }
  }

}
