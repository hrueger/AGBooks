import { Component, OnDestroy, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { first } from "rxjs/operators";
import { Order } from "../_models/order";
import { User } from "../_models/user";
import { AlertService } from "../_services/alert.service";
import { AuthenticationService } from "../_services/authentication.service";
import { RemoteService } from "../_services/remote.service";
import { UserService } from "../_services/user.service";
import config from "../config/config";

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
  public sse: EventSource;

  constructor(
    private router: Router,
    private title: Title,
    private alertService: AlertService,
    private remoteService: RemoteService,
    private activeRoute: ActivatedRoute,
  ) { }
  public ngOnInit() {
    // this.loadAllUsers();
    this.title.setTitle("AGBooks | Dashboard");

    this.remoteService
      .getOrders()
      .pipe(first())
      .subscribe(
        (orders) => {
          if (orders) {
            this.sortOrders(orders);
          }

          this.activeRoute.params.subscribe((routeParams) => {
            if (routeParams.id) {
              if (routeParams.type == "queue") {
                this.currentOrder = this.orders.filter(
                  (order) => order.id === routeParams.id,
                )[0];
                this.orderCanBeDone = true;
              } else if (routeParams.type == "done") {
                this.currentOrder = this.doneOrders.filter(
                  (order) => order.id === routeParams.id,
                )[0];
                this.orderCanBeDone = false;
              } else if (routeParams.type == "accepted") {
                this.currentOrder = this.acceptedOrders.filter(
                  (order) => order.id === routeParams.id,
                )[0];
                this.orderCanBeDone = false;
              } else {
                console.warn(routeParams.type);
              }
              /*this.orders.forEach(value => {
                if (value.id == routeParams.id) {
                  this.currentOrder = value;
                  console.log(this.currentOrder);
                }
              });*/
            } else {
              this.navigateToTopOrder();
            }
          });

          this.sse = new EventSource(config.apiUrl + "?queueBackend");
          this.sse.addEventListener("update", (message) => {
            // console.log(message);
            // @ts-ignore
            const data = JSON.parse(message.data);
            if (data) {
              this.sortOrders(data.orders);
            }

          });
        },
        (error) => {
          this.alertService.error(error);
        },
      );
  }

  public orderDone() {
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
  public navigateToTopOrder() {
    if (this.orders[0]) {
      this.router.navigate(["dashboard", "queue", this.orders[0].id]);
    } else {
      this.currentOrder = null;
    }
  }
  public sortOrders(orders: Order[]) {
    if (orders.length) {
      this.orders = orders.filter(
        (order) => order.done == 0 && order.accepted == 0,
      );
      this.doneOrders = orders.filter(
        (order) => order.done == 1 && order.accepted == 0,
      );
      this.acceptedOrders = orders.filter(
        (order) => order.done == 1 && order.accepted == 1,
      );
    }

  }
}
