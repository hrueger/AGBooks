import { Component, NgZone } from "@angular/core";
import { Application, Page } from "@nativescript/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Router, ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { DashboardComponentCommon } from "./dashboard.component.common";
import { AlertService } from "../../_services/alert.service";
import { AuthenticationService } from "../../_services/authentication.service";
import { RemoteService } from "../../_services/remote.service";
import { Order } from "../../_models/Order";

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent extends DashboardComponentCommon {
    public viewOrderList = true;
    constructor(
        router: Router,
        route: ActivatedRoute,
        title: Title,
        alertService: AlertService,
        authenticationService: AuthenticationService,
        remoteService: RemoteService,
        activeRoute: ActivatedRoute,
        zone: NgZone,
        page: Page,
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
        page.actionBarHidden = true;
    }
    public onDrawerButtonTap(): void {
        const sideDrawer = Application.getRootView() as unknown as RadSideDrawer;
        sideDrawer.showDrawer();
    }

    public setCurrentOrder(order: Order): void {
        this.currentOrder = order;
        this.viewOrderList = false;
    }

    public refreshOrders(args: { object: any; }): void {
        const pullRefresh = args.object;
        this.ngOnInit(() => {
            pullRefresh.refreshing = false;
        });
    }
}
