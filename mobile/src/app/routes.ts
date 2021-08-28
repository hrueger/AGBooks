import { Routes } from "@angular/router";
import { DashboardComponent } from "./_components/dashboard/dashboard.component";
import { AuthGuard } from "./_guards/auth.guard";
import { LoginComponent } from "./_components/login/login.component";

export const routes: Routes = [
    /* Home paths */

    {
        path: "dashboard",
        component: DashboardComponent,
        canActivate: [AuthGuard],
    },

    {
        path: "dashboard/:type/:id",
        component: DashboardComponent,
        canActivate: [AuthGuard],
    },

    /* Authentication paths */
    { path: "login", component: LoginComponent },

    // otherwise redirect to home
    { path: "**", redirectTo: "dashboard" },
];
