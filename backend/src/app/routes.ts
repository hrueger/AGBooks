import { Routes } from "@angular/router";
import { DashboardComponent } from "./_components/dashboard/dashboard.component";
import { AuthGuard } from "./_guards/auth.guard";
import { AnalysisComponent } from "./_components/analysis/analysis.component";
import { AvalibleBooksComponent } from "./_components/avalible-books/avalible-books.component";
import { LoginComponent } from "./_components/login/login.component";

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
