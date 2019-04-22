/*import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'BeihilfeRechner';
}
*/
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "./_models/user";

import { AuthenticationService } from "./_services/authentication.service";

@Component({ selector: "app", templateUrl: "app.component.html" })
export class AppComponent {
  currentUser: User;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(
      x => (this.currentUser = x)
    );
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(["/login"]);
  }
  ngOnInit() {}
}
