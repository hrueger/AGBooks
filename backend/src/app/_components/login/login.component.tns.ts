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
    public email = "";
    public password = "";
    public isAuthenticating = false;

    @ViewChild("passwordField", { static: false }) public passwordEl: ElementRef;
    @ViewChild("emailField", { static: false }) public emailEl: ElementRef;

    constructor(private authService: AuthenticationService,
        private page: Page,
        private router: Router) {
        this.email = ApplicationSettings.getString("email") || "";
        this.password = ApplicationSettings.getString("password") || "";
        this.serverUrl = ApplicationSettings.getString("serverUrl") || "";
    }

    public ngOnInit(): void {
        this.page.actionBarHidden = true;
    }

    public focusPassword(): void {
        this.passwordEl.nativeElement.focus();
    }

    public focusEmail(): void {
        this.emailEl.nativeElement.focus();
    }

    public submit(): void {
        ApplicationSettings.setString("apiUrl", `${this.serverUrl}/api/`);
        ApplicationSettings.setString("email", this.email);
        ApplicationSettings.setString("password", this.password);
        ApplicationSettings.setString("serverUrl", this.serverUrl);
        this.isAuthenticating = true;
        this.login();
    }

    public login(): void {
        if (getConnectionType() === connectionType.none) {
            // eslint-disable-next-line no-alert
            alert("AGBooks benötigt eine Internetverbindung.");
            return;
        }

        this.authService.login(this.email, this.password).subscribe(
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
