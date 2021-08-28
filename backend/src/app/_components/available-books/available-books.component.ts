import { Component, OnInit } from "@angular/core";
import {
    FormBuilder, FormControl, FormGroup, Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AlertService } from "../../_services/alert.service";
import { RemoteService } from "../../_services/remote.service";

@Component({
    selector: "app-available-books",
    styleUrls: ["./available-books.component.scss"],
    templateUrl: "./available-books.component.html",
})
export class AvailableBooksComponent implements OnInit {
  public books: any[];
  public apiUrl = "/api/";
  public registrationDone = false;
  public infoForm: FormGroup;
  public submitted = false;

  public showUebergangsklasse = false;
  public showBranch = false;
  public showLanguage = false;

  constructor(
    private remoteService: RemoteService,
    private router: Router,
    private alertService: AlertService,
    private formBuilder: FormBuilder,

  ) { }

  public noWhitespaceValidator(control: FormControl): any {
      let isWhitespace;
      if (typeof control.value == "string") {
          isWhitespace = (control.value || "").trim().length === 0;
      } else {
          isWhitespace = (control.value || "").length === 0;
      }
      const isValid = !isWhitespace;
      return isValid ? null : { whitespace: true };
  }

  public ngOnInit(): void {
      this.infoForm = this.formBuilder.group({
          grade: ["", Validators.required],
          branch: ["", Validators.required],
          uebergang: ["", Validators.required],
          language: ["", Validators.required],
      });
      this.f.grade.valueChanges.subscribe((value: string) => {
          this.gradeChanged(value);
      });
      this.f.uebergang.valueChanges.subscribe((value: string) => {
          this.uebergangChanged(value);
      });
      this.gradeChanged(this.f.grade.value);
      this.uebergangChanged(this.f.uebergang.value);
  }

  get f(): any {
      return this.infoForm.controls;
  }

  public uebergangChanged(value: string): void {
      // console.log(value);
      if (value == "j") {
          this.f.language.setValue("");
          this.f.branch.setValue("");
          this.f.language.disable();
          this.f.branch.disable();
          this.showBranch = false;
          this.showLanguage = false;
      } else if (value == "n") {
          this.f.language.enable();
          this.f.branch.enable();
          this.showBranch = true;
          this.showLanguage = true;
      }
  }

  public gradeChanged(value: string): void {
      if (value.startsWith("5") || value.startsWith("Q")) {
          this.f.language.setValue("");
          this.f.language.disable();
          this.showLanguage = false;
      } else {
          this.f.language.enable();
          this.showLanguage = true;
      }
      if (
          value.startsWith("5")
      || value.startsWith("6")
      || value.startsWith("7")
      || value.startsWith("Q")
      ) {
          this.f.branch.setValue("");
          this.f.branch.disable();
          this.showBranch = false;
      } else {
          this.f.branch.enable();
          this.showBranch = true;
      }
      if (value.startsWith("10")) {
          this.f.uebergang.enable();
          this.showUebergangsklasse = true;
      } else {
          this.f.uebergang.setValue("");
          this.f.uebergang.disable();
          this.showUebergangsklasse = false;
      }
  }

  public onSubmit(): void {
      this.submitted = true;
      if (this.infoForm.invalid) {
          return;
      }
      this.remoteService.post("books/list", {
          grade: this.f.grade.value,
          language: this.f.language.value,
          branch: this.f.branch.value,
          uebergang: this.f.uebergang.value == "j",
      }).subscribe((data) => {
          this.books = data;
      });
  }
}
