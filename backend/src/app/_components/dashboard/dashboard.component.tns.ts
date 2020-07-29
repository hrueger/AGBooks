import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { first } from "rxjs/operators";
import * as app from "tns-core-modules/application";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Order } from "../../_models/Order";
import { AlertService } from "../../_services/alert.service";
import { RemoteService } from "../../_services/remote.service";

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
    public currentOrder: Order = null;
    public orderCanBeDone = true;
    public orders: Order[] = [];
    public doneOrders: Order[] = [];
    public acceptedOrders: Order[] = [];
    // public sse: EventSource;

    constructor(
        private router: Router,
        private alertService: AlertService,
        private remoteService: RemoteService,
        private activeRoute: ActivatedRoute,
    ) { }
    public ngOnInit(): void {
        this.remoteService
            .get("order/all")
            .pipe(first())
            .subscribe(
                (orders) => {
                    if (orders) {
                        this.sortOrders(orders);
                        this.activeRoute.params.subscribe((routeParams) => {
                            if (routeParams.id) {
                                if (routeParams.type == "queue") {
                                    this.currentOrder = this.orders.find(
                                        (order) => order.id === routeParams.id,
                                    );
                                    this.orderCanBeDone = true;
                                } else if (routeParams.type == "done") {
                                    this.currentOrder = this.doneOrders.find(
                                        (order) => order.id === routeParams.id,
                                    );
                                    this.orderCanBeDone = false;
                                } else if (routeParams.type == "accepted") {
                                    this.currentOrder = this.acceptedOrders.find(
                                        (order) => order.id === routeParams.id,
                                    );
                                    this.orderCanBeDone = false;
                                }
                                /* this.orders.forEach(value => {
                    if (value.id == routeParams.id) {
                      this.currentOrder = value;
                      console.log(this.currentOrder);
                    }
                  }); */
                            } else {
                                this.navigateToTopOrder();
                            }
                        });
                    }
                },
            );
    }

    public orderDone(): void {
        this.remoteService.setOrderDone(this.currentOrder.id).subscribe((data) => {
            if (data == true) {
                this.doneOrders.push(this.currentOrder);
                this.orders = this.orders.filter(
                    (order) => order.id !== this.currentOrder.id,
                );
                this.currentOrder = null;
                this.navigateToTopOrder();
            }
        });
    }
    public navigateToTopOrder(): void {
        if (this.orders[0]) {
            this.router.navigate(["dashboard", "queue", this.orders[0].id]);
        } else {
            this.currentOrder = null;
        }
    }
    public sortOrders(orders: Order[]): void {
        if (orders.length) {
            this.orders = orders.filter(
                (order: any) => order.done == "0" && order.accepted == "0",
            );
            this.doneOrders = orders.filter(
                (order: any) => order.done == "1" && order.accepted == "0",
            );
            this.acceptedOrders = orders.filter(
                (order: any) => order.done == "1" && order.accepted == "1",
            );
        }
    }
    public showSideDrawer(): void {
        const sideDrawer = app.getRootView() as RadSideDrawer;
        sideDrawer.showDrawer();
    }

    public onBookTap(args: { index: number }): void {
        (this.currentOrder as any).order[args.index].selected = ((this.currentOrder as any)
            .order[args.index].selected
            ? !(this.currentOrder as any).order[args.index].selected
            : true);
    }
}
