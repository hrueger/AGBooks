import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { first } from "rxjs/operators";

import { User } from "../_models/user";
import { AuthenticationService } from "../_services/authentication.service";
import { UserService } from "../_services/user.service";
import { Title } from "@angular/platform-browser";
import { Order } from '../_models/order';
import { RemoteService } from '../_services/remote.service';
import { AlertService } from '../_services/alert.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  currentOrder: any = null;
  orders: Order[] = null;

  constructor(
    private title: Title,
    private alertService: AlertService,
    private remoteService: RemoteService,
    private activeRoute: ActivatedRoute
  ) {
    
  }
  ngOnInit() {
    //this.loadAllUsers();
    this.title.setTitle("AGBooks | Dashboard");

    this.remoteService
      .getOrders()
      .pipe(first())
      .subscribe(orders => {
        this.orders = orders;
        this.activeRoute.params.subscribe(routeParams => {
          if (routeParams.id) {
            this.orders.forEach((value) => {
              if (value.id == routeParams.id) {
                this.currentOrder = value;
                console.log(this.currentOrder);
              }
            })
          }
        });
      }, error => {
        this.alertService.error(error);
      });


      

  }
}
