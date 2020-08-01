import { Component, NgZone } from "@angular/core";
import { Application } from "@nativescript/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Router, ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { DashboardComponentCommon } from "./dashboard.component.common";
import { AlertService } from "../../_services/alert.service";
import { AuthenticationService } from "../../_services/authentication.service";
import { RemoteService } from "../../_services/remote.service";

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent extends DashboardComponentCommon {
    viewOrderList = true;
    constructor(
        router: Router,
        route: ActivatedRoute,
        title: Title,
        alertService: AlertService,
        authenticationService: AuthenticationService,
        remoteService: RemoteService,
        activeRoute: ActivatedRoute,
        zone: NgZone,
    ) {
        super(
            router,
            route,
            title,
            alertService,
            authenticationService,
            remoteService,
            activeRoute,
            zone,
        );
    }
    public showSideDrawer(): void {
        const sideDrawer = Application.getRootView() as unknown as RadSideDrawer;
        sideDrawer.showDrawer();
    }
}
