import { BrowserModule } from "@angular/platform-browser";
import { NgModule, LOCALE_ID } from "@angular/core";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { Step1Component } from "./_components/step1/step1.component";
import { Step2Component } from "./_components/step2/step2.component";
import { NavbarComponent } from "./_components/navbar/navbar.component";
import { NavbarService } from "./_services/navbar.service";
import { Step3Component } from "./_components/step3/step3.component";
import { AlertComponent } from "./_components/alert/alert.component";
import { JwtInterceptor } from "./_interceptors/jwt.interceptor";
import { Step4Component } from "./_components/step4/step4.component";
import { Step5Component } from "./_components/step5/step5.component";
import { Step6Component } from "./_components/step6/step6.component";
import { Step7Component } from "./_components/step7/step7.component";
import { HandoverComponent } from "./_components/handover/handover.component";
import { TakeoverComponent } from "./_components/takeover/takeover.component";
import { StartsWithPipe } from "./_pipes/startswith.pipe";
import { ErrorInterceptor } from "./_interceptors/error.interceptor";

@NgModule({
    declarations: [
        AppComponent,
        Step1Component,
        Step2Component,
        Step3Component,
        NavbarComponent,
        AlertComponent,
        Step4Component,
        Step5Component,
        Step6Component,
        Step7Component,
        HandoverComponent,
        TakeoverComponent,
        StartsWithPipe,
    ],
    imports: [
        FormsModule,
        NgbModule,
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
    ],
    providers: [
        NavbarService,
        { provide: LOCALE_ID, useValue: "de" },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ],

    bootstrap: [AppComponent],
})
export class AppModule {}
