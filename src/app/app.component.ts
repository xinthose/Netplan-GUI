import { Component, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Router } from "@angular/router";

// services
import { NetplanGUIService } from "./netplan-gui.service";
import { NotificationService } from "@progress/kendo-angular-notification";

// icons
import { SVGIcon } from '@progress/kendo-svg-icons';
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
})
export class AppComponent implements AfterViewInit {
  // navigation selected
  public networkSelected: boolean = false;
  public commandsSelected: boolean = false;
  public filesSelected: boolean = false;
  // Fort Awesome
  public faNetworkWired = faNetworkWired;
  public faTerminal = faTerminal;
  public faArrowUpRightFromSquare = faArrowUpRightFromSquare;
  // Kendo
  public faNetworkWiredKendo: SVGIcon = {
    name: faNetworkWired.iconName,
    content: `<path d="${faNetworkWired.icon[4]}" />`,
    viewBox: `0 0 ${faNetworkWired.icon[0]} ${faNetworkWired.icon[1]}`,
  };
  public faTerminaldKendo: SVGIcon = {
    name: faTerminal.iconName,
    content: `<path d="${faTerminal.icon[4]}" />`,
    viewBox: `0 0 ${faTerminal.icon[0]} ${faTerminal.icon[1]}`,
  };
  public faArrowUpRightFromSquareKendo: SVGIcon = {
    name: faArrowUpRightFromSquare.iconName,
    content: `<path d="${faArrowUpRightFromSquare.icon[4]}" />`,
    viewBox: `0 0 ${faArrowUpRightFromSquare.icon[0]} ${faArrowUpRightFromSquare.icon[1]}`,
  };
  // subscriptions
  private networkSelected$!: Subscription;
  private commandsSelected$!: Subscription;
  private alarmsSelected$!: Subscription;
  private filesSelected$!: Subscription;

  constructor(
    private netplanguiService: NetplanGUIService,
    private notificationService: NotificationService,
    private logger: NGXLogger,
    public router: Router,
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

}
