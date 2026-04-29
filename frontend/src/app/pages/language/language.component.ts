import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalizationService } from '../../core/services/localization.service';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.css']
})
export class LanguageComponent {
  constructor(private router: Router, private localization: LocalizationService) {}

  select(lang: string) {
    this.localization.setLanguage(lang);
    this.router.navigate(['/register']);
  }
}
