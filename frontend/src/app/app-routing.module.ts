import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/language/language.module').then(m => m.LanguageModule) },
  { path: 'register', loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterModule) },
  { path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'chat', loadChildren: () => import('./pages/chat/chat.module').then(m => m.ChatModule) },
  { path: 'asha-brief', loadChildren: () => import('./pages/ashabrief/ashabrief.module').then(m => m.AshaBriefModule) },
  { path: 'symptom', loadChildren: () => import('./pages/symptom/symptom.module').then(m => m.SymptomModule) },
  { path: 'medicine', loadChildren: () => import('./pages/medicine/medicine.module').then(m => m.MedicineModule) },
  { path: 'injection', loadChildren: () => import('./pages/injection/injection.module').then(m => m.InjectionModule) },
  { path: 'schemes', loadChildren: () => import('./pages/schemes/schemes.module').then(m => m.SchemesModule) },
  { path: 'anganwadi', loadChildren: () => import('./pages/anganwadi/anganwadi.module').then(m => m.AnganwadiModule) },
  { path: 'amma-circle', loadChildren: () => import('./pages/amma-circle/amma-circle.module').then(m => m.AmmaCircleModule) },
  { path: 'lab-report', loadChildren: () => import('./pages/lab-report/lab-report.module').then(m => m.LabReportModule) },
  { path: 'history', loadChildren: () => import('./pages/history/history.module').then(m => m.HistoryModule) },
  { path: 'profile', loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule) },
  { path: 'alerts', loadChildren: () => import('./pages/alerts/alerts.module').then(m => m.AlertsModule) },
];
@NgModule({ imports: [RouterModule.forRoot(routes)], exports: [RouterModule] })
export class AppRoutingModule {}
