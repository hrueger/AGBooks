import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Step1Component } from './step1/step1.component';
import { Step2Component } from './step2/step2.component';
import { Error404Component } from './error404/error404.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './navbar/navbar.component';
import { NavbarService } from './services/navbar.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { Step3Component } from './step3/step3.component';
import { AlertComponent } from './components/alert.component';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { Step4Component } from './step4/step4.component';

@NgModule({
  declarations: [
    AppComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    Error404Component,
    NavbarComponent,
    AlertComponent,
    Step4Component
  ],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    NavbarService,
    { provide: LOCALE_ID, useValue: "de" },
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }],
  
   
  bootstrap: [AppComponent]
})
export class AppModule { }
