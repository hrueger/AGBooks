import {
    Component, Input, Output, EventEmitter,
} from "@angular/core";
import { AuthenticationService } from "../../_services/authentication.service";
import { Order } from "../../_models/Order";

@Component({
    selector: "app-navbar",
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent {
    constructor(public authenticationService: AuthenticationService) { }
    @Input() public currentOrder: Order;
    @Input() public orderCanBeDone: boolean;
    @Input() public orderCanBeAccepted: boolean;
    @Output() orderDone: EventEmitter<void> = new EventEmitter<void>();
    @Output() orderAccepted: EventEmitter<void> = new EventEmitter<void>();
    @Output() getHandoverCodeForOrder: EventEmitter<void> = new EventEmitter<void>();
    @Output() deleteOrder: EventEmitter<void> = new EventEmitter<void>();
}
