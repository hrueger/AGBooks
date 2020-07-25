import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { User } from "../_models/user";
import config from "../config/config";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};

@Injectable({ providedIn: "root" })
export class AuthenticationService {

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }
  public currentUser: Observable<User>;
  private currentUserSubject: BehaviorSubject<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(sessionStorage.getItem("currentUser")),
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public login(email: string, password: string) {
    const action = "authenticateBackend";
    return this.http
      .post<any>(
        config.apiUrl,
        {
          action,
          email,
          password,
        },
        httpOptions,
      )
      .pipe(
        map((user) => {
          // login successful if there's a jwt token in the response
          console.log(user);
          if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            sessionStorage.setItem("currentUser", JSON.stringify(user));
            this.currentUserSubject.next(user);
          }

          return user;
        }),
      );
  }

  public logout() {
    // remove user from local storage to log user out
    sessionStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
  }
}