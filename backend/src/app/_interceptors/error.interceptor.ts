import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthenticationService } from "../_services/authentication.service";
import { AlertService } from "../_services/alert.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private authenticationService: AuthenticationService,
        private router: Router,
        private alertService: AlertService,
    ) { }

    public intercept(
        request: HttpRequest<any>,
        next: HttpHandler,
    ): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((err) => {
                // eslint-disable-next-line no-console
                console.error("Error in error.interceptor.ts: ", err, err.stack);

                if (err && err.error && err.error.logout) {
                    this.authenticationService.logout();
                    this.router.navigate(["login"]);
                }
                const error = err.error && err.error.error
                    ? err.error.error : err.error && err.error.message
                        ? err.error.message : err.statusText ? err.statusText : err || "Unbekannter Fehler!";
                this.alertService.error(error);
                return throwError(error);
            }),
        );
    }
}
