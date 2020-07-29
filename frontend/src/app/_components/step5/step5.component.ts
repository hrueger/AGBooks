import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { Router } from "@angular/router";
import { NavbarService } from "../../_services/navbar.service";
import { RemoteService } from "../../_services/remote.service";
import { AuthenticationService } from "../../_services/authentication.service";
import { getApiUrl } from "../../_utils/utils";

@Component({
    selector: "app-step5",
    templateUrl: "./step5.component.html",
    styleUrls: ["./step5.component.scss"],
})
export class Step5Component implements OnInit {
    public ordersLeft: any = "...";
    public orderReady = false;
    public error: any;

    constructor(
        private navbarService: NavbarService,
        private remoteService: RemoteService,
        private router: Router,
        private authService: AuthenticationService,
        private cdr: ChangeDetectorRef,
    ) { }

    public ngOnInit(): void {
        this.navbarService.setStep(5);
        const { token } = this.authService.currentUserValue;
        const source = new EventSource(`${getApiUrl()}order/live?authorization=${token}`);
        source.onmessage = (m) => {
            const data = JSON.parse(m.data);
            this.ordersLeft = data.ordersLeft;
            this.orderReady = data.orderReady;
            this.cdr.detectChanges();
        };
        source.onerror = (e) => {
            this.error = e;
            this.cdr.detectChanges();
            setTimeout(() => {
                // eslint-disable-next-line no-restricted-globals
                location.reload();
            }, 5000);
        };
    }

    public previous(): void {
        this.router.navigate(["step", "4"]);
    }
    public btnAccept(): void {
        this.remoteService.post("order/accept").subscribe((data) => {
            if (data.success == true) {
                this.router.navigate(["step", "6"]);
            }
        });
    }
}
