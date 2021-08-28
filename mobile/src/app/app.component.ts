import { Component, ElementRef, ViewChild } from "@angular/core";
import * as appversion from "@nativescript/appversion";
import { Utils } from "@nativescript/core";

@Component({
    selector: "app",
    styleUrls: ["./app.component.scss"],
    templateUrl: "./app.component.html",
})

export class AppComponent {
    public version = "";
    public currentYear = new Date().getFullYear().toString();
    @ViewChild("rsd", { static: false }) public rSideDrawer: ElementRef;

    constructor() {
        appversion.getVersionName().then((v: string) => {
            this.version = v;
        }, () => {
            this.version = "Unknown";
        });
    }

    public hideDrawer(): void {
        this.rSideDrawer.nativeElement.toggleDrawerState();
    }

    public goToGitHub(): void {
        Utils.openUrl("https://github.com/hrueger/AGBooks");
    }
}
