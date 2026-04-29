import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../../shared/shared.module";
import { AshaBriefComponent } from "./ashabrief.component";

const routes: Routes = [{ path: "", component: AshaBriefComponent }];

@NgModule({
  declarations: [AshaBriefComponent],
  imports: [CommonModule, SharedModule, FormsModule, RouterModule.forChild(routes)]
})
export class AshaBriefModule {}
