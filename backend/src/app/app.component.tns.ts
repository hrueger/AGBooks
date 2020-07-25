import { Component, ElementRef, ViewChild } from "@angular/core";
import { first } from "rxjs/operators";
import { Order } from "./_models/order";
import { RemoteService } from "./_services/remote.service";

@Component({
  selector: 'app',
  styleUrls: ["./app.component.css"],
  templateUrl: "./app.component.html",
})

export class AppComponent {
  public orders: Order[];
  public doneOrders: Order[];
  public acceptedOrders: Order[];
  @ViewChild("rsd", { static: false }) public rSideDrawer: ElementRef;
  constructor(private remoteService: RemoteService) { }

  public ngOnInit() {
    this.remoteService
      .getOrders()
      .pipe(first())
      .subscribe(
        (orders) => {
          if (orders) {
            this.sortOrders(orders);
          }

          setInterval(() => {
            this.remoteService
              .getOrders()
              .pipe(first())
              .subscribe(
                (orders) => {
                  if (orders) {
                    this.sortOrders(orders);
                  }
                });
          }, 30000);

        });
  }
  public sortOrders(orders: Order[]) {
    if (orders.length) {
      this.orders = orders.filter(
        // @ts-ignore
        (order) => order.done == "0" && order.accepted == "0",
      );
      this.doneOrders = orders.filter(
        // @ts-ignore
        (order) => order.done == "1" && order.accepted == "0",
      );
      this.acceptedOrders = orders.filter(
        // @ts-ignore
        (order) => order.done == "1" && order.accepted == "1",
      );
    }
  }

  public hideDrawer(): void {
    this.rSideDrawer.nativeElement.toggleDrawerState();
  }
}
