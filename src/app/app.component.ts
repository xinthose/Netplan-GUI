import { Component, AfterViewInit, ViewEncapsulation } from '@angular/core';

// services
import { NetplanGUIService } from "./netplan-gui.service";
import { NotificationService } from "@progress/kendo-angular-notification";

// rxjs
import { Subscription } from "rxjs";

// other
import { NGXLogger } from 'ngx-logger';
import { environment } from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements AfterViewInit {
  public LogsURL: string = "http://" + (environment.production ? window.location.hostname : "localhost") + "/logs";
  // navigation selected
  public networkSelected: boolean = false;
  public commandsSelected: boolean = false;
  public filesSelected: boolean = false;
  // subscriptions
  private networkSelected$!: Subscription;
  private commandsSelected$!: Subscription;
  private alarmsSelected$!: Subscription;
  private filesSelected$!: Subscription;

  constructor(
    private netplanguiService: NetplanGUIService,
    private notificationService: NotificationService,
    private logger: NGXLogger,
  ) {
  }

  ngAfterViewInit() {
    // subscribe to navigation changes to apply `active` class
    this.networkSelected$ = this.netplanguiService.networkSelected$.subscribe((networkSelected: boolean) => {
      this.resetSelection();
      this.networkSelected = networkSelected;
    });
    this.commandsSelected$ = this.netplanguiService.commandsSelected$.subscribe((commandsSelected: boolean) => {
      this.resetSelection();
      this.commandsSelected = commandsSelected;
    });
    this.filesSelected$ = this.netplanguiService.filesSelected$.subscribe((filesSelected: boolean) => {
      this.resetSelection();
      this.filesSelected = filesSelected;
    });

    this.logger.info("NetplanGUI is running");
  }

  private resetSelection(): void {
    this.networkSelected = false;
    this.commandsSelected = false;
    this.filesSelected = false;
  }

}
