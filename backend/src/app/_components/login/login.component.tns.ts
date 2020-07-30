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

    @ViewChild("initialContainer", { static: false }) public initialContainer: ElementRef;
    @ViewChild("mainContainer", { static: false }) public mainContainer: ElementRef;
    @ViewChild("formControls", { static: false }) public formControls: ElementRef;
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

    public forgotPassword(): void {
        prompt({
            cancelButtonText: "Cancel",
            defaultText: "",
            message: "Bitte gib deine Email-Adresse ein, um dein Passwort zurückzusetzen.",
            okButtonText: "Ok",
            title: "Passwort vergesssen",
        }).then((data) => {
            if (data.result) {
                /* this.authService.resetPassword(data.text.trim())
             .subscribe(() => {
               alert("Your password was successfully reset. Please check\
               your email for instructions on choosing a new password.");
             }, () => {
               alert("Unfortunately, an error occurred resetting your password.");
             }); */
                // eslint-disable-next-line no-alert
                alert("Geht noch nicht!");
            }
        });
    }

    public showMainContent(): void {
        const initialContainer = this.initialContainer.nativeElement as View;
        const mainContainer = this.mainContainer.nativeElement as View;
        const formControls = this.formControls.nativeElement as View;
        const animations = [];

        // Fade out the initial content over one half second
        initialContainer.animate({
            duration: 500,
            opacity: 0,
        }).then(() => {
            // After the animation completes, hide the initial container and
            // show the main container and logo. The main container and logo will
            // not immediately appear because their opacity is set to 0 in CSS.
            initialContainer.style.visibility = "collapse";
            mainContainer.style.visibility = "visible";

            // Fade in the main container and logo over one half second.
            animations.push({ target: mainContainer, opacity: 1, duration: 500 });

            // Slide up the form controls and sign up container.
            animations.push({
                target: formControls,
                translate: { x: 0, y: 0 },
                opacity: 1,
                delay: 650,
                duration: 150,
            });

            // Kick off the animation queue
            new Animation(animations, false).play();
        });
    }
}
