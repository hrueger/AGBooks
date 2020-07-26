import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { first } from "rxjs/operators";
import {
    FormBuilder, FormGroup, FormArray,
} from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AlertService } from "../services/alert.service";
import { RemoteService } from "../services/remote.service";
import { Book } from "../models/book";
import { NavbarService } from "../services/navbar.service";
import { getApiUrl } from "../helpers/utils";

@Component({
    selector: "app-step3",
    templateUrl: "./step3.component.html",
    styleUrls: ["./step3.component.scss"],
})
export class Step3Component implements OnInit {
    books: Book[] = [];
    booksForm: FormGroup;
    fields: any;
    fieldProps: any;
    formControls = {};
    classSize: number = null;
    apiUrl = getApiUrl();
    constructor(
        public modalService: NgbModal,
        private remoteService: RemoteService,
        private router: Router,
        private alertService: AlertService,
        private formBuilder: FormBuilder,
        private navbarService: NavbarService,
    ) {
        this.booksForm = this.formBuilder.group({
            books: this.formBuilder.array([]),
        });
    }

    public ngOnInit(): void {
        this.navbarService.setStep(3);

        /* this.remoteService.getClassSize().subscribe(
          classSize => {
            this.classSize = classSize;

          },
          error => {
            this.alertService.error(error, true);
          }
        ); */
        this.remoteService
            .get("books")
            .pipe(first())
            .subscribe(
                (books) => {
                    this.books = books;
                    books.forEach((book: Book) => {
                        // eslint-disable-next-line no-shadow
                        const books = this.booksForm.controls.books as FormArray;
                        books.push(
                            this.formBuilder.group({
                                bookNumber: book.number,
                                name: book.name,
                                coverPath: book.coverPath,
                                subject: book.subject,
                                id: book.id,
                            }),
                        );
                    });
                },
                (error) => {
                    this.alertService.error(error.error.text, true);
                },
            );
    }
    public trackByFn(index: number): number {
        return index;
    }

    public onSubmit(): void {
        if (this.booksForm.invalid) {
            return;
        }
        this.remoteService
            .post("books/order", { books: this.booksForm.controls.books.value })
            .pipe(first())
            .subscribe(
                (data) => {
                    if (data == true) {
                        this.router.navigate(["step", "4"]);
                    }
                },
                (error) => {
                    this.alertService.error(error, true);
                },
            );
    }
    public previous(): void {
        this.router.navigate(["step", "2"]);
    }
}
