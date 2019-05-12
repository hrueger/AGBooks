import { Component, OnInit } from "@angular/core";
import { NavbarService } from "../services/navbar.service";

@Component({
  selector: "app-step6",
  templateUrl: "./step6.component.html",
  styleUrls: ["./step6.component.scss"]
})
export class Step6Component implements OnInit {
  constructor(private NavbarService: NavbarService) {}

  ngOnInit() {
    this.NavbarService.setStep(6);
  }
}
