import { Component, OnInit } from "@angular/core";
import { NavbarService } from "../services/navbar.service";

@Component({
  selector: "app-step7",
  templateUrl: "./step7.component.html",
  styleUrls: ["./step7.component.scss"]
})
export class Step7Component implements OnInit {
  constructor(private NavbarService: NavbarService) {}

  ngOnInit() {
    this.NavbarService.setStep(7);
  }
}
