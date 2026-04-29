import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { LocalizationService } from '../../core/services/localization.service';

interface ProcessingAgent {
  name: string;
  label: string;
  completed: boolean;
  active: boolean;
}

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
    district: '',
    taluk: '',
    asha_worker: '',
    husband_phone: '',
    anganwadi_name: '',
    anganwadi_phone: '',
    email: ''
  };

  isProcessing = false;

  processingAgents: ProcessingAgent[] = [
    { name: 'validator', label: 'Validating info…', completed: false, active: false },
    { name: 'profile', label: 'Creating profile…', completed: false, active: false },
    { name: 'setup', label: 'Setting up dashboard…', completed: false, active: false }
  ];

  constructor(
    private api: ApiService,
    private router: Router,
    private localization: LocalizationService
  ) {}

  ngOnInit(): void {
    this.form.language = this.localization.getCurrentLanguage();
  }

  submit() {
    if (this.isProcessing) return;

    this.form.language = this.localization.getCurrentLanguage();
    localStorage.setItem('mother_name', this.form.mother_name);
    localStorage.setItem('language', this.form.language);
    localStorage.setItem('district', this.form.district);
    localStorage.setItem('taluk', this.form.taluk);

    this.isProcessing = true;
    this.resetProcessingAgents();
    this.simulateAgentProcessing();

    this.api.register(this.form).subscribe(
      (res: any) => {
        localStorage.setItem('session_id', res.session_id);
        this.isProcessing = false;
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.error('Registration error:', error);
        this.isProcessing = false;
        // Handle error - could show error message
      }
    );
  }

  private resetProcessingAgents() {
    this.processingAgents.forEach(agent => {
      agent.completed = false;
      agent.active = false;
    });
  }

  private simulateAgentProcessing() {
    // Validator Agent - 0-800ms
    setTimeout(() => {
      this.processingAgents[0].active = true;
    }, 0);

    setTimeout(() => {
      this.processingAgents[0].completed = true;
      this.processingAgents[0].active = false;
      // Profile Agent - 800-1600ms
      this.processingAgents[1].active = true;
    }, 800);

    setTimeout(() => {
      this.processingAgents[1].completed = true;
      this.processingAgents[1].active = false;
      // Setup Agent - 1600-2400ms
      this.processingAgents[2].active = true;
    }, 1600);

    setTimeout(() => {
      this.processingAgents[2].completed = true;
      this.processingAgents[2].active = false;
    }, 2400);
  }
}
