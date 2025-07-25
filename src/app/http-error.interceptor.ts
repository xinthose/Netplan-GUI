import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { retry, catchError } from "rxjs/operators";

// services
import { NotificationService } from "@progress/kendo-angular-notification";

// other
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private notificationService: NotificationService,
    private logger: NGXLogger,  // trace, debug, info, log, warn, error, fatal
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          // get error message
          let errorMessage = "";
          if (error.error instanceof ErrorEvent) {  // client-side error
            errorMessage = "Error: " + error.error.message;
          } else {  // server-side error
            errorMessage = "Error Code: " + error.status.toString() + "; Message: " + error.message;
          }

          // log error
          this.logger.error("HTTP error >> " + errorMessage);

          // show popup
          this.notificationService.show({
            content: errorMessage,
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

          // return
          return throwError(() => new Error(errorMessage))
        })
      )
  }
}
