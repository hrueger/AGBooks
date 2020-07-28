import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

import { AlertService } from "../../_services/alert.service";

@Component({
    selector: "alert",
    templateUrl: "alert.component.html",
})
export class AlertComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    message: any;

    constructor(private alertService: AlertService) { }

    public ngOnInit(): void {
        this.subscription = this.alertService.getMessage().subscribe((message) => {
            this.message = message;
        });
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
