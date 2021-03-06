import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { RouterModule } from "@angular/router";
import { routes } from "./routes";

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class AppRoutingModule { }
