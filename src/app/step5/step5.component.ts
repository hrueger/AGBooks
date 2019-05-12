import { Component, OnInit } from "@angular/core";
import { NavbarService } from "../services/navbar.service";
import { RemoteService } from "../services/remote.service";
import { AlertService } from "../services/alert.service";
import { Router } from "@angular/router";
import { AuthenticationService } from "../services/authentication.service";

import config from "../config/config";

@Component({
  selector: "app-step5",
  templateUrl: "./step5.component.html",
  styleUrls: ["./step5.component.scss"]
})
export class Step5Component implements OnInit {
  ordersLeft: String = "...";
  orderReady: boolean = false;

  constructor(
    private NavbarService: NavbarService,
    private remoteService: RemoteService,
    private router: Router,
    private alertService: AlertService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.NavbarService.setStep(5);
    var token = this.authService.currentUserValue.token;
    let source = new EventSource(`${config.apiUrl}?queue&token=` + token);
    source.addEventListener("update", message => {
      //console.log(message);
      //@ts-ignore
      let data = JSON.parse(message.data);

      this.ordersLeft = data.ordersLeft;
      this.orderReady = data.orderReady;
    });
  }
  previous() {
    this.router.navigate(["step", "4"]);
  }
  btnAccept() {
    this.remoteService.acceptOrder().subscribe(data => {
      if (data == true) {
        this.router.navigate(["step", "6"]);
      }
    });
  }
}
