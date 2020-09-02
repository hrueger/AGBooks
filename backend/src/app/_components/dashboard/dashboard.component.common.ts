import { OnInit, NgZone } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { first } from "rxjs/operators";
import { Order } from "../../_models/Order";
import { AlertService } from "../../_services/alert.service";
import { RemoteService } from "../../_services/remote.service";
import { getApiUrl } from "../../_utils/utils";
import { AuthenticationService } from "../../_services/authentication.service";

export class DashboardComponentCommon implements OnInit {
    public currentOrder: Order = null;
    public orderCanBeDone = true;
    public orderCanBeAccepted = true;
    public orders: Order[] = [];
    public doneOrders: Order[] = [];
    public acceptedOrders: Order[] = [];
    public sse: EventSource;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private title: Title,
        public alertService: AlertService,
        public authenticationService: AuthenticationService,
        private remoteService: RemoteService,
        private activeRoute: ActivatedRoute,
        public zone: NgZone,
    ) { }
    public ngOnInit(done?: () => void): void {
        // this.loadAllUsers();
        this.title.setTitle("AGBooks | Dashboard");

        this.remoteService
            .get("order/all")
            .pipe(first())
            .subscribe(
                (orders: Order[]) => {
                    if (typeof done == "function") {
                        done();
                    }
                    this.gotOrders(orders);
                    this.setupSSE();
                    this.activeRoute.params.subscribe(
                        (routeParams: { type: string; id: string; }) => {
                            if (routeParams.id) {
                                this.findCurrentOrder(routeParams.type, routeParams.id);
                            } else {
                                this.navigateToTopOrder();
                            }
                        },
                    );
                },
                (error: any) => {
                    this.alertService.error(error);
                },
            );
    }

    private findCurrentOrder(type: string, i: string) {
        const id = parseInt(i, 10);
        if (type == "queue") {
            this.currentOrder = this.orders.find(
                (order) => order.user.id === id,
            );
            this.orderCanBeDone = true;
            this.orderCanBeAccepted = false;
        } else if (type == "done") {
            this.currentOrder = this.doneOrders.find(
                (order) => order.user.id === id,
            );
            this.orderCanBeDone = false;
            this.orderCanBeAccepted = true;
        } else if (type == "accepted") {
            this.currentOrder = this.acceptedOrders.find(
                (order) => order.user.id === id,
            );
            this.orderCanBeDone = false;
            this.orderCanBeAccepted = false;
        }
        if (this.currentOrder) {
            this.currentOrder.books = this.currentOrder.books.sort(
                (a, b) => a.subject.localeCompare(b.subject),
            );
        }
    }

    public gotOrders(orders: Order[]): void {
        if (orders) {
            this.sortOrders(orders);
            this.findCurrentOrder(this.route.snapshot.params.type, this.route.snapshot.params.id);
        }
    }

    public setupSSE(): void {
        this.sse = new EventSource(`${getApiUrl()}order/all/live?authorization=${this.authenticationService.currentUserValue.token}`);
        this.sse.onmessage = (message: any) => {
            this.zone.run(() => {
                const data = JSON.parse(message.data);
                this.gotOrders(data);
            });
        };
        this.sse.onerror = () => {
            this.alertService.error("Verbindung unterbrochen. Neuer Versuch in 5 Sekunden...");
            setTimeout(() => {
                this.setupSSE();
            }, 5000);
        };
    }

    public ngOnDestroy(): void {
        this.sse?.close();
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
        this.remoteService.post(`auth/handover/${this.currentOrder.user.id}/code`, {}).subscribe((data) => {
            if (data && data.code) {
                // eslint-disable-next-line no-alert
                alert(`Der Übergabecode lautet:\n\n${data.code}`);
            }
        });
    }

    public async deleteOrder(): Promise<void> {
        // eslint-disable-next-line
        if (await confirm("Soll diese Bestellung wirklich gelöscht werden? Sie kann nicht wiederhergestellt werden.")) {
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
