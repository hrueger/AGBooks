import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NavbarService } from "../services/navbar.service";
import config from "../config/config";
import { first } from "rxjs/operators";
import { AlertService } from "../services/alert.service";
import { RemoteService } from "../services/remote.service";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { Book } from "../models/book";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-step3",
  templateUrl: "./step3.component.html",
  styleUrls: ["./step3.component.scss"]
})
export class Step3Component implements OnInit {
  books: Book[] = [];
  booksForm: FormGroup;
  fields: any;
  fieldProps: any;
  formControls = {};
  classSize: number = null;
  apiUrl = config.apiUrl;
  constructor(
    private NavbarService: NavbarService,
    private remoteService: RemoteService,
    private router: Router,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    public modalService: NgbModal
  ) {
    this.booksForm = this.formBuilder.group({
      books: this.formBuilder.array([])
    });
  }

  ngOnInit() {
    this.NavbarService.setStep(3);

    /*this.remoteService.getClassSize().subscribe(
      classSize => {
        this.classSize = classSize;
        
      },
      error => {
        this.alertService.error(error, true);
      }
    );*/
    this.remoteService
      .getBooks()
      .pipe(first())
      .subscribe(
        books => {
          this.books = books;
          books.forEach((book: Book, index: number) => {
            const books = this.booksForm.controls.books as FormArray;
            books.push(
              this.formBuilder.group({
                bookNumber: book.number,
                name: book.name,
                coverPath: book.coverPath,
                subject: book.subject,
                id: book.id
              })
            );
          });
        },
        error => {
          this.alertService.error(error.error.text, true);
        }
      );
  }
  trackByFn(index: any, item: any) {
    return index;
  }

  onSubmit() {
    if (this.booksForm.invalid) {
      return;
    }
    console.warn(this.booksForm.controls.books.value);
    this.remoteService
      .orderBooks(this.booksForm.controls.books.value)
      .pipe(first())
      .subscribe(
        data => {
          if (data == true) {
            this.router.navigate(["step", "4"]);
          }
        },
        error => {
          this.alertService.error(error, true);
        }
      );
  }
  previous() {
    this.router.navigate(["step", "2"]);
  }
}
