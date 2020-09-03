import { Component, OnInit } from "@angular/core";
import Stepper from "bs-stepper";
import { NavbarService } from "../../_services/navbar.service";
import { RemoteService } from "../../_services/remote.service";

@Component({
    selector: "app-step7",
    templateUrl: "./step7.component.html",
    styleUrls: ["./step7.component.scss"],
})
export class Step7Component implements OnInit {
    public books: any[] = [];
    private stepper: Stepper;
    constructor(private navbarService: NavbarService, private remoteService: RemoteService) { }
    public next(): void {
        this.stepper.next();
    }
    public ngOnInit(): void {
        this.navbarService.setStep(7);
        this.stepper = new Stepper(document.querySelector("#stepper1"), {
            linear: false,
            animation: true,
        });
        this.remoteService.get("books").subscribe((books) => {
            this.books = books;
        });
    }
}
