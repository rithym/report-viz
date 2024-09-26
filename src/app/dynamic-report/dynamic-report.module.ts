import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicReportRoutingModule } from './dynamic-report-routing.module';
import { HierarchyComponent } from '../hierarchy/hierarchy.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicReportComponent } from './dynamic-report.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { ColumnHierarachyComponent } from '../column-hierarachy/column-hierarachy.component';
import { TreeComponent } from '../tree/tree.component';
import { DynamicChartComponent } from '../dynamic-chart/dynamic-chart.component';
import { ReportComponent } from '../report/report.component';
import { TableDataComponent } from '../table-data/table-data.component';
import { GenrateReportComponent } from '../genrate-report/genrate-report.component';
import { ChartDialogComponent } from '../chart-dialog/chart-dialog.component';
import { NgxOrgChartModule } from 'ngx-org-chart';
@NgModule({
  declarations: [
    DynamicReportComponent,
    DynamicChartComponent,
    HierarchyComponent,
    ColumnHierarachyComponent,
    TreeComponent,
    ReportComponent,
    TableDataComponent,
    ChartDialogComponent,
    
  ],
    imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicReportRoutingModule,
    NgxOrgChartModule
  ],
  exports: [
    DynamicReportComponent,
    ReportComponent,
  ]
})
export class DynamicReportModule {}
