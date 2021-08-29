import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import {
    NgModule, LOCALE_ID, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA,
} from "@angular/core";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";
import { GridsterModule } from "angular-gridster2";
import { ImageCropperModule } from "ngx-image-cropper";
import { ErrorInterceptor } from "./_interceptors/error.interceptor";
import { JwtInterceptor } from "./_interceptors/jwt.interceptor";
import { StatisticsComponent } from "./_components/statistics/statistics.component";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { DashboardComponent } from "./_components/dashboard/dashboard.component";
import { LoginComponent } from "./_components/login/login.component";
import { AvailableBooksComponent } from "./_components/available-books/available-books.component";
import { NavbarComponent } from "./_components/navbar/navbar.component";
import { UsersComponent } from "./_components/users/users.component";
import { ManageBooksComponent, NgbdSortableHeader } from "./_components/manage-books/manage-books.component";

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        GridsterModule,
        ImageCropperModule,
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        DashboardComponent,
        StatisticsComponent,
        AvailableBooksComponent,
        NavbarComponent,
        UsersComponent,
        ManageBooksComponent,
        NgbdSortableHeader,
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
