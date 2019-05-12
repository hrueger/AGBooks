import { Component, OnInit } from "@angular/core";
import { RemoteService } from "../services/remote.service";
import { empty } from "rxjs";
import { AuthenticationService } from "../services/authentication.service";

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
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {}

  changed(event) {
    var length = (this.code || 0).toString().length;
    this.showResult = length >= 5 ? true : false;
    if (this.showResult) {
      this.checking = true;

      this.remoteService.checkHandoverCode(this.code).subscribe(success => {
        if (success && success !== "") {
          this.handoverSuccess = true;

          this.authenticationService.setNewToken(success);

          this.remoteService
            .getReturnTo()
            .subscribe(data => (this.returnTo = data));
        } else {
          this.handoverSuccess = false;
        }

        this.checking = false;
      });
    }
  }
}
