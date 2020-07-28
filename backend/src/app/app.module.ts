import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import {
    NgModule, LOCALE_ID, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA,
} from "@angular/core";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
// used to create fake backend
// import { fakeBackendProvider } from "./_helpers/fake-backend";

import { AlertComponent } from "./_components/alert.component";
import { ErrorInterceptor } from "./_helpers/error.interceptor";
import { JwtInterceptor } from "./_helpers/jwt.interceptor";
import { AnalysisComponent } from "./analysis/analysis.component";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { LoginComponent } from "./login/login.component";
import { AvalibleBooksComponent } from "./avalible-books/avalible-books.component";

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule,
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        LoginComponent,
        DashboardComponent,
        AnalysisComponent,
        AvalibleBooksComponent,

    ],
    providers: [
        { provide: LOCALE_ID, useValue: "de" },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend
    // fakeBackendProvider
    ],
    bootstrap: [AppComponent],
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
