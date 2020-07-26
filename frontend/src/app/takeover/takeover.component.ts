import { Component } from "@angular/core";
import { RemoteService } from "../services/remote.service";
import { AuthenticationService } from "../services/authentication.service";
import { NavbarService } from "../services/navbar.service";

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

            this.remoteService.checkHandoverCode(this.code).subscribe((success) => {
                if (success && success !== "") {
                    this.handoverSuccess = true;

                    this.authenticationService.setNewToken(success);

                    this.remoteService
                        .getReturnTo()
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
