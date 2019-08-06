import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { first } from "rxjs/operators";
import config from "../config/config";
import { User } from "../_models/user";
import { AuthenticationService } from "../_services/authentication.service";
import { UserService } from "../_services/user.service";
import { Title } from "@angular/platform-browser";
import { Order } from "../_models/order";
import { RemoteService } from "../_services/remote.service";
import { AlertService } from "../_services/alert.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  currentOrder: Order = null;
  orderCanBeDone: boolean = true;
  orders: Order[] = [];
  doneOrders: Order[] = [];
  acceptedOrders: Order[] = [];
  sse: EventSource;

  constructor(
    private router: Router,
    private title: Title,
    private alertService: AlertService,
    private remoteService: RemoteService,
    private activeRoute: ActivatedRoute
  ) { }
  ngOnInit() {
    //this.loadAllUsers();
    this.title.setTitle("AGBooks | Dashboard");

    this.remoteService
      .getOrders()
      .pipe(first())
      .subscribe(
        orders => {
          if (orders) {
            this.sortOrders(orders);
          }


          this.activeRoute.params.subscribe(routeParams => {
            if (routeParams.id) {
              if (routeParams.type == "queue") {
                this.currentOrder = this.orders.filter(
                  order => order.id === routeParams.id
                )[0];
                this.orderCanBeDone = true;
              } else if (routeParams.type == "done") {
                this.currentOrder = this.doneOrders.filter(
                  order => order.id === routeParams.id
                )[0];
                this.orderCanBeDone = false;
              } else if (routeParams.type == "accepted") {
                this.currentOrder = this.acceptedOrders.filter(
                  order => order.id === routeParams.id
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
          this.sse.addEventListener("update", message => {
            //console.log(message);
            //@ts-ignore
            let data = JSON.parse(message.data);
            if (data) {
              this.sortOrders(data.orders);
            }

          });
        },
        error => {
          this.alertService.error(error);
        }
      );
  }

  orderDone() {
    this.remoteService.setOrderDone(this.currentOrder.id).subscribe(data => {
      if (data == true) {
        this.doneOrders.push(this.currentOrder);
        this.orders = this.orders.filter(
          order => order.id !== this.currentOrder.id
        );
        this.currentOrder = null;
        this.navigateToTopOrder();
      }
    });
  }
  navigateToTopOrder() {
    if (this.orders[0]) {
      this.router.navigate(["dashboard", "queue", this.orders[0].id]);
    } else {
      this.currentOrder = null;
    }
  }
  sortOrders(orders: Order[]) {
    if (orders.length) {
      this.orders = orders.filter(
        order => order.done == 0 && order.accepted == 0
      );
      this.doneOrders = orders.filter(
        order => order.done == 1 && order.accepted == 0
      );
      this.acceptedOrders = orders.filter(
        order => order.done == 1 && order.accepted == 1
      );
    }


  }
}
