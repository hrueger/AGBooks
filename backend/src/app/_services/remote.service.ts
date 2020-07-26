import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { Order } from "../_models/order";
import { AlertService } from "./alert.service";
import config from "../config/config";

@Injectable({ providedIn: "root" })
export class RemoteService {
    constructor(private http: HttpClient, private alertService: AlertService) {}
    public getAvalibleBooksByClass(data: Record<string, unknown>): Observable<any[]> {
        const action = "avalibleBooks backend";
        return this.http.post<Order[]>(`${config.apiUrl}`, { action, ...data }).pipe(
            tap(() => this.log("fetched avalible books")),
            catchError(this.handleError<Order[]>("getAvalibleBooksByClass", [])),
        );
    }
    public getAnalysisData(): Observable<any> {
        const action = "analysis backend";
        return this.http.post<Order[]>(`${config.apiUrl}`, { action }).pipe(
            tap(() => this.log("fetched analysis")),
            catchError(this.handleError<Order[]>("getAnalysisData", [])),
        );
    }

    public getOrders(): Observable<Order[]> {
        const action = "orders backend";
        return this.http.post<Order[]>(`${config.apiUrl}`, { action }).pipe(
            tap(() => this.log("fetched orders")),
            catchError(this.handleError<Order[]>("getOrders", [])),
        );
    }
    public setOrderDone(id: number): Observable<boolean> {
        const action = "setOrderDone backend";
        return this.http.post<boolean>(`${config.apiUrl}`, { action, id }).pipe(
            tap(() => this.log("setOrderDone")),
            catchError(this.handleError<boolean>("setOrderDone", false)),
        );
    }
    public setOrderAccepted(id: number): Observable<boolean> {
        const action = "setOrderAccepted backend";
        return this.http.post<boolean>(`${config.apiUrl}`, { action, id }).pipe(
            tap(() => this.log("setOrderAccepted")),
            catchError(this.handleError<boolean>("setOrderAccepted", false)),
        );
    }
    public deleteOrder(id: number): Observable<boolean> {
        const action = "deleteOrder backend";
        return this.http.post<boolean>(`${config.apiUrl}`, { action, id }).pipe(
            tap(() => this.log("deleteOrder")),
            catchError(this.handleError<boolean>("deleteOrder", false)),
        );
    }
    public getHandoverCodeForOrder(token: string): Observable<boolean> {
        const action = "getHandoverCodeForOrder backend";
        return this.http.post<boolean>(`${config.apiUrl}`, { action, token }).pipe(
            tap(() => this.log("getHandoverCodeForOrder")),
            catchError(this.handleError<boolean>("getHandoverCodeForOrder", false)),
        );
    }
    /* getHeroNo404<Data>(id: number): Observable<User> {
    const url = `${this.apiUrl}/?id=${id}`;
    return this.http.get<User[]>(url).pipe(
      map(heroes => heroes[0]), // returns a {0|1} element array
      tap(h => {
        const outcome = h ? `fetched` : `did not find`;
        this.log(`${outcome} hero id=${id}`);
      }),
      catchError(this.handleError<User>(`getHero id=${id}`))
    );
  }

  getHero(id: number): Observable<User> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<User>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<User>(`getHero id=${id}`))
    );
  }

  searchHeroes(term: string): Observable<User[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<User[]>(`${this.apiUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<User[]>("searchHeroes", []))
    );
  }

  addHero(hero: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, hero, httpOptions).pipe(
      tap((newHero: User) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<User>("addHero"))
    );
  }

  deleteHero(hero: User | number): Observable<User> {
    const id = typeof hero === "number" ? hero : hero.id;
    const url = `${this.apiUrl}/${id}`;

    return this.http.delete<User>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<User>("deleteHero"))
    );
  }

  updateHero(hero: User): Observable<any> {
    return this.http.put(this.apiUrl, hero, httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>("updateHero"))
    );
  } */

    private handleError<T>(operation = "operation", result?: T) {
        return (error: any): Observable<T> => {
            // eslint-disable-next-line no-console
            console.error(error);

            this.log(`${operation} failed: ${error.message}`);

            this.alertService.error(error);

            return of(result as T);
        };
    }

    private log(message: string) {
        // eslint-disable-next-line no-console
        console.log(`Remote Service Log: ${message}`);
    }
}
