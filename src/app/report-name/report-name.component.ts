import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DynamicReportComponent } from '../dynamic-report/dynamic-report.component';
export interface DialogData{
  report: string
}
@Component({
  selector: 'app-report-name',
  templateUrl: './report-name.component.html',
  styleUrls: ['./report-name.component.scss']
})

export class ReportNameComponent implements OnInit {
  reportName: any;
  constructor( public dialogRef: MatDialogRef<DynamicReportComponent>,  public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data:DialogData) { }

  ngOnInit(): void {
  }
  closeDialog() {
     this.data = this.reportName
     console.log('reportName in dialog',this.reportName,this.data);
    // Send data to the parent component
    this.dialogRef.close();
}

}
