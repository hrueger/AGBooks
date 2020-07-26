import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { AlertService } from "./alert.service";
import { Book } from "../models/book";
import { getApiUrl } from "../helpers/utils";

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
            .post<string>(`${getApiUrl()}`, {
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

    getBooks(): Observable<Book[]> {
        const action = "books";
        return this.http.post<Book[]>(`${getApiUrl()}`, { action }).pipe(
            tap(() => this.log("fetched books")),
            catchError(this.handleError<Book[]>("getBooks", [])),
        );
    }

    getClassSize(): Observable<number> {
        const action = "classSize";
        return this.http.post<number>(`${getApiUrl()}`, { action }).pipe(
            tap(() => this.log("fetched class size")),
            catchError(this.handleError<number>("getClassSize", null)),
        );
    }

    orderBooks(books: Book[]): Observable<boolean> {
        const action = "order";
        return this.http.post<boolean>(`${getApiUrl()}`, { action, books }).pipe(
            tap(() => this.log("ordered books")),
            catchError(this.handleError<boolean>("orderBooks", false)),
        );
    }

    submitOrder(): Observable<boolean> {
        const action = "submit";
        return this.http.post<boolean>(`${getApiUrl()}`, { action }).pipe(
            tap(() => this.log("submitted order")),
            catchError(this.handleError<boolean>("submitOrder", false)),
        );
    }
    acceptOrder(): Observable<boolean> {
        const action = "accept";
        return this.http.post<boolean>(`${getApiUrl()}`, { action }).pipe(
            tap(() => this.log("accepted order")),
            catchError(this.handleError<boolean>("acceptOrder", false)),
        );
    }

    getBooksForCheck(): Observable<Book[]> {
        const action = "check";
        return this.http.post<Book[]>(`${getApiUrl()}`, { action }).pipe(
            tap(() => this.log("fetched books for check")),
            catchError(this.handleError<Book[]>("getBooksForCheck", [])),
        );
    }

    getPrefilledValuesRegisterUser(): Observable<any> {
        const action = "prefilledValuesRegisterUser";
        return this.http.post<any>(`${getApiUrl()}`, { action }).pipe(
            tap(() => this.log("fetched prefilled values for register user")),
            catchError(this.handleError<any>("getPrefilledValuesRegisterUser", [])),
        );
    }
    getHandoverCode(): Observable<string> {
        const action = "handoverCode";
        return this.http.post<string>(`${getApiUrl()}`, { action }).pipe(
            tap(() => this.log("fetched handover code")),
            catchError(this.handleError<string>("getHandoverCode", "")),
        );
    }
    checkHandoverCode(handoverCode: number): Observable<string> {
        const action = "checkHandoverCode";
        return this.http
            .post<string>(`${getApiUrl()}`, { action, handoverCode })
            .pipe(
                tap(() => this.log("checked handover code")),
                catchError(this.handleError<string>("checkHandoverCode", "")),
            );
    }
    getReturnTo(): Observable<string> {
        const action = "returnTo";
        return this.http.post<string>(`${getApiUrl()}`, { action }).pipe(
            tap(() => this.log("got return to")),
            catchError(this.handleError<string>("getReturnTo", "")),
        );
    }

    private handleError<T>(operation = "operation", result?: T) {
        return (error: any): Observable<T> => {
            // eslint-disable-next-line no-console
            console.error(error);

            this.log(`${operation} failed: ${error.message}`);

            this.alertService.error(error.error.text, true);

            return of(result as T);
        };
    }

    private log(message: string) {
        // eslint-disable-next-line no-console
        console.log(`Remote Service Log: ${message}`);
    }
}
