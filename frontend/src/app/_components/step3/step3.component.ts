import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { first } from "rxjs/operators";
import {
    FormBuilder, FormGroup, FormArray,
} from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RemoteService } from "../../_services/remote.service";
import { Book } from "../../_models/Book";
import { NavbarService } from "../../_services/navbar.service";

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
    apiUrl = "/api/";
    constructor(
        public modalService: NgbModal,
        private remoteService: RemoteService,
        private router: Router,
        private formBuilder: FormBuilder,
        private navbarService: NavbarService,
    ) {
        this.booksForm = this.formBuilder.group({
            books: this.formBuilder.array([]),
        });
    }

    public ngOnInit(): void {
        this.navbarService.setStep(3);
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
                                comment: book.comment,
                                subject: book.subject,
                                id: book.id,
                            }),
                        );
                    });
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
            .post("order", { books: (this.booksForm.controls.books.value as {id: number, bookNumber: number}[]).map((b) => ({ id: b.id, number: b.bookNumber })) })
            .pipe(first())
            .subscribe(
                (data) => {
                    if (data.success == true) {
                        this.router.navigate(["step", "4"]);
                    }
                },
            );
    }
    public previous(): void {
        this.router.navigate(["step", "2"]);
    }
}
