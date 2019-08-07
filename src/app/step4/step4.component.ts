import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { NavbarService } from '../services/navbar.service';
import { AuthenticationService } from '../services/authentication.service';
import { first } from 'rxjs/operators';
import { AlertService } from '../services/alert.service';
import { RemoteService } from '../services/remote.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Book } from '../models/book';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-step4',
  templateUrl: './step4.component.html',
  styleUrls: ['./step4.component.scss']
})
export class Step4Component implements OnInit {
  books: Book[] = [];
  bookCount: number;

  constructor(
    private NavbarService: NavbarService,
    private remoteService: RemoteService,
    private router: Router,
    private alertService: AlertService,

  ) { }

  ngOnInit() {
    this.NavbarService.setStep(4);

    this.remoteService.getBooksForCheck().pipe(first()).subscribe(
      books => {
        this.books = books;
        this.bookCount = books.length;
      },
      error => {
        this.alertService.error(error);
      }
    )
  }
  previous() {
    this.router.navigate(["step", "3"]);
  }
  next() {
    this.remoteService.submitOrder().subscribe(
      data => {
        if (data == true) {

          this.router.navigate(["step", "5"]);
        } else {
          this.alertService.error(data.toString());
        }
      },
      error => {
        this.alertService.error(error);
      });
  }
}





