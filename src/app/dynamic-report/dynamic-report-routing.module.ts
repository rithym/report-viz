import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HierarchyComponent } from '../hierarchy/hierarchy.component';
import { DynamicReportComponent } from './dynamic-report.component';
import { ColumnHierarachyComponent } from '../column-hierarachy/column-hierarachy.component';
import { ReportComponent } from '../report/report.component';
import { TableDataComponent } from '../table-data/table-data.component';
import { GenrateReportComponent } from '../genrate-report/genrate-report.component';

const routes: Routes = [
  {
    path: '',
    component: DynamicReportComponent,
    children: [
  {
    path: 'individual-hierarchy',
    component: ColumnHierarachyComponent,
   },
   {
    path: 'entire-hierarchy',
    component: HierarchyComponent,
   },
   {
    path: 'genrate-report',
    component: ReportComponent,
   },
   {
    path: 'table-data',
    component: TableDataComponent,
   }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DynamicReportRoutingModule { }
