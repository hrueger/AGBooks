import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { LoginComponent } from "./login/login.component";
import { AuthGuard } from "./_guards/auth.guard";

const routes: Routes = [
  /* Home paths*/
  
  { path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard] },

  {path: "dashboard/:id", component: DashboardComponent, canActivate: [AuthGuard]},

  /* Authentication paths*/
  { path: "login", component: LoginComponent },
  

  // otherwise redirect to home
  { path: "**", redirectTo: "dashboard" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
