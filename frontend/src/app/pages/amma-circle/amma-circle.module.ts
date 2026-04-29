import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AmmaCircleComponent } from './amma-circle.component';

const routes: Routes = [{ path: '', component: AmmaCircleComponent }];

@NgModule({
  declarations: [AmmaCircleComponent],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)]
})
export class AmmaCircleModule {}
