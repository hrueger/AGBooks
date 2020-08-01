import { Component } from "@angular/core";
import { RemoteService } from "../../_services/remote.service";
import { Admin } from "../../_models/Admin";

@Component({
    selector: "app-users",
    templateUrl: "./users.component.html",
    styleUrls: ["./users.component.scss"],
})
export class UsersComponent {
    public admins: Admin[] = [];
    constructor(private remoteService: RemoteService) { }

    public ngOnInit(): void {
        this.remoteService.get("auth/admins").subscribe((admins) => {
            this.admins = admins;
        });
    }

    public newAdmin(): void {
        // eslint-disable-next-line no-alert
        const email = prompt("Email:");
        if (!email) {
            return;
        }
        // eslint-disable-next-line no-alert
        const password = prompt("Passwort:");
        if (!password) {
            return;
        }
        this.remoteService.post("auth/admins", { email, password }).subscribe((d) => {
            if (d && d.success) {
                this.ngOnInit();
            }
        });
    }

    public removeAdmin(admin: Admin): void {
        // eslint-disable-next-line
        if (!confirm("Soll dieser Benutzer wirklich gelöscht werden?")) {
            return;
        }
        this.remoteService.delete(`auth/admins/${admin.id}`).subscribe(() => {
            this.ngOnInit();
        });
    }
}
