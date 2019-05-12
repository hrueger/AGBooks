import { Component, OnInit } from "@angular/core";
import { RemoteService } from "../services/remote.service";
import { AuthenticationService } from "../services/authentication.service";
import config from "../config/config";

@Component({
  selector: "app-handover",
  templateUrl: "./handover.component.html",
  styleUrls: ["./handover.component.scss"]
})
export class HandoverComponent implements OnInit {
  code: string = "Code wird generiert...";
  success: boolean = false;
  constructor(
    private remoteService: RemoteService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.remoteService.getHandoverCode().subscribe(code => {
      this.code = code;

      var token = this.authenticationService.currentUserValue.token;
      let source = new EventSource(
        `${config.apiUrl}?queueHandover&token=` + token
      );
      source.addEventListener("update", message => {
        console.log(message);
        //@ts-ignore
        let data = JSON.parse(message.data);

        this.success = data.success;
        if (data.success) {
          this.authenticationService.logout();
        }
      });
    });
  }
}
