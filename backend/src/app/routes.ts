import { Routes } from "@angular/router";
import { DashboardComponent } from "./_components/dashboard/dashboard.component";
import { AuthGuard } from "./_guards/auth.guard";
import { StatisticsComponent } from "./_components/statistics/statistics.component";
import { AvailableBooksComponent } from "./_components/available-books/available-books.component";
import { LoginComponent } from "./_components/login/login.component";

export const routes: Routes = [
    /* Home paths */

    {
        path: "dashboard",
        component: DashboardComponent,
        canActivate: [AuthGuard],
    },

    {
        path: "statistics",
        component: StatisticsComponent,
        canActivate: [AuthGuard],
    },

    {
        path: "availablebooks",
        component: AvailableBooksComponent,
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
