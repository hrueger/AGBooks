import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { Step1Component } from "./_components/step1/step1.component";
import { Step2Component } from "./_components/step2/step2.component";
import { Step3Component } from "./_components/step3/step3.component";
import { Step4Component } from "./_components/step4/step4.component";
import { Step5Component } from "./_components/step5/step5.component";
import { Step6Component } from "./_components/step6/step6.component";
import { TakeoverComponent } from "./_components/takeover/takeover.component";
import { HandoverComponent } from "./_components/handover/handover.component";
import { StepResolvedCheckGuard } from "./_guards/step-resolved-check.guard";

const routes: Routes = [
    { path: "step/1", component: Step1Component, canActivate: [StepResolvedCheckGuard] },
    { path: "step/2", component: Step2Component, canActivate: [StepResolvedCheckGuard] },
    { path: "step/3", component: Step3Component, canActivate: [StepResolvedCheckGuard] },
    { path: "step/4", component: Step4Component, canActivate: [StepResolvedCheckGuard] },
    { path: "step/5", component: Step5Component, canActivate: [StepResolvedCheckGuard] },
    { path: "step/6", component: Step6Component, canActivate: [StepResolvedCheckGuard] },
    { path: "takeover", component: TakeoverComponent, canActivate: [StepResolvedCheckGuard] },
    { path: "handover", component: HandoverComponent, canActivate: [StepResolvedCheckGuard] },
    { path: "", redirectTo: "step/1", pathMatch: "full" },
    { path: "**", redirectTo: "step/1", pathMatch: "full" },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
