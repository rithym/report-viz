import {
  Component,
  OnInit,
  Inject,
  ChangeDetectorRef,
  ViewChild,
  Input
} from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgDialogAnimationService } from '../reportService/dialog-action/dialog.service';
import { ReportService } from '../reportService/report.service';
import { SharedService } from '../shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportNameComponent } from '../report-name/report-name.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dynamic-report',
  templateUrl: './dynamic-report.component.html',
  styleUrls: ['./dynamic-report.component.scss'],
})
export class DynamicReportComponent implements OnInit {
  error: boolean = false;
  sidebaractive: boolean = true;
  public searchText: string = '';
  dataSource!: any;
  list: any[] = [];
  fixedColumn: any;
  tableColumn: any;
  savedReport: any[] = [];
  @Input('doneList')
  reportName: string = '';
  selectedTableName: any;
  checkCondition: string = '';
  step: number = 0;
  fieldArray: any[] = [];
  tableData: any[] = [];
  panelOpenState = false;
  panelOpenState1 = false;
  panelOpenState2 = false;
  mode: string = 'create';
  @Inject(MAT_DIALOG_DATA) public data: any;
  selectedTables: any[] = [];
  rules: any[] =[];
  selectedColumns: any;
  public tryMessage: any;
  editData:any;
  graphData:any;
  selectedMenu: any;
  constructor(
    public dialog: MatDialog,
    public dialogEffect: NgDialogAnimationService,
    private reportService: ReportService,
    private cdRef: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    public sharedService: SharedService,
    private datePipe: DatePipe
  ) {
    this.getTables();
    this.getSavedReport();
  }

  ngOnInit(): void {}
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  getTables() {
    let col: any = [];
    this.reportService.getTableList().subscribe((res: any) => {
      this.tableData = res.filter(
        (table: any) =>
          table.tablename !== 'errorlog' &&
          table.tablename !== 'opratorslist' &&
          table.tablename !== 'tblreportlist' &&
          table.tablename !== 'categories'

      );
      this.tableData.forEach((table: any) => {
        table.panelOpenState = false;
        return this.tableData;
      });
    });
  }

  onSearchText(e: any) {
    this.searchText = e?.target.value;
    let len = this.searchText.length;
    this.searchText = this.searchText.trim(); // Remove whitespace
    this.searchText = this.searchText.toLowerCase(); // Datasource defaults to lowercase matches
    if (
      this.searchText !== '' &&
      this.searchText !== undefined &&
      this.searchText !== null &&
      this.searchText !== ' ' &&
      len !== 0
    ) {
      this.tableData = this.tableData.filter(
        (table: any) =>
          table.tablename.includes(this.searchText) &&
          table.tablename !== 'errorlog' &&
          table.tablename !== 'opratorslist' &&
          table.tablename !== 'tblreportlist' &&
          table.tablename !== 'categories'
      );
      console.log(this.searchText, ': ', this.tableData, len);
      return this.tableData;
    } else {
      console.log('in else case');
      return this.getTables();
    }
  }
  clearSearch() {
    this.searchText = '';
    return this.getTables();
  }
  getSavedReport() {
    this.reportService.getAllSavedReports().subscribe((res: any) => {
      this.savedReport = res;
      console.log('response of savedReport', this.savedReport);
    });
  }
  /******************************************Step 0(Drag & Drop Function)*********************************************/
  openDialogForAddFilters(): void {
    //this.companyId = CompanyId;
    const dialogRef = this.dialogEffect.open(ReportNameComponent, {
      width: '300px',
      position: 'center',
      animation: { to: 'center' },
      data: { fields: this.reportService.done, tableName: this.reportService.selectedTableName },
      disableClose: true,
      panelClass: 'my-dialog',
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.reportName = dialogRef.componentInstance.reportName;
      console.log(`Dialog result:`, dialogRef.componentInstance.reportName);
      console.log('reportName', this.reportName);
      if(this.reportName !== undefined){
     // this.saveReport();
      }
    });
  }
  saveReport(finalRequestBody: any) {
    this.reportService.addReport(finalRequestBody).subscribe(
      (res: any) => {
        console.log('response', res);
        this.snackBar.open(`${res.message}`, 'Close', {
          duration: 3000, // Snackbar display duration in milliseconds
        });
      },
      (error) => {
        // You can access status:
        //if(res.text == 'Report Successfully Saved.' || res.text == 'Report Successfully Updated.'){
        if (error.status == 200) {
          //this.getSavedReport();
          this.snackBar.open(`${error.error.text}`, 'Close', {
            duration: 3000, // Snackbar display duration in milliseconds
          });
          this.getSavedReport();
        }
      }
    );
  }
  sameData(data: any, tableName: string) {
    if (
      this.reportService.selectedTableName == '' ||
      this.reportService.selectedTableName == undefined ||
      this.reportService.selectedTableName == null
    ) {
      this.reportService.selectedTableName = tableName;
    }
    return this.reportService.done.includes(data) ? true : false;
  }
  clickedTable(tableName: any, position: number) {
    console.log('clickd', tableName);
    this.tableData[position].panelOpenState =
      !this.tableData[position].panelOpenState;
    this.reportService.selectedTableName = tableName;
    this.tableColumn = this.tableData.filter(
      (columns: any) => columns.tablename == this.reportService.selectedTableName
    );
    this.fixedColumn = this.tableData.filter(
      (columns: any) => columns.tablename == this.reportService.selectedTableName
    );
    console.log('clickd', this.tableColumn);
  }

  genrateFieldsEdit(tableName: any, i: number) {
    let fields: any = [];
    this.tableData.forEach((table: any) => {
      console.log('columns', table.tablename, table.columns);
      if (table.tablename === tableName) {
        console.log('i m in if', i);
        for (let columns of table.columnslist) {
          fields.push(columns.columnName);
        }
        return fields;
      }
      return fields;
    });
    return fields;
  }
  getReportById(reportId: number) {
    this.reportService.getSelectedReport(reportId).subscribe((res: any) => {
      console.log('report data', JSON.parse(res[0].reportqueryfilters));
       this.editData = JSON.parse(res[0].reportqueryfilters);
       this.graphData = JSON.parse(res[0].graphData)
    });
  }
  changeMenu(value:any){
    console.log('value is for selected menu',value);
    this.selectedMenu=value;
  }
  
}
