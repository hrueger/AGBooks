import { Routes } from "@angular/router";
import { DashboardComponent } from "./_components/dashboard/dashboard.component";
import { AuthGuard } from "./_guards/auth.guard";
import { StatisticsComponent } from "./_components/statistics/statistics.component";
import { AvailableBooksComponent } from "./_components/available-books/available-books.component";
import { LoginComponent } from "./_components/login/login.component";
import { UsersComponent } from "./_components/users/users.component";
import { ManageBooksComponent } from "./_components/manage-books/manage-books.component";

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
        path: "users",
        component: UsersComponent,
        canActivate: [AuthGuard],
    },

    {
        path: "manage-books",
        component: ManageBooksComponent,
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
