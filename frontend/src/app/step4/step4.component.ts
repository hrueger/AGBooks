import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { first } from "rxjs/operators";
import { NavbarService } from "../services/navbar.service";
import { AlertService } from "../services/alert.service";
import { RemoteService } from "../services/remote.service";
import { Book } from "../models/book";

@Component({
    selector: "app-step4",
    templateUrl: "./step4.component.html",
    styleUrls: ["./step4.component.scss"],
})
export class Step4Component implements OnInit {
    books: Book[] = [];
    bookCount: number;

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
                this.bookCount = books.length;
            },
        );
    }
    public previous(): void {
        this.router.navigate(["step", "3"]);
    }
    public next(): void {
        this.remoteService.post("order/submit").subscribe(
            (data) => {
                if (data == true) {
                    this.router.navigate(["step", "5"]);
                } else {
                    this.alertService.error(data.toString());
                }
            },
        );
    }
}
