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

            this.remoteService.post("auth/takeover", { code: this.code }).subscribe((data) => {
                console.log(data);
                this.checking = false;
                if (data.success) {
                    this.handoverSuccess = true;
                    this.authenticationService.setNewToken(data.token);
                    this.returnTo = data.returnToStep;
                    this.navbarService.setStep(data.returnToStep);
                } else {
                    this.handoverSuccess = false;
                }
            });
        }
    }
}
