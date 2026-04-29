import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { AnganwadiComponent } from "./anganwadi.component";

const routes: Routes = [{ path: "", component: AnganwadiComponent }];

@NgModule({
  declarations: [AnganwadiComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)]
})
export class AnganwadiModule {}
