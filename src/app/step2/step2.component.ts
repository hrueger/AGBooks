import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NavbarService } from "../services/navbar.service";
import { AuthenticationService } from "../services/authentication.service";
import { first } from "rxjs/operators";
import { AlertService } from "../services/alert.service";
import { RemoteService } from "../services/remote.service";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";

@Component({
  selector: "app-step2",
  templateUrl: "./step2.component.html",
  styleUrls: ["./step2.component.scss"]
})
export class Step2Component implements OnInit {
  registrationDone: boolean = false;
  infoForm: FormGroup;
  submitted: boolean = false;

  showUebergangsklasse: boolean = false;
  showBranch: boolean = false;
  showLanguage: boolean = false;
  showCourse: boolean = false;

  constructor(
    private NavbarService: NavbarService,
    private remoteService: RemoteService,
    private router: Router,
    private alertService: AlertService,
    private formBuilder: FormBuilder,

  ) { }

  public noWhitespaceValidator(control: FormControl) {
    if (typeof control.value == "string") {
      var isWhitespace = (control.value || '').trim().length === 0;
    } else {
      var isWhitespace = (control.value || '').length === 0;
    }
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  ngOnInit() {
    this.NavbarService.setStep(2);
    this.infoForm = this.formBuilder.group({
      teacher: ["", [Validators.required, this.noWhitespaceValidator]],
      teacherShort: ["", [Validators.required, this.noWhitespaceValidator]],
      room: ["", [Validators.required, this.noWhitespaceValidator]],
      course: ["", [Validators.required, this.noWhitespaceValidator]],
      grade: ["", Validators.required],
      branch: ["", Validators.required],
      uebergang: ["", Validators.required],
      language: ["", Validators.required],
      classSize: ["", [Validators.required, this.noWhitespaceValidator]]
    });

    this.remoteService.getPrefilledValuesRegisterUser().subscribe(
      data => {
        this.infoForm = this.formBuilder.group({
          teacher: [data.teacher, [Validators.required, this.noWhitespaceValidator]],
          teacherShort: [data.teacherShort, [Validators.required, this.noWhitespaceValidator]],
          room: [data.room, [Validators.required, this.noWhitespaceValidator]],
          course: [data.course, [Validators.required, this.noWhitespaceValidator]],
          grade: [data.grade, Validators.required],
          language: [data.language, Validators.required],
          branch: [data.branch, Validators.required],
          uebergang: [data.uebergang, Validators.required],
          classSize: [data.classSize, [Validators.required, , this.noWhitespaceValidator]]
        });
        this.f.grade.valueChanges.subscribe(value => {
          this.gradeChanged(value);
        });
        this.f.uebergang.valueChanges.subscribe(value => {
          this.uebergangChanged(value);
        });
        this.gradeChanged(this.f.grade.value);
        this.uebergangChanged(this.f.uebergang.value);
      },
      error => {
        this.alertService.error(error);
      }
    );
  }

  get f() {
    return this.infoForm.controls;
  }

  uebergangChanged(value) {
    //console.log(value);
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

  gradeChanged(value) {
    if (value.startsWith("5") || value.startsWith("Q")) {
      this.f.language.setValue("");
      this.f.language.disable();
      this.showLanguage = false;
    } else {
      this.f.language.enable();
      this.showLanguage = true;
    }
    if (
      value.startsWith("5") ||
      value.startsWith("6") ||
      value.startsWith("7") ||
      value.startsWith("Q")
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

    if (value.startsWith("Q")) {
      this.showCourse = true;
      this.f.course.enable();
    } else {
      this.showCourse = false;
      this.f.course.disable();
      this.f.course.setValue("");
    }
  }

  onSubmit() {
    //console.log("here");
    this.submitted = true;
    // stop here if form is invalid
    if (this.infoForm.invalid) {
      return;
    }
    //console.log("hi");
    this.remoteService
      .registerUser(
        this.f.teacher.value,
        this.f.teacherShort.value,
        this.f.grade.value,
        this.f.course.value,
        this.f.language.value,
        this.f.branch.value,
        this.f.uebergang.value,
        this.f.room.value,
        this.f.classSize.value
      )
      .subscribe(
        data => {
          //console.warn("hi");
          this.router.navigate(["step", "3"]);
        },
        error => {
          this.alertService.error(error);
        }
      );
  }

  previous() {
    this.router.navigate(["step", "1"]);
  }
}
