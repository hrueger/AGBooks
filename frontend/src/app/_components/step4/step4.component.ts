import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { first } from "rxjs/operators";
import { NavbarService } from "../../_services/navbar.service";
import { AlertService } from "../../_services/alert.service";
import { RemoteService } from "../../_services/remote.service";
import { Book } from "../../_models/book";

@Component({
    selector: "app-step4",
    templateUrl: "./step4.component.html",
    styleUrls: ["./step4.component.scss"],
})
export class Step4Component implements OnInit {
    books: Book[] = [];
    hasAlerts = false;

    constructor(
        private navbarService: NavbarService,
        private remoteService: RemoteService,
        private router: Router,
        private alertService: AlertService,

    ) { }

    public ngOnInit(): void {
        this.navbarService.setStep(4);

        this.remoteService.get("order").pipe(first()).subscribe(
            (books) => {
                this.books = books;
                this.hasAlerts = this.books.filter((b) => !!b.alert).length > 0;
            },
        );
    }
    public previous(): void {
        this.router.navigate(["step", "3"]);
    }
    public next(): void {
        this.remoteService.post("order/submit").subscribe(
            (data) => {
                if (data.success == true) {
                    this.router.navigate(["step", "5"]);
                } else {
                    this.alertService.error(data.toString());
                }
            },
        );
    }
}
