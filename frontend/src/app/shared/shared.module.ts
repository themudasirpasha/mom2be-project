import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { LoaderComponent } from './components/loader/loader.component';
import { CardComponent } from './components/card/card.component';
import { TranslatePipe } from './pipes/translate.pipe';

@NgModule({
  declarations: [HeaderComponent, LoaderComponent, CardComponent, TranslatePipe],
  imports: [CommonModule, RouterModule],
  exports: [HeaderComponent, LoaderComponent, CardComponent, TranslatePipe]
})
export class SharedModule {}
