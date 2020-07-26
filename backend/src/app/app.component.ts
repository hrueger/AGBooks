import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "./_models/user";

import { AuthenticationService } from "./_services/authentication.service";

@Component({ selector: "app", templateUrl: "app.component.html", styleUrls: ["app.component.scss"] })
export class AppComponent {
    public currentUser: User;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
    ) {
        this.authenticationService.currentUser.subscribe((x) => {
            this.currentUser = x;
        });
    }

    public logout(): void {
        this.authenticationService.logout();
        this.router.navigate(["/login"]);
    }
}
