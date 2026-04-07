import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { LocalizationService } from '../../core/services/localization.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form = {
    mother_name: '',
    lmp_date: '',
    language: 'english',
    phone: '',
    asha_worker: '',
    husband_phone: '',
    anganwadi_name: '',
    anganwadi_phone: '',
    email: ''
  };

  constructor(
    private api: ApiService,
    private router: Router,
    private localization: LocalizationService
  ) {}

  ngOnInit(): void {
    this.form.language = this.localization.getCurrentLanguage();
  }

  submit() {
    this.form.language = this.localization.getCurrentLanguage();
    localStorage.setItem('mother_name', this.form.mother_name);
    localStorage.setItem('language', this.form.language);
    this.api.register(this.form).subscribe((res: any) => {
      localStorage.setItem('session_id', res.session_id);
      this.router.navigate(['/dashboard']);
    });
  }
}
