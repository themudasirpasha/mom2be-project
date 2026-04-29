import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { LoaderComponent } from './components/loader/loader.component';
import { CardComponent } from './components/card/card.component';
import { TranslatePipe } from './pipes/translate.pipe';
import { MultilineTextPipe } from './pipes/multiline-text.pipe';

@NgModule({
  declarations: [HeaderComponent, LoaderComponent, CardComponent, TranslatePipe, MultilineTextPipe],
  imports: [CommonModule, RouterModule],
  exports: [HeaderComponent, LoaderComponent, CardComponent, TranslatePipe, MultilineTextPipe]
})
export class SharedModule {}
