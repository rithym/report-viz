import { NgModule } from '@angular/core';
import { NgxOrgChartModule } from 'ngx-org-chart';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReportService } from './reportService/report.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ReportNameComponent } from './report-name/report-name.component';
import { DatePipe } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { ApiPrefixInterceptor } from './api-prefix.interceptor';
import { SpinnerPopupComponent } from './spinner-popup/spinner-popup.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    ReportNameComponent,
    LoginComponent,
    SpinnerPopupComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgxOrgChartModule
    
  ],
  providers: [DatePipe,{
    provide: HTTP_INTERCEPTORS,
    useClass: ApiPrefixInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent],
})
export class AppModule {}
