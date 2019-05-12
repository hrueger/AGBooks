import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

import config from "../config/config";
import { User } from "../models/user";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
};

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  //private currentUserSubject: BehaviorSubject<User>;
  //public currentUser: Observable<User>;
  public currentUser: User;

  constructor(private http: HttpClient) {
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  }

  public get currentUserValue(): User {
    return this.currentUser;
  }

  setNewToken(token: string) {
    var user = this.currentUserValue || new User();
    user.token = token;
    sessionStorage.setItem("currentUser", JSON.stringify(user));
    this.currentUser = user;
  }

  register(): Observable<any> {
    var action = "authenticate";

    return this.http
      .post<any>(
        `${config.apiUrl}?authenticate`,
        {
          action
        },
        httpOptions
      )
      .pipe(
        map(user => {
          //console.log("test");
          // login successful if there's a jwt token in the response
          //console.log(user);
          if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            sessionStorage.setItem("currentUser", JSON.stringify(user));
            this.currentUser = user;
          }

          return user;
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    sessionStorage.removeItem("currentUser");
    this.currentUser = null;
  }
}
