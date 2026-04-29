import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LabReportComponent } from './lab-report.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [{ path: '', component: LabReportComponent }];

@NgModule({
  declarations: [LabReportComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)]
})
export class LabReportModule {}
