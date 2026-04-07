import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { SchemesComponent } from "./schemes.component";

const routes: Routes = [{ path: "", component: SchemesComponent }];

@NgModule({
  declarations: [SchemesComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)]
})
export class SchemesModule {}
