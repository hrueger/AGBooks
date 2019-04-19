import { Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import { NavbarService } from '../services/navbar.service';
import { AuthenticationService } from '../services/authentication.service';
import { first } from 'rxjs/operators';
import { AlertService } from '../services/alert.service';
import { RemoteService } from '../services/remote.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss']
})
export class Step2Component implements OnInit {
  registrationDone: boolean = false;
  infoForm: FormGroup;
  grades: String[] = ["5a", "5b", "5c", "5d", "5e", "6a", "6b", "6c", "6d", "6e", "7a", "7b", "7c", "7d", "7e", "8a", "8b", "8c", "8d", "8e", "9a", "9b", "9c", "9d", "9e", "10a", "10b", "10c", "10d", "10e", "Q11", "Q12"];
  submitted: boolean = false;

  constructor(
    private NavbarService: NavbarService, 
    private remoteService: RemoteService, 
    private router: Router,
    private alertService: AlertService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.NavbarService.setStep(2);
    this.infoForm = this.formBuilder.group({
      teacher: ["", Validators.required],
      teacherShort: ["", Validators.required],
      room: ["", Validators.required],
      grade: ["", Validators.required],
      classSize: ["", Validators.required]
    });

    this.remoteService
      .getPrefilledValuesRegisterUser()
      .subscribe(
        data => {
          this.infoForm = this.formBuilder.group({
            teacher: [data.teacher, Validators.required],
            teacherShort: [data.teacherShort, Validators.required],
            room: [data.room, Validators.required],
            grade: [data.grade, Validators.required],
            classSize: [data.classSize, Validators.required]
          });
        },
        error => {
          this.alertService.error(error);
          
        }
      );
    
    

  }

  get f() {
    return this.infoForm.controls;
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
      .registerUser(this.f.teacher.value, this.f.teacherShort.value, this.f.grade.value, this.f.room.value, this.f.classSize.value)
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
