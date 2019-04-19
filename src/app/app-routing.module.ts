import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Step1Component } from './step1/step1.component';
import { Step2Component } from './step2/step2.component';
import { Error404Component } from './error404/error404.component';
import { Step3Component } from './step3/step3.component';
import { Step4Component } from './step4/step4.component';

const routes: Routes = [
  {path: "step/1", component: Step1Component},
  {path: "step/2", component: Step2Component},
  {path: "step/3", component: Step3Component},
  {path: "step/4", component: Step4Component},
    {path: "", redirectTo: "step/1", pathMatch: "full"},
    {path: "**", component: Error404Component}
    
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
