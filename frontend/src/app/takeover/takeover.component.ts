import { Component, OnInit } from "@angular/core";
import { RemoteService } from "../services/remote.service";
import { empty } from "rxjs";
import { AuthenticationService } from "../services/authentication.service";
import { NavbarService } from '../services/navbar.service';

@Component({
  selector: "app-takeover",
  templateUrl: "./takeover.component.html",
  styleUrls: ["./takeover.component.scss"]
})
export class TakeoverComponent implements OnInit {
  handoverSuccess: boolean = false;
  showResult: boolean = false;
  code: any;
  checking: boolean = false;
  returnTo: string;
  constructor(
    private remoteService: RemoteService,
    private authenticationService: AuthenticationService,
    private navbarService: NavbarService
  ) { }

  ngOnInit() { }

  changed(event) {
    var length = (this.code || 0).toString().length;
    this.showResult = length >= 5 ? true : false;
    if (this.showResult && !this.checking && !this.handoverSuccess) {
      this.checking = true;

      this.remoteService.checkHandoverCode(this.code).subscribe(success => {

        if (success && success !== "") {
          this.handoverSuccess = true;

          this.authenticationService.setNewToken(success);

          this.remoteService
            .getReturnTo()
            .subscribe(data => {
              this.returnTo = data;
              console.log(parseInt(this.returnTo.split("/")[2]));
              this.navbarService.setStep(parseInt(this.returnTo.split("/")[2]));
            });
        } else {
          this.handoverSuccess = false;
        }

        this.checking = false;
      });
    }
  }
}
