import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { User } from "../models/user";
import { getApiUrl } from '../helpers/utils';

const httpOptions = {
    headers: new HttpHeaders({
        "Content-Type": "application/json",
    }),
};

@Injectable({ providedIn: "root" })
export class AuthenticationService {
    // private currentUserSubject: BehaviorSubject<User>;
    // public currentUser: Observable<User>;
    public currentUser: User;

    constructor(private http: HttpClient) {
        this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    }

    public get currentUserValue(): User {
        return this.currentUser;
    }

    public setNewToken(token: string): void {
        const user = this.currentUserValue || new User();
        user.token = token;
        sessionStorage.setItem("currentUser", JSON.stringify(user));
        this.currentUser = user;
    }

    public register(): Observable<any> {
        const action = "authenticate";

        return this.http
            .post<any>(
                `${getApiUrl()}auth/register`,
                {
                    action,
                },
                httpOptions,
            )
            .pipe(
                map((user) => {
                    // login successful if there's a jwt token in the response
                    if (user && user.token) {
                        // store user details and jwt token in local storage
                        // to keep user logged in between page refreshes
                        sessionStorage.setItem("currentUser", JSON.stringify(user));
                        this.currentUser = user;
                    }

                    return user;
                }),
            );
    }

    public registerAgain(): Observable<any> {
        return this.register();
    }

    public logout(): void {
        // remove user from local storage to log user out
        sessionStorage.removeItem("currentUser");
        this.currentUser = null;
    }
}
