// Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Progress
import { GridModule, PDFModule, ExcelModule, FilterService } from '@progress/kendo-angular-grid';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { LabelModule } from '@progress/kendo-angular-label';
import { PopupModule } from '@progress/kendo-angular-popup';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { RippleModule } from '@progress/kendo-angular-ripple';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { NavigationModule } from '@progress/kendo-angular-navigation';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { IconsModule } from '@progress/kendo-angular-icons';

// MDBootstrap
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { MdbPopoverModule } from 'mdb-angular-ui-kit/popover';
import { MdbRadioModule } from 'mdb-angular-ui-kit/radio';
import { MdbRangeModule } from 'mdb-angular-ui-kit/range';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { MdbScrollspyModule } from 'mdb-angular-ui-kit/scrollspy';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';

// Other
import { HttpErrorInterceptor } from './http-error.interceptor';
import { LoggerModule, NgxLoggerLevel } from "ngx-logger";
import { environment } from "../environments/environment";

// Components
import { NetworkComponent } from './network/network.component';
import { WifiComponent } from './wifi/wifi.component';
import { CommandsComponent } from './commands/commands.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent,
    NetworkComponent,
    WifiComponent,
    CommandsComponent,
    PageNotFoundComponent
  ],
  imports: [
    // General
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LoggerModule.forRoot({
      serverLoggingUrl: "/assets/log.php",
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: environment.production ? NgxLoggerLevel.INFO : NgxLoggerLevel.OFF,  // only log to server for production
      httpResponseType: "json",
    }),

    // Progress
    GridModule,
    PDFModule,
    ExcelModule,
    InputsModule,
    ButtonsModule,
    LabelModule,
    PopupModule,
    DialogsModule,
    DropDownsModule,
    TooltipModule,
    RippleModule,
    NotificationModule,
    NavigationModule,
    IndicatorsModule,
    IconsModule,

    // Forms
    FormsModule,
    ReactiveFormsModule,

    // other
    FontAwesomeModule,
    MdbCarouselModule,
    MdbCheckboxModule,
    MdbCollapseModule,
    MdbDropdownModule,
    MdbFormsModule,
    MdbModalModule,
    MdbPopoverModule,
    MdbRadioModule,
    MdbRangeModule,
    MdbRippleModule,
    MdbScrollspyModule,
    MdbTabsModule,
    MdbTooltipModule,
    MdbValidationModule,
  ],
  providers: [
    FilterService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
