import { Injectable, Output, EventEmitter } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

// rxjs
import { firstValueFrom } from "rxjs";

// interfaces
import { eBoxNetworkIntf } from "./interfaces/linuxNetworkIntf";

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
  private logID: string = "NetplanGUIService.";
  private debug = true;
  private BASE_URL: string = "";
  // event emitters
  @Output() networkSelected$: EventEmitter<boolean> = new EventEmitter();
  @Output() commandsSelected$: EventEmitter<boolean> = new EventEmitter();
  @Output() filesSelected$: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private http: HttpClient,
    private logger: NGXLogger,  // trace, debug, info, log, warn, error, fatal
  ) {
    this.BASE_URL = "http://" + SERVER + ":8080/";
  }

  private post(url: string, body: Object): Promise<any> {
    // create headers
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      })
    };

    return firstValueFrom(this.http.post(this.BASE_URL + url, body, httpOptions));
  }

  private get(url: string): Promise<any> {
    const URL = this.BASE_URL + url;
    if (this.debug) {
      this.logger.debug(`${this.logID}get >> URL = ${URL}`);
    }

    return firstValueFrom(this.http.get(URL));
  }

  // GET requests

  public async getNetwork(): Promise<eBoxNetworkIntf> {
    try {
      return await this.get("get_interfaces1");
    } catch (error: any) {
      this.logger.error(`${this.logID}getNetwork >> error = ${error}`);
      throw new Error(error.toString());
    }
  }

  public async runCommand(command: string): Promise<void> {
    try {
      return await this.get(command);
    } catch (error: any) {
      this.logger.error(`${this.logID}getStationAlarms >> error = ${error}`);
      throw new Error(error.toString());
    }
  }

  public async getDateTime(): Promise<{ data: string }> {
    try {
      // test: http://10.0.0.2:8080/get_date_time
      return await this.get("get_date_time");
    } catch (error: any) {
      this.logger.error(`${this.logID}getDateTime >> error = ${error}`);
      throw new Error(error.toString());
    }
  }

  // POST requests

  public async submitBridge(gateway: string, addresses: Array<string>, nameservers: Array<string>): Promise<void> {
    try {
      const data = {
        "gateway": gateway ?? "",
        "addresses": addresses ?? [],
        "nameservers": nameservers ?? [],
      };
      return await this.post("submitBridge", data);
    } catch (error: any) {
      this.logger.error(`${this.logID}submitBridge >> error = ${error}`);
      throw new Error(error.toString());
    }
  }

  public async submitEth(port: 1 | 2, gateway: string, addresses: Array<string>, nameservers: Array<string>, deleteEth: boolean): Promise<void> {
    try {
      const data = {
        "gateway": gateway ?? "",
        "addresses": addresses ?? [],
        "nameservers": nameservers ?? [],
        "deleteEth": deleteEth,
      };
      return await this.post(`submitEth${port}`, data);
    } catch (error: any) {
      this.logger.error(`${this.logID}submitEth >> error = ${error}`);
      throw new Error(error.toString());
    }
  }

  public async submitWiFi(gateway: string, addresses: Array<string>, nameservers: Array<string>, deleteWiFi: boolean, ssid: string, ssidPassword: string): Promise<void> {
    try {
      const data = {
        "gateway": gateway ?? "",
        "addresses": addresses ?? [],
        "nameservers": nameservers ?? [],
        "deleteWiFi": deleteWiFi,
        "ssid": ssid ?? "",
        "ssidPassword": ssidPassword ?? "",
      };
      return await this.post("submitWiFi", data);
    } catch (error: any) {
      this.logger.error(`${this.logID}submitEth >> error = ${error}`);
      throw new Error(error.toString());
    }
  }

  public async setDate(serverTime: string): Promise<void> {
    try {
      const data = {
        "ServerTime": serverTime
      }
      return await this.post("setdate", data);
    } catch (error: any) {
      this.logger.error(`${this.logID}setDate >> error = ${error}`);
      throw new Error(error.toString());
    }
  }

}
