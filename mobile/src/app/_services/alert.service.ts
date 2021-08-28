import { Injectable } from "@angular/core";
import { Feedback, FeedbackType } from "nativescript-feedback";

@Injectable({ providedIn: "root" })
export class AlertService {
    private feedback: Feedback;
    constructor() {
        this.feedback = new Feedback();
    }
    public success(message: string): void {
        this.feedback.show({
            message,
            type: FeedbackType.Success,
            title: "Erfolg!",
        });
    }

    public error(message: string): void {
        this.feedback.show({
            message,
            type: FeedbackType.Error,
            title: "Fehler",
        });
    }
}
