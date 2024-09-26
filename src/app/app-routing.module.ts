import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicReportModule } from './dynamic-report/dynamic-report.module';
import { DynamicReportComponent } from './dynamic-report/dynamic-report.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
const routes: Routes = [
 {
    path: 'login',
    component:LoginComponent
  },
  {
    path: 'report',
    loadChildren: () =>
    import('../app/dynamic-report/dynamic-report.module').then(
      (m) => m.DynamicReportModule
    ),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
