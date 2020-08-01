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
}
