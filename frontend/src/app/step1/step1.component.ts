import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NavbarService } from "../services/navbar.service";
import { AuthenticationService } from "../services/authentication.service";

@Component({
    selector: "app-step1",
    templateUrl: "./step1.component.html",
    styleUrls: ["./step1.component.scss"],
})
export class Step1Component implements OnInit {
    registrationDone = false;
    constructor(
        private navbarService: NavbarService,
        private authenticationService: AuthenticationService,
        private router: Router,
    ) { }

    public ngOnInit(): void {
        this.navbarService.setStep(1);

        if (!this.authenticationService.currentUserValue) {
            this.authenticationService.register().subscribe(
                () => {
                    // console.log("hi");
                    this.registrationDone = true;
                },
            );
        } else {
            // console.log("schon registriert!");
            // console.log(this.AuthenticationService.currentUserValue);
            this.registrationDone = true;
        }
    }

    public next(url: string): void {
        this.router.navigateByUrl(url);
    }
}
