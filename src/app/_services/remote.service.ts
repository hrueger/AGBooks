import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { AlertService } from "../_services/alert.service";
import { Order } from "../_models/order";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "http://localhost"
  })
};

@Injectable({ providedIn: "root" })
export class RemoteService {
  public apiUrl = `http://localhost/AGBooks_NEU/api/`;

  constructor(private http: HttpClient, private alertService: AlertService) {}

  getOrders(): Observable<Order[]> {
    var action = "orders backend";
    return this.http.post<Order[]>(`${this.apiUrl}`, { action }).pipe(
      tap(_ => this.log("fetched orders")),
      catchError(this.handleError<Order[]>("getOrders", []))
    );
  }
  setOrderDone(id: number): Observable<boolean> {
    var action = "setOrderDone backend";
    return this.http.post<boolean>(`${this.apiUrl}`, { action, id: id }).pipe(
      tap(_ => this.log("setOrderDone")),
      catchError(this.handleError<boolean>("getOrders", false))
    );
  }
  /*getHeroNo404<Data>(id: number): Observable<User> {
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
  }*/

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      this.log(`${operation} failed: ${error.message}`);

      this.alertService.error(error);

      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(`Remote Service Log: ${message}`);
  }
}
