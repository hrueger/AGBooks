import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import config from "../config/config";
import { Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { AlertService } from "../services/alert.service";

import { Grade } from "../models/grade";
import { Book } from "../models/book";
const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "http://localhost"
  })
};

@Injectable({ providedIn: "root" })
export class RemoteService {
  constructor(private http: HttpClient, private alertService: AlertService) {}

  registerUser(
    teacher: String,
    teacherShort: String,
    grade: String,
    room: number,
    classSize: number
  ): Observable<String> {
    var action = "registerUser";

    return this.http
      .post<String>(`${config.apiUrl}`, {
        action,
        teacher,
        teacherShort,
        grade,
        room,
        classSize
      })
      .pipe(
        tap(_ => this.log("registered user")),
        catchError(this.handleError<String>("registerUser", ""))
      );
  }

  getBooks(): Observable<Book[]> {
    var action = "books";
    return this.http.post<Book[]>(`${config.apiUrl}`, { action }).pipe(
      tap(_ => this.log("fetched books")),
      catchError(this.handleError<Book[]>("getBooks", []))
    );
  }

  getClassSize(): Observable<number> {
    var action = "classSize";
    return this.http.post<number>(`${config.apiUrl}`, { action }).pipe(
      tap(_ => this.log("fetched class size")),
      catchError(this.handleError<number>("getClassSize", null))
    );
  }

  orderBooks(books: Book[]): Observable<boolean> {
    var action = "order";
    return this.http.post<boolean>(`${config.apiUrl}`, { action, books }).pipe(
      tap(_ => this.log("ordered books")),
      catchError(this.handleError<boolean>("orderBooks", false))
    );
  }

  submitOrder(): Observable<boolean> {
    var action = "submit";
    return this.http.post<boolean>(`${config.apiUrl}`, { action }).pipe(
      tap(_ => this.log("submitted order")),
      catchError(this.handleError<boolean>("submitOrder", false))
    );
  }
  acceptOrder(): Observable<boolean> {
    var action = "accept";
    return this.http.post<boolean>(`${config.apiUrl}`, { action }).pipe(
      tap(_ => this.log("accepted order")),
      catchError(this.handleError<boolean>("acceptOrder", false))
    );
  }

  getBooksForCheck(): Observable<Book[]> {
    var action = "check";
    return this.http.post<Book[]>(`${config.apiUrl}`, { action }).pipe(
      tap(_ => this.log("fetched books for check")),
      catchError(this.handleError<Book[]>("getBooksForCheck", []))
    );
  }

  getPrefilledValuesRegisterUser(): Observable<any> {
    var action = "prefilledValuesRegisterUser";
    return this.http.post<any>(`${config.apiUrl}`, { action }).pipe(
      tap(_ => this.log("fetched prefilled values for register user")),
      catchError(this.handleError<any>("getPrefilledValuesRegisterUser", []))
    );
  }
  getHandoverCode(): Observable<string> {
    var action = "handoverCode";
    return this.http.post<string>(`${config.apiUrl}`, { action }).pipe(
      tap(_ => this.log("fetched handover code")),
      catchError(this.handleError<string>("getHandoverCode", ""))
    );
  }
  checkHandoverCode(handoverCode): Observable<string> {
    var action = "checkHandoverCode";
    return this.http
      .post<string>(`${config.apiUrl}`, { action, handoverCode })
      .pipe(
        tap(_ => this.log("checked handover code")),
        catchError(this.handleError<string>("checkHandoverCode", ""))
      );
  }

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      this.log(`${operation} failed: ${error.message}`);

      this.alertService.error(error.error.text, true);

      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(`Remote Service Log: ${message}`);
  }
}
