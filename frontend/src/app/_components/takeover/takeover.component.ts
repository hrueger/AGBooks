import { Component } from "@angular/core";
import { RemoteService } from "../../_services/remote.service";
import { AuthenticationService } from "../../_services/authentication.service";
import { NavbarService } from "../../_services/navbar.service";

@Component({
    selector: "app-takeover",
    templateUrl: "./takeover.component.html",
    styleUrls: ["./takeover.component.scss"],
})
export class TakeoverComponent {
    handoverSuccess = false;
    showResult = false;
    code: any;
    checking = false;
    returnTo: string;
    constructor(
        private remoteService: RemoteService,
        private authenticationService: AuthenticationService,
        private navbarService: NavbarService,
    ) { }

    public changed(): void {
        const { length } = (this.code || 0).toString();
        this.showResult = length >= 5;
        if (this.showResult && !this.checking && !this.handoverSuccess) {
            this.checking = true;

            this.remoteService.post("handover/checkCode", { code: this.code }).subscribe((success) => {
                if (success && success !== "") {
                    this.handoverSuccess = true;

                    this.authenticationService.setNewToken(success);

                    this.remoteService
                        .post("handover/returnTo")
                        .subscribe((data) => {
                            this.returnTo = data;
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