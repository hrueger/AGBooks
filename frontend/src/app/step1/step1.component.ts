import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NavbarService } from "../services/navbar.service";
import { AuthenticationService } from "../services/authentication.service";
import { first } from "rxjs/operators";
import { AlertService } from "../services/alert.service";

@Component({
  selector: "app-step1",
  templateUrl: "./step1.component.html",
  styleUrls: ["./step1.component.scss"]
})
export class Step1Component implements OnInit {
  registrationDone: boolean = false;
  constructor(
    private NavbarService: NavbarService,
    private AuthenticationService: AuthenticationService,
    private router: Router,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.NavbarService.setStep(1);

    if (!this.AuthenticationService.currentUserValue) {
      this.AuthenticationService.register().subscribe(
        data => {
          //console.log("hi");
          this.registrationDone = true;
        },
        error => {
          this.alertService.error(error);
        }
      );
    } else {
      //console.log("schon registriert!");
      //console.log(this.AuthenticationService.currentUserValue);
      this.registrationDone = true;
    }
  }

  next(url) {
    this.router.navigateByUrl(url);
  }
}
