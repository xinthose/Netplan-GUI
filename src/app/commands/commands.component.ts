import { Component, OnInit } from "@angular/core";

// services
import { NetplanGUIService } from "../netplan-gui.service";
import { NotificationService } from "@progress/kendo-angular-notification";

// interfaces
import { StationWifiIntf } from "../interfaces/StationWifiIntf";

// other
import { NGXLogger } from "ngx-logger";

@Component({
  selector: 'app-commands',
  templateUrl: './commands.component.html',
  styleUrls: ['./commands.component.scss']
})
export class CommandsComponent implements OnInit {
  debug: boolean = true;
  // button command loading
  loadingResPalCode: boolean = false;
  loadingResPortCode: boolean = false;
  loadingClrLogFiles: boolean = false;
  loadingChngLogFilePerm: boolean = false;
  loadingRstSampler: boolean = false;
  loadingRebootComputer: boolean = false;
  loadingShutdownComputer: boolean = false;
  // insert test alarm button loading
  loadingInsertInfoAlarm: boolean = false;
  loadingInsertWarningAlarm: boolean = false;
  loadingInsertErrorAlarm: boolean = false;
  loadingInsertFatalAlarm: boolean = false;
  // dialog open status
  rebootComputerConfirmOpen: boolean = false;
  shutdownComputerConfirmOpen: boolean = false;

  constructor(
    private netplanguiService: NetplanGUIService,
    private notificationService: NotificationService,
    private logger: NGXLogger,
  ) {
  }

  ngOnInit() {
    // set active class in navbar
    setTimeout(() => {
      this.netplanguiService.commandsSelected$.emit(true);
    });
  }

  // button commands

  async clearLogFiles() {
    try {
      // show loading icon
      this.loadingClrLogFiles = true;

      // submit
      const response = await this.netplanguiService.query("clear_all_log_files");
      if (this.debug) {
        this.logger.debug("CommandsComponent.clearLogFiles >> response = " + JSON.stringify(response));
      }

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
      this.logger.error("CommandsComponent.clearLogFiles >> error = " + error);
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
      this.loadingClrLogFiles = false;
    }
  }

  async changeLogFilePermissions() {
    try {
      // show loading icon
      this.loadingChngLogFilePerm = true;

      // submit
      const response = await this.netplanguiService.query("change_log_file_perm");
      if (this.debug) {
        this.logger.debug("CommandsComponent.changeLogFilePermissions >> response = " + JSON.stringify(response));
      }

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
      this.logger.error("CommandsComponent.changeLogFilePermissions >> error = " + error);
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
      this.loadingChngLogFilePerm = false;
    }
  }

  async rebootComputer() {
    try {
      // show loading icon
      this.loadingRebootComputer = true;

      // submit
      const response = await this.netplanguiService.query("reboot_station");
      if (this.debug) {
        this.logger.debug("CommandsComponent.rebootComputer >> response = " + JSON.stringify(response));
      }

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
      this.logger.error("CommandsComponent.rebootComputer >> error = " + error);
      this.loadingRebootComputer = false;
      throw new Error(error);
    }
  }

  async shutdownComputer() {
    try {
      // show loading icon
      this.loadingShutdownComputer = true;

      // submit
      const response = await this.netplanguiService.query("shutdown_station");
      if (this.debug) {
        this.logger.debug("CommandsComponent.shutdownComputer >> response = " + JSON.stringify(response));
      }

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
      this.logger.error("CommandsComponent.shutdownComputer >> error = " + error);
      this.loadingShutdownComputer = false;
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
          this.logger.error("CommandsComponent.rebootComputerConfirm >> status unhandled >> status = " + status);
          break;
      }
    } catch (error: any) {
      this.logger.error("CommandsComponent.rebootComputerConfirm >> error = " + error);
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
          this.logger.error("CommandsComponent.shutdownComputerConfirm >> status unhandled >> status = " + status);
          break;
      }
    } catch (error: any) {
      this.logger.error("CommandsComponent.shutdownComputerConfirm >> error = " + error);
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
      this.shutdownComputerConfirmOpen = false;
    }
  }
}
