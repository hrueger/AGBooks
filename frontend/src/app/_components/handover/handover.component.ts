import { Component, OnInit } from "@angular/core";
import { RemoteService } from "../../_services/remote.service";
import { AuthenticationService } from "../../_services/authentication.service";
import { NavbarService } from "../../_services/navbar.service";
import { getApiUrl } from "../../_utils/utils";

@Component({
    selector: "app-handover",
    templateUrl: "./handover.component.html",
    styleUrls: ["./handover.component.scss"],
})
export class HandoverComponent implements OnInit {
    code = "Code wird generiert...";
    success = false;
    sse: EventSource;
    constructor(
        private remoteService: RemoteService,
        private authenticationService: AuthenticationService,
        private navbarService: NavbarService,
    ) { }

    public ngOnInit(): void {
        this.remoteService.post("auth/handover/code", {}).subscribe((code) => {
            this.code = code.code;

            const { token } = this.authenticationService.currentUserValue;
            this.sse = new EventSource(
                `${getApiUrl()}?queueHandover&token=${token}`,
            );
            this.sse.addEventListener("update", (message: any) => {
                const data = JSON.parse(message.data);

                this.success = data.success;
                if (data.success) {
                    this.sse.close();
                    this.authenticationService
                        .register()
                        .subscribe(() => {
                            this.navbarService.setStep(1);
                            this.navbarService.resetHighestStepHandover();
                        });
                }
            });
        });
    }
}
