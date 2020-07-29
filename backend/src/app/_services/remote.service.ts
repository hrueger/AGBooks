import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { AlertService } from "./alert.service";
import { getApiUrl } from "../_utils/utils";

@Injectable({ providedIn: "root" })
export class RemoteService {
    constructor(private http: HttpClient, private alertService: AlertService) { }

    public get(url: string): Observable<any> {
        return this.http.get<any>(`${getApiUrl()}${url}`).pipe(
            tap(() => this.log(`got ${url}`)),
            catchError(this.handleError<any>(url)),
        );
    }

    public post(url: string, data: Record<string, unknown>): Observable<any> {
        return this.http.post<any>(`${getApiUrl()}${url}`, data).pipe(
            tap(() => this.log(`posted ${url}`)),
            catchError(this.handleError<any>(url)),
        );
    }

    public delete(url: string): Observable<any> {
        return this.http.delete<any>(`${getApiUrl()}${url}`).pipe(
            tap(() => this.log(`deleted ${url}`)),
            catchError(this.handleError<any>(url)),
        );
    }

    private handleError<T>(operation = "operation", result?: T) {
        return (error: any): Observable<T> => {
            // eslint-disable-next-line no-console
            console.error(error);

            this.log(`${operation} failed: ${error.message}`);

            return of(result as T);
        };
    }

    private log(message: string) {
        // eslint-disable-next-line no-console
        console.log(`Remote Service Log: ${message}`);
    }
}
