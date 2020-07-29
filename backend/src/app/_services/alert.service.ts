import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Injectable({ providedIn: "root" })
export class AlertService {
    constructor(private toastr: ToastrService) { }
    public success(message: string): void {
        this.toastr.success(message, "Erfolg");
    }

    public error(message: string): void {
        this.toastr.error(message, "Fehler");
    }
}
