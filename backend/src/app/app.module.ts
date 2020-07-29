import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import {
    NgModule, LOCALE_ID, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA,
} from "@angular/core";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";
import { ErrorInterceptor } from "./_interceptors/error.interceptor";
import { JwtInterceptor } from "./_interceptors/jwt.interceptor";
import { AnalysisComponent } from "./_components/analysis/analysis.component";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { DashboardComponent } from "./_components/dashboard/dashboard.component";
import { LoginComponent } from "./_components/login/login.component";
import { AvalibleBooksComponent } from "./_components/avalible-books/avalible-books.component";

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
    ],
    declarations: [
        AppComponent,
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
