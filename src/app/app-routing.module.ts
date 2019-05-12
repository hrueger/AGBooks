import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { Step1Component } from "./step1/step1.component";
import { Step2Component } from "./step2/step2.component";
import { Error404Component } from "./error404/error404.component";
import { Step3Component } from "./step3/step3.component";
import { Step4Component } from "./step4/step4.component";
import { Step5Component } from "./step5/step5.component";
import { Step6Component } from "./step6/step6.component";
import { Step7Component } from "./step7/step7.component";
import { TakeoverComponent } from "./takeover/takeover.component";
import { HandoverComponent } from "./handover/handover.component";

const routes: Routes = [
  { path: "step/1", component: Step1Component },
  { path: "step/2", component: Step2Component },
  { path: "step/3", component: Step3Component },
  { path: "step/4", component: Step4Component },
  { path: "step/5", component: Step5Component },
  { path: "step/6", component: Step6Component },
  { path: "step/7", component: Step7Component },
  { path: "takeover", component: TakeoverComponent },
  { path: "handover", component: HandoverComponent },
  { path: "step/7", component: Step7Component },
  { path: "", redirectTo: "step/1", pathMatch: "full" },
  { path: "**", component: Error404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
