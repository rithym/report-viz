import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatExpansionPanel } from '@angular/material/expansion';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { SharedService } from '../shared.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-table-data',
  templateUrl: './table-data.component.html',
  styleUrls: ['./table-data.component.scss']
})
export class TableDataComponent implements OnInit {
  @Input() displayedColumns: string[] = [];
  @Input() list: any[] = [];
  @Input() displayedColumnsInput!: string[];
  @Input() selectedIndex!: number;
  @Output() tabEvent = new EventEmitter<number>();
  expandTimeout: any;
    expandDelay = 1000;
    panelOpenState = false;
    totalLength: number = 0;
    pageSizeOptions = [5, 10, 25, 100];
    pageSize = 5;
    dataSource!: any;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild('panelRef') panelRef!: MatExpansionPanel;
    totalLengthInput!: number;
    daysSelected: any[] = [];
    event: any;
  constructor(public sharedService: SharedService) { }
 ngOnChanges(){
  console.log('list length is', this.list.length);
  if(this.list.length > 0){
    this.dataSource = new MatTableDataSource(this.list);
      this.totalLength = this.list.length;
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      this.dataSource.sort = this.sort;
      console.log('DATA Source', this.dataSource, this.list);
      this.panelRef?.close();
    }
 }
  ngOnInit(): void {
   
  }
  applyFilter(event: any) {
    let filterValue = event?.target.value; //(event.target as HTMLInputElement).value;
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
 //Download Attributes
 public downloadPDF(): void {
  const doc = new jsPDF.default();
  const head = this.displayedColumns;
  const pdfData: any[][] = [];
  this.dataSource.data.forEach((e: any) => {
    const rowData: any[] = [];
    for (const key in e) {
      if (e.hasOwnProperty(key)) {
        rowData.push(e[key]);
      }
    }
    pdfData.push(rowData);
  });
  console.log('pdfData', pdfData);
  doc.setFontSize(18);
  doc.text('Result Report', 11, 8);
  doc.setFontSize(11);
  doc.setTextColor(100);
  (doc as any).autoTable({
    head: [head],
    body: pdfData,
    theme: 'striped',
    didDrawCell: (data: any) => {
      // Manipulate cell data if needed
    },
  });
  // Open PDF document in new tab
  doc.output('dataurlnewwindow');
  // Download PDF document
  doc.save('Result-Report.pdf');
}

/**
 * Will export the table details in CSV format.
 */
exportToCSV() {
  // let itemToBeRemoved = ['edit', 'enableOrDisable', 'disable'];
  let columns = this.displayedColumns;
  // .filter((item: any) => {
  //   return item;
  // });
  this.sharedService.downloadFile(
    this.dataSource.data,
    'Result-Report',
    columns
  );
}

/**
 * Will download the table details in EXCEL format.
 */
exportToExcel() {
  let excelData = this.dataSource.data;
  // .map((u:any) => ({
  //   // ModuleName: u.moduleName,
  //   // Description: u.moduleDescription,
  //   // Status: u.isEnabled
  // }));
  this.sharedService.exportAsExcelFile(excelData, 'Result-Report');
}
switchToTab(newTab: number){
  console.log('tab events',newTab);
  this.tabEvent.emit(newTab)
}
}
