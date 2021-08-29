import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { AlertService } from "./alert.service";

@Injectable({ providedIn: "root" })
export class RemoteService {
    constructor(private http: HttpClient, private alertService: AlertService) { }

    registerUser(
        teacher: string,
        teacherShort: string,
        grade: string,
        course: string,
        language: string,
        branch: string,
        uebergang: boolean,
        room: number,
        classSize: number,
    ): Observable<string> {
        const action = "registerUser";

        return this.http
            .post<string>("/api/auth/userdata", {
                action,
                teacher,
                teacherShort,
                grade,
                course,
                language,
                branch,
                uebergang,
                room,
                classSize,
            })
            .pipe(
                tap(() => this.log("registered user")),
                catchError(this.handleError<string>("registerUser", "")),
            );
    }

    get(url: string): Observable<any> {
        return this.http.get<string>(`/api/${url}`).pipe(
            tap(() => this.log(`got ${url}`)),
            catchError(this.handleError<string>(`get ${url}`, "")),
        );
    }
    post(url: string, data?: Record<string, unknown>): Observable<any> {
        return this.http.post<string>(`/api/${url}`, data).pipe(
            tap(() => this.log(`posted ${url}`)),
            catchError(this.handleError<string>(`post ${url}`, "")),
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
