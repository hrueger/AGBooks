import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { AlertService } from "../../_services/alert.service";

@Component({
    selector: "alert",
    templateUrl: "alert.component.html",
})
export class AlertComponent implements OnInit, OnDestroy {
  public message: any;
  private subscription: Subscription;

  constructor(private alertService: AlertService) {}

  public ngOnInit(): void {
      this.subscription = this.alertService.getMessage().subscribe((message) => {
          this.message = message;
      });
  }

  public ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }
}
