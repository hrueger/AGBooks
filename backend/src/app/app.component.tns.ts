import { Component, ElementRef, ViewChild } from "@angular/core";

@Component({
    selector: "app",
    styleUrls: ["./app.component.css"],
    templateUrl: "./app.component.html",
})

export class AppComponent {
    @ViewChild("rsd", { static: false }) public rSideDrawer: ElementRef;

    public hideDrawer(): void {
        this.rSideDrawer.nativeElement.toggleDrawerState();
    }
}
