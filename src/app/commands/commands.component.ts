import { Component, OnInit } from "@angular/core";

// services
import { NetplanGUIService } from "../netplan-gui.service";
import { NotificationService } from "@progress/kendo-angular-notification";

// Icons
import { faPowerOff, faTrash, faLockOpen, faArrowRotateLeft, faDownload } from '@fortawesome/free-solid-svg-icons';

// other
import { NGXLogger } from "ngx-logger";

@Component({
    selector: 'app-commands',
    templateUrl: './commands.component.html',
    styleUrls: ['./commands.component.scss'],
    standalone: false
})
export class CommandsComponent implements OnInit {
  debug: boolean = true;
  private logID: string = "CommandsComponent.";
  // button command loading
  loadingResPalCode: boolean = false;
  loadingResPortCode: boolean = false;
  loadingClrLogFiles: boolean = false;
  loadingChngLogFilePerm: boolean = false;
  loadingRstSampler: boolean = false;
  loadingRebootComputer: boolean = false;
  loadingShutdownComputer: boolean = false;
  loadingGetIpA: boolean = false;
  loadingGetEth0Status: boolean = false;
  loadingGetEth1Status: boolean = false;
  // insert test alarm button loading
  loadingInsertInfoAlarm: boolean = false;
  loadingInsertWarningAlarm: boolean = false;
  loadingInsertErrorAlarm: boolean = false;
  loadingInsertFatalAlarm: boolean = false;
  // dialog open status
  rebootComputerConfirmOpen: boolean = false;
  shutdownComputerConfirmOpen: boolean = false;
  // data
  public ipAResponse: string = "";
  // icons
  public faTrash = faTrash;
  public faLockOpen = faLockOpen;
  public faArrowRotateLeft = faArrowRotateLeft;
  public faPowerOff = faPowerOff;
  public faDownload = faDownload;

  constructor(
    private netplanGuiService: NetplanGUIService,
    private notificationService: NotificationService,
    private logger: NGXLogger,
  ) {
  }

  ngOnInit() {
    // set active class in navbar
    setTimeout(() => {
      this.netplanGuiService.commandsSelected$.emit(true);
    });
  }

  // button commands

  async clearLogFiles() {
    try {
      // show loading icon
      this.loadingClrLogFiles = true;

      // submit
      await this.netplanGuiService.runCommand("clear_all_log_files");

      // show popup
      this.notificationService.show({
        content: "All log files cleared.",
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
      this.loadingClrLogFiles = false;
    } catch (error: any) {
      this.logger.error(`${this.logID}clearLogFiles >> error = ${error}`);
      this.loadingClrLogFiles = false;
    }
  }

  async changeLogFilePermissions() {
    try {
      // show loading icon
      this.loadingChngLogFilePerm = true;

      // submit
      await this.netplanGuiService.runCommand("change_log_file_perm");

      // show popup
      this.notificationService.show({
        content: "You can now view all log files.",
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
      this.loadingChngLogFilePerm = false;
    } catch (error: any) {
      this.logger.error(`${this.logID}changeLogFilePermissions >> error = ${error}`);
      this.loadingChngLogFilePerm = false;
    }
  }

  async rebootComputer() {
    try {
      // show loading icon
      this.loadingRebootComputer = true;

      // submit
      await this.netplanGuiService.runCommand("reboot_station");

      // show popup
      this.notificationService.show({
        content: "Station rebooted.",
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
      this.loadingRebootComputer = false;
    } catch (error: any) {
      this.logger.error(`${this.logID}rebootComputer >> error = ${error}`);
      this.loadingRebootComputer = false;
      throw new Error(error);
    }
  }

  async shutdownComputer() {
    try {
      // show loading icon
      this.loadingShutdownComputer = true;

      // submit
      await this.netplanGuiService.runCommand("shutdown_station");

      // show popup
      this.notificationService.show({
        content: "Station is shutting down.",
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
      this.loadingShutdownComputer = false;
    } catch (error: any) {
      this.logger.error(`${this.logID}shutdownComputer >> error = ${error}`);
      this.loadingShutdownComputer = false;
      throw new Error(error);
    }
  }

  async getIpA() {
    try {
      // show loading icon
      this.loadingGetIpA = true;

      // get data
      const data: { "response": string } = await this.netplanGuiService.getIpA();

      // set data
      this.ipAResponse = data.response;

      // show popup
      this.notificationService.show({
        content: "Network received.",
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
      this.loadingGetIpA = false;
    } catch (error: any) {
      this.logger.error(`${this.logID}getIpA >> error = ${error}`);
      this.loadingGetIpA = false;
    }
  }

  async getEth0Status() {
    try {
      // show loading icon
      this.loadingGetEth1Status = true;

      // submit
      const data: { "response": string } = await this.netplanGuiService.getEth0Status();

      // show popup
      this.notificationService.show({
        content: data.response,
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
      this.loadingGetEth1Status = false;
    } catch (error: any) {
      this.logger.error(`${this.logID}getEth0Status >> error = ${error}`);
      this.loadingGetEth1Status = false;
      throw new Error(error);
    }
  }

  async getEth1Status() {
    try {
      // show loading icon
      this.loadingGetEth0Status = true;

      // submit
      const data: { "response": string } = await this.netplanGuiService.getEth1Status();

      // show popup
      this.notificationService.show({
        content: data.response,
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
      this.loadingGetEth0Status = false;
    } catch (error: any) {
      this.logger.error(`${this.logID}getEth0Status >> error = ${error}`);
      this.loadingGetEth0Status = false;
      throw new Error(error);
    }
  }

  // dialog confirm

  async rebootComputerConfirm(status: string) {
    try {
      switch (status) {
        case "open":
          this.rebootComputerConfirmOpen = true;
          break;
        case "close":
          this.rebootComputerConfirmOpen = false;
          break;
        case "yes":
          await this.rebootComputer();
          this.rebootComputerConfirmOpen = false;
          break;
        default:
          this.logger.error(`${this.logID}rebootComputerConfirm >> status unhandled >> status = ${status}`);
          break;
      }
    } catch (error: any) {
      this.logger.error(`${this.logID}rebootComputerConfirm >> error = ${error}`);
      this.rebootComputerConfirmOpen = false;
    }
  }

  async shutdownComputerConfirm(status: string) {
    try {
      switch (status) {
        case "open":
          this.shutdownComputerConfirmOpen = true;
          break;
        case "close":
          this.shutdownComputerConfirmOpen = false;
          break;
        case "yes":
          await this.shutdownComputer();
          this.shutdownComputerConfirmOpen = false;
          break;
        default:
          this.logger.error(`${this.logID}shutdownComputerConfirm >> status unhandled >> status = ${status}`);
          break;
      }
    } catch (error: any) {
      this.logger.error(`${this.logID}shutdownComputerConfirm >> error = ${error}`);
      this.shutdownComputerConfirmOpen = false;
    }
  }
}
