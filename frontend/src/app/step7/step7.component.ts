import { Component, OnInit } from "@angular/core";
import Stepper from "bs-stepper";
import { NavbarService } from "../services/navbar.service";

@Component({
    selector: "app-step7",
    templateUrl: "./step7.component.html",
    styleUrls: ["./step7.component.scss"],
})
export class Step7Component implements OnInit {
    private stepper: Stepper;
    constructor(private navbarService: NavbarService) { }
    public next(): void {
        this.stepper.next();
    }
    public ngOnInit(): void {
        this.navbarService.setStep(7);
        this.stepper = new Stepper(document.querySelector("#stepper1"), {
            linear: false,
            animation: true,
        });
    }
}
