import { BrowserModule } from "@angular/platform-browser";
import { NgModule, LOCALE_ID } from "@angular/core";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { Step1Component } from "./step1/step1.component";
import { Step2Component } from "./step2/step2.component";
import { Error404Component } from "./error404/error404.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { NavbarService } from "./services/navbar.service";
import { Step3Component } from "./step3/step3.component";
import { AlertComponent } from "./components/alert.component";
import { JwtInterceptor } from "./helpers/jwt.interceptor";
import { Step4Component } from "./step4/step4.component";
import { Step5Component } from "./step5/step5.component";
import { Step6Component } from "./step6/step6.component";
import { Step7Component } from "./step7/step7.component";
import { HandoverComponent } from "./handover/handover.component";
import { TakeoverComponent } from "./takeover/takeover.component";
import { StartsWithPipe } from "./helpers/startswith.pipe";

@NgModule({
    declarations: [
        AppComponent,
        Step1Component,
        Step2Component,
        Step3Component,
        Error404Component,
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
    ],

    bootstrap: [AppComponent],
})
export class AppModule {}
