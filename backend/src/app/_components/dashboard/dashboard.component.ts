import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { first } from "rxjs/operators";
import { Order } from "../../_models/Order";
import { AlertService } from "../../_services/alert.service";
import { RemoteService } from "../../_services/remote.service";
import { getApiUrl } from "../../_utils/utils";

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
    public currentOrder: Order = null;
    public orderCanBeDone = true;
    public orderCanBeAccepted = true;
    public orders: Order[] = [];
    public doneOrders: Order[] = [];
    public acceptedOrders: Order[] = [];
    public sse: EventSource;

    constructor(
        private router: Router,
        private title: Title,
        private alertService: AlertService,
        private remoteService: RemoteService,
        private activeRoute: ActivatedRoute,
    ) { }
    public ngOnInit(): void {
        // this.loadAllUsers();
        this.title.setTitle("AGBooks | Dashboard");

        this.remoteService
            .get("order/all")
            .pipe(first())
            .subscribe(
                (orders: Order[]) => {
                    if (orders) {
                        this.sortOrders(orders);
                    }

                    this.activeRoute.params.subscribe((routeParams: {type: string, id: string}) => {
                        if (routeParams.id) {
                            const id = parseInt(routeParams.id, 10);
                            if (routeParams.type == "queue") {
                                this.currentOrder = this.orders.find(
                                    (order) => order.user.id === id,
                                );
                                this.orderCanBeDone = true;
                                this.orderCanBeAccepted = false;
                            } else if (routeParams.type == "done") {
                                this.currentOrder = this.doneOrders.find(
                                    (order) => order.user.id === id,
                                );
                                this.orderCanBeDone = false;
                                this.orderCanBeAccepted = true;
                            } else if (routeParams.type == "accepted") {
                                this.currentOrder = this.acceptedOrders.find(
                                    (order) => order.user.id === id,
                                );
                                this.orderCanBeDone = false;
                                this.orderCanBeAccepted = false;
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

                    this.sse = new EventSource(`${getApiUrl()}?queueBackend`);
                    this.sse.addEventListener("update", (message: any) => {
                        const data = JSON.parse(message.data);
                        if (data) {
                            this.sortOrders(data.orders);
                        }
                    });
                },
                (error: any) => {
                    this.alertService.error(error);
                },
            );
    }

    public orderDone(): void {
        this.remoteService.post(`order/${this.currentOrder.user.id}/done`, {}).subscribe((data) => {
            if (data.success == true) {
                this.doneOrders.push(this.currentOrder);
                this.orders = this.orders.filter(
                    (order) => order.user.id !== this.currentOrder.user.id,
                );
                this.currentOrder = null;
                this.navigateToTopOrder();
            }
        });
    }

    public orderAccepted(): void {
        this.remoteService.post(`order/${this.currentOrder.user.id}/accepted`, {}).subscribe((data) => {
            if (data == true) {
                this.acceptedOrders.push(this.currentOrder);
                this.doneOrders = this.doneOrders.filter(
                    (order) => order.user.id !== this.currentOrder.user.id,
                );
                this.currentOrder = null;
                this.navigateToTopOrder();
            }
        });
    }
    public getHandoverCodeForOrder(): void {
        this.remoteService.post("handover/admin", {
            token: this.currentOrder.user.token.replace("Bearer ", ""),
        }).subscribe((data) => {
            if (data != false) {
                // eslint-disable-next-line no-alert
                alert(`Der Übergabecode lautet:\n\n${data}`);
            }
        });
    }

    public deleteOrder(): void {
        // eslint-disable-next-line no-alert
        if (window.confirm("Soll diese Bestellung wirklich gelöscht werden? Sie kann nicht wiederhergestellt werden.")) {
            this.remoteService.delete(`orders/${this.currentOrder.user.id}`).subscribe((data) => {
                if (data == true) {
                    this.orders = this.orders.filter(
                        (order) => order.user.id !== this.currentOrder.user.id,
                    );
                    this.doneOrders = this.doneOrders.filter(
                        (order) => order.user.id !== this.currentOrder.user.id,
                    );
                    this.acceptedOrders = this.acceptedOrders.filter(
                        (order) => order.user.id !== this.currentOrder.user.id,
                    );
                    this.currentOrder = null;
                    this.navigateToTopOrder();
                }
            });
        }
    }

    public navigateToTopOrder(): void {
        if (this.orders[0]) {
            this.router.navigate(["dashboard", "queue", this.orders[0].user.id]);
        } else {
            this.currentOrder = null;
        }
    }
    public sortOrders(orders: Order[]): void {
        if (orders.length) {
            this.orders = orders.filter(
                (order) => !order.user.orderDone && !order.user.orderAccepted,
            );
            this.doneOrders = orders.filter(
                (order) => order.user.orderDone && !order.user.orderAccepted,
            );
            this.acceptedOrders = orders.filter(
                (order) => order.user.orderDone && order.user.orderAccepted,
            );
        }
    }
}
