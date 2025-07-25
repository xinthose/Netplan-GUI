import { Component, AfterViewInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";

// services
import { NetplanGUIService } from "./netplan-gui.service";
import { NotificationService } from "@progress/kendo-angular-notification";

// icons
import { faNetworkWired, faTerminal, faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

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
  standalone: false
})
export class AppComponent implements AfterViewInit, OnDestroy {
  debug: boolean;
  private logID: string = "AppComponent.";
  // navigation selected
  public networkSelected: boolean = false;
  public commandsSelected: boolean = false;
  public filesSelected: boolean = false;
  // Fort Awesome
  public faNetworkWired = faNetworkWired;
  public faTerminal = faTerminal;
  public faArrowUpRightFromSquare = faArrowUpRightFromSquare;
  // subscriptions
  private networkSelected$!: Subscription;
  private commandsSelected$!: Subscription;
  private filesSelected$!: Subscription;

  constructor(
    private netplanGuiService: NetplanGUIService,
    private notificationService: NotificationService,
    private logger: NGXLogger,
    public router: Router,
  ) {
    if (environment.production) {
      this.debug = false;
    } else {
      this.debug = true;
    }

    // subscribe to navigation changes to color button
    this.networkSelected$ = this.netplanGuiService.networkSelected$.subscribe((networkSelected: boolean) => {
      this.resetSelection();
      this.networkSelected = networkSelected;
    });
    this.commandsSelected$ = this.netplanGuiService.commandsSelected$.subscribe((commandsSelected: boolean) => {
      this.resetSelection();
      this.commandsSelected = commandsSelected;
    });
    this.filesSelected$ = this.netplanGuiService.filesSelected$.subscribe((filesSelected: boolean) => {
      this.resetSelection();
      this.filesSelected = filesSelected;
    });
  }

  ngAfterViewInit() {
    if (this.debug) {
      this.logger.debug(`${this.logID}ngAfterViewInit >> AppComponent initialized`);
    }
  }

  logsClick() {
    // get logs URL
    let logsURL: string = "";
    if (environment.production) {
      logsURL = `http://${window.location.hostname}/logs`;
    } else {
      logsURL = `http://localhost/logs`;
    }

    // navigate
    window.open(logsURL, "_blank");
  }

  private resetSelection(): void {
    this.networkSelected = false;
    this.commandsSelected = false;
    this.filesSelected = false;
  }

  ngOnDestroy() {
    this.networkSelected$.unsubscribe();
    this.commandsSelected$.unsubscribe();
    this.filesSelected$.unsubscribe();
  }

}
