import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { MedicineComponent } from "./medicine.component";

const routes: Routes = [{ path: "", component: MedicineComponent }];

@NgModule({
  declarations: [MedicineComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)]
})
export class MedicineModule {}
