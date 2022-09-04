import { Component, OnInit } from "@angular/core";
import { NavbarService } from "../../_services/navbar.service";

@Component({
    selector: "app-navbar",
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
    stepNumber = 0;
    pbwidth = "90%";
    totalSteps = 6;
    constructor(private navbarService: NavbarService) { }

    public ngOnInit(): void {
        this.navbarService.change.subscribe((step) => {
            this.stepNumber = step;
            const percent: number = (100 / this.totalSteps) * step;
            this.pbwidth = `${percent}%`;
        });
    }
    /* public setStep(step:number): void {
      this.stepnumber = step;
      var percent:number = 100 / this.totalSteps *  step;
      this.pbwidth = `${percent}%`;
      //console.warn(this.stepnumber);
    } */
}
