import { HTTP_INTERCEPTORS } from "@angular/common/http";
import {
    LOCALE_ID, NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA,
} from "@angular/core";
import {
    NativeScriptFormsModule,
    NativeScriptModule, NativeScriptHttpClientModule,
} from "@nativescript/angular";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";
import { ErrorInterceptor } from "./_interceptors/error.interceptor";
import { JwtInterceptor } from "./_interceptors/jwt.interceptor";
import { AnalysisComponent } from "./_components/analysis/analysis.component";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AvalibleBooksComponent } from "./_components/avalible-books/avalible-books.component";
import { DashboardComponent } from "./_components/dashboard/dashboard.component";
import { LoginComponent } from "./_components/login/login.component";

@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        LoginComponent,
        DashboardComponent,
        AnalysisComponent,
        AvalibleBooksComponent,
    ],
    imports: [
        NativeScriptModule,
        NativeScriptHttpClientModule,
        NativeScriptUISideDrawerModule,
        NativeScriptFormsModule,
        AppRoutingModule,
    ],
    providers: [
        { provide: LOCALE_ID, useValue: "de" },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ],
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
