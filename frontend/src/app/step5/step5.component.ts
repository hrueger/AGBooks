import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NavbarService } from "../services/navbar.service";
import { RemoteService } from "../services/remote.service";
import { AuthenticationService } from "../services/authentication.service";
import { getApiUrl } from "../helpers/utils";

@Component({
    selector: "app-step5",
    templateUrl: "./step5.component.html",
    styleUrls: ["./step5.component.scss"],
})
export class Step5Component implements OnInit {
    public ordersLeft: any = "...";
    public orderReady = false;

    constructor(
        private navbarService: NavbarService,
        private remoteService: RemoteService,
        private router: Router,
        private authService: AuthenticationService,
    ) { }

    public ngOnInit(): void {
        this.navbarService.setStep(5);
        const { token } = this.authService.currentUserValue;
        const source = new EventSource(`${getApiUrl()}?queue&token=${token}`);
        source.addEventListener("update", (message: any) => {
            const data = JSON.parse(message.data);
            this.ordersLeft = data.ordersLeft;
            this.orderReady = data.orderReady;
        });
    }
    public previous(): void {
        this.router.navigate(["step", "4"]);
    }
    public btnAccept(): void {
        this.remoteService.post("order/accept").subscribe((data) => {
            if (data == true) {
                this.router.navigate(["step", "6"]);
            }
        });
    }
}
