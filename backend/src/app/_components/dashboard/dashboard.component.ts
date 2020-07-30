import {
    Component,
} from "@angular/core";
import { DashboardComponentCommon } from "./dashboard.component.common";

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent extends DashboardComponentCommon {
}
