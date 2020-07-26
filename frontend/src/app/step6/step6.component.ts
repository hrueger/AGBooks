import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NavbarService } from "../services/navbar.service";

@Component({
    selector: "app-step6",
    templateUrl: "./step6.component.html",
    styleUrls: ["./step6.component.scss"],
})
export class Step6Component implements OnInit {
    constructor(private navbarService: NavbarService, private router: Router) { }

    public ngOnInit(): void {
        this.navbarService.setStep(6);
    }

    public next(url: string): void {
        this.router.navigateByUrl(url);
    }
}
