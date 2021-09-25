import { Injectable, Output, EventEmitter, NgZone } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

// Progress
import { NotificationService } from "@progress/kendo-angular-notification";

// interfaces
import { eBoxNetworkIntf } from "./interfaces/eBoxNetworkIntf";
import { eBoxVPNserverBridgeIntf } from "./interfaces/eBoxVPNserverBridgeIntf";
import { StationWifiIntf } from "./interfaces/StationWifiIntf";
import { AlarmHistoryIntf } from "./interfaces/AlarmHistoryIntf";

// Other
import { environment } from "../environments/environment";
import { NGXLogger } from 'ngx-logger';

// Setup
export let SERVER: string = "";
if (environment.production) {
  SERVER = window.location.hostname;
} else {
  SERVER = "10.0.0.2";
  //SERVER = "10.0.0.126";  // linux laptop
}

/******************************** General ********************************/
/* #region */

@Injectable({
  providedIn: "root"
})
export class NetplanGUIService {
  private debug = true;
  private BASE_URL: string = "";
  // event emitters
  @Output() networkSelected$: EventEmitter<boolean> = new EventEmitter();
  @Output() vpnServerSelected$: EventEmitter<boolean> = new EventEmitter();
  @Output() wifiSelected$: EventEmitter<boolean> = new EventEmitter();
  @Output() commandsSelected$: EventEmitter<boolean> = new EventEmitter();
  @Output() alarmsSelected$: EventEmitter<boolean> = new EventEmitter();
  @Output() filesSelected$: EventEmitter<boolean> = new EventEmitter();
  @Output() aboutSelected$: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private http: HttpClient,
    private logger: NGXLogger,  // trace, debug, info, log, warn, error, fatal
  ) {
    this.BASE_URL = "http://" + SERVER + ":8080/";
  }

  public query(params: string): Promise<any> {
    const URL = this.BASE_URL + params;
    if (this.debug) {
      this.logger.debug("NetplanGUIService.query >> URL = " + URL);
    }

    return this.http.get(URL).toPromise();
  }

  public getNetwork(): Promise<eBoxNetworkIntf> {
    const URL = this.BASE_URL + "get_interfaces1";
    if (this.debug) {
      this.logger.debug("NetplanGUIService.getNetwork >> URL = " + URL);
    }

    return this.http.get<eBoxNetworkIntf>(URL).toPromise();
  }

  public getVPNserverBridge(): Promise<eBoxVPNserverBridgeIntf> {
    const URL = this.BASE_URL + "get_vpn_server_bridge";
    if (this.debug) {
      this.logger.debug("NetplanGUIService.getVPNserverBridge >> URL = " + URL);
    }

    return this.http.get<eBoxVPNserverBridgeIntf>(URL).toPromise();
  }

  public getStationWifi(): Promise<StationWifiIntf> {
    const URL = this.BASE_URL + "get_station_wifi";
    if (this.debug) {
      this.logger.debug("NetplanGUIService.getStationWifi >> URL = " + URL);
    }

    return this.http.get<StationWifiIntf>(URL).toPromise();
  }

  public getStationAlarms(): Promise<Array<AlarmHistoryIntf>> {
    const URL = this.BASE_URL + "get_alarm_history";
    if (this.debug) {
      this.logger.debug("NetplanGUIService.getStationWifi >> URL = " + URL);
    }

    return this.http.get<Array<AlarmHistoryIntf>>(URL).toPromise();
  }

}
