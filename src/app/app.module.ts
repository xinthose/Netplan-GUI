// Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

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

// Other
import { HttpErrorInterceptor } from './http-error.interceptor';
import { LoggerModule, NgxLoggerLevel } from "ngx-logger";
import { environment } from "../environments/environment";

// Components
import { NetworkComponent } from './network/network.component';
import { CommandsComponent } from './commands/commands.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({ declarations: [
        AppComponent,
        NetworkComponent,
        CommandsComponent,
        PageNotFoundComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        LoggerModule.forRoot({
            serverLoggingUrl: "/assets/log.php",
            level: NgxLoggerLevel.DEBUG,
            serverLogLevel: environment.production ? NgxLoggerLevel.INFO : NgxLoggerLevel.OFF, // only log to server for production
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
        FontAwesomeModule], providers: [
        FilterService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpErrorInterceptor,
            multi: true
        },
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }
