import { Component, OnInit } from '@angular/core';
import {NavbarService} from "../services/navbar.service"

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  stepNumber: number = 0;
  pbwidth: String = "90%";
  totalSteps: number = 7;
  constructor(private NavbarService: NavbarService) { }

  ngOnInit() {
    this.NavbarService.change.subscribe(step => {
      this.stepNumber = step;
      var percent:number = 100 / this.totalSteps *  step;
      this.pbwidth = `${percent}%`;
    });
  }
  /*public setStep(step:number): void {
    this.stepnumber = step;
    var percent:number = 100 / this.totalSteps *  step;
    this.pbwidth = `${percent}%`;
    //console.warn(this.stepnumber);
  }*/
}
