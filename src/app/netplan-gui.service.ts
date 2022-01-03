import { Injectable, Output, EventEmitter } from "@angular/core";
import { HttpClient } from "@angular/common/http";

// interfaces
import { eBoxNetworkIntf } from "./interfaces/linuxNetworkIntf";
import { StationWifiIntf } from "./interfaces/StationWifiIntf";

// Other
import { environment } from "../environments/environment";
import { NGXLogger } from 'ngx-logger';

// Setup
export let SERVER: string = "";
if (environment.production) {
  SERVER = window.location.hostname;
} else {
  SERVER = "localhost";
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
  @Output() wifiSelected$: EventEmitter<boolean> = new EventEmitter();
  @Output() commandsSelected$: EventEmitter<boolean> = new EventEmitter();
  @Output() filesSelected$: EventEmitter<boolean> = new EventEmitter();

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

  public getStationWifi(): Promise<StationWifiIntf> {
    const URL = this.BASE_URL + "get_station_wifi";
    if (this.debug) {
      this.logger.debug("NetplanGUIService.getStationWifi >> URL = " + URL);
    }

    return this.http.get<StationWifiIntf>(URL).toPromise();
  }

}
