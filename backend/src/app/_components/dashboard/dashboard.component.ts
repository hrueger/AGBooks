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
            if (data.success == true) {
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
            this.remoteService.delete(`order/${this.currentOrder.user.id}`).subscribe((data) => {
                if (data.success == true) {
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

    public getColorForSubject(str: string): string {
        const subjects = {
            Biologie: "#20bf6b",
            Chemie: "#778ca3",
            Deutsch: "#d1d8e0",
            Englisch: "#26de81",
            Ethik: "#fed330",
            Französisch: "#f7b731",
            Geographie: "#0fb9b1",
            Geschichte: "#a5b1c2",
            Informatik: "#fc5c65",
            Latein: "#4b6584",
            Mathematik: "#eb3b5a",
            Musik: "#45aaf2",
            Physik: "#4b7bec",
            "Religion ev": "#fed330",
            "Religion rk": "#fed330",
            Sozialkunde: "#2d98da",
            Spanisch: "#fd9644",
            Sport: "#fa8231",
            "W&R": "#a55eea",
        };
        return subjects[str] || "#fff";
    }
    public getForegroundColorForSubject(str: string): string {
        const subjects = {
            Biologie: "#fff",
            Chemie: "#fff",
            Deutsch: "#000",
            Englisch: "#fff",
            Ethik: "#fff",
            Französisch: "#fff",
            Geographie: "#fff",
            Geschichte: "#fff",
            Informatik: "#fff",
            Latein: "#fff",
            Mathematik: "#fff",
            Musik: "#fff",
            Physik: "#fff",
            "Religion ev": "#fff",
            "Religion rk": "#fff",
            Sozialkunde: "#fff",
            Spanisch: "#fff",
            Sport: "#fff",
            "W&R": "#fff",
        };
        return subjects[str] || "#000";
    }
}

function shadeColor(color, percent) {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    const RR = ((R.toString(16).length == 1) ? `0${R.toString(16)}` : R.toString(16));
    const GG = ((G.toString(16).length == 1) ? `0${G.toString(16)}` : G.toString(16));
    const BB = ((B.toString(16).length == 1) ? `0${B.toString(16)}` : B.toString(16));

    return `#${RR}${GG}${BB}`;
}
