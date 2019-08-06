import { Component, OnInit } from "@angular/core";
import { NavbarService } from "../services/navbar.service";
import Stepper from 'bs-stepper';

@Component({
  selector: "app-step7",
  templateUrl: "./step7.component.html",
  styleUrls: ["./step7.component.scss"]
})
export class Step7Component implements OnInit {
  private stepper: Stepper;
  constructor(private NavbarService: NavbarService) { }
  next() {
    this.stepper.next();
  }
  ngOnInit() {
    this.NavbarService.setStep(7);
    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    })
  }
}
