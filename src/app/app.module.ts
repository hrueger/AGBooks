import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { LOCALE_ID } from "@angular/core";
// used to create fake backend
//import { fakeBackendProvider } from "./_helpers/fake-backend";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { AlertComponent } from "./_components/alert.component";
import { JwtInterceptor } from "./_helpers/jwt.interceptor";
import { ErrorInterceptor } from "./_helpers/error.interceptor";
import { LoginComponent } from "./login/login.component";
import { DashboardComponent } from "./dashboard/dashboard.component";



@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule
 ],
  declarations: [
    AppComponent,
    AlertComponent,
    LoginComponent,
    DashboardComponent,
    
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "de" },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }

    // provider used to create fake backend
    //fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
