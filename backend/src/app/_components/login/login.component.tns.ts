import { Component, ElementRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { connectionType, getConnectionType } from "tns-core-modules/connectivity";
import { Animation } from "tns-core-modules/ui/animation";
import { View } from "tns-core-modules/ui/core/view";
import { prompt } from "tns-core-modules/ui/dialogs";
import { Page } from "tns-core-modules/ui/page";
import { ApplicationSettings } from "@nativescript/core";
import { AuthenticationService } from "../../_services/authentication.service";

@Component({
    selector: "app-login",
    styleUrls: ["./login.component.scss"],
    templateUrl: "./login.component.html",
})
export class LoginComponent {
    public serverUrl = "";
    public username = "";
    public password = "";
    public isAuthenticating = false;

    @ViewChild("passwordField", { static: false }) public passwordEl: ElementRef;
    @ViewChild("usernameField", { static: false }) public usernameEl: ElementRef;

    constructor(private authService: AuthenticationService,
        private page: Page,
        private router: Router) {
    }

    public ngOnInit(): void {
        this.page.actionBarHidden = true;
    }

    public focusPassword(): void {
        this.passwordEl.nativeElement.focus();
    }

    public focusUsername(): void {
        this.usernameEl.nativeElement.focus();
    }

    public submit(): void {
        ApplicationSettings.setString("apiUrl", this.serverUrl);
        this.isAuthenticating = true;
        this.login();
    }

    public login(): void {
        if (getConnectionType() === connectionType.none) {
            // eslint-disable-next-line no-alert
            alert("AGBooks benötigt eine Internetverbindung.");
            return;
        }

        this.authService.login(this.username, this.password).subscribe(
            () => {
                this.isAuthenticating = false;
                this.router.navigate(["/dashboard"]);
            },
            (error) => {
                this.isAuthenticating = false;
                // eslint-disable-next-line no-alert
                alert(error
                    || "Dein Account wurde leider nicht gefunden.\
          Bitte überprüfe deinen Benutzernamen nochmals!");
            },
        );
    }
}
