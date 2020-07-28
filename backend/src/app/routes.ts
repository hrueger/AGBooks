import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AuthGuard } from "./_guards/auth.guard";
import { AnalysisComponent } from "./analysis/analysis.component";
import { AvalibleBooksComponent } from "./avalible-books/avalible-books.component";
import { LoginComponent } from "./login/login.component";

export const routes: Routes = [
    /* Home paths */

    {
        path: "dashboard",
        component: DashboardComponent,
        canActivate: [AuthGuard],
    },

    {
        path: "analysis",
        component: AnalysisComponent,
        canActivate: [AuthGuard],
    },

    {
        path: "avaliblebooks",
        component: AvalibleBooksComponent,
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
