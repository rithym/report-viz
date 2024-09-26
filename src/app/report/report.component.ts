import { Component, OnInit, Input,ViewChild, Inject, ChangeDetectorRef, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  CdkDragDrop,
  moveItemInArray,
  copyArrayItem,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgDialogAnimationService } from '../reportService/dialog-action/dialog.service';
import { ReportService } from '../reportService/report.service';
import { SharedService } from '../shared.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportNameComponent } from '../report-name/report-name.component';
import { DynamicReportComponent } from '../dynamic-report/dynamic-report.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatExpansionPanel } from '@angular/material/expansion';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { DatePipe } from '@angular/common';
interface Rule {
  tableName: string;
  fieldList: any[];
  field: string;
  operator: string;
  dateOperation: string;
  value: string;
  value1: string;
  value2: string;
  valueHint: string;
  dataType: string;
  wildcard: string;
  condition: string;
}
interface JoinRule {
  fromTables: any[];
  fromTable: string;
  fromFieldList: any[];
  fromColumn: string;
  searchType: string;
  toTable: string;
  toFieldList: any[];
  toColumn:string;
}

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  done: any[] = [];
  @Input () todo: any;
  @Input() editData: any;
  @Input() graphData: any;
  displayedColumns: string[] = [];
  errorMessage: string = '';
  error: boolean = false;
  dataSource!: any;
  list: any[] = [];
  fixedColumn: any;
  tableColumn: any;
  savedReport: any[] = [];
  hint: string =
    'Hint: If you Select Condition (AND, OR). You need to add one more ruleset';
    dragging = false;
    expandTimeout: any;
    expandDelay = 1000;
    hoverDropedNode: any;
    reportName: string = '';
    selectedTableName: any;
    checkCondition: string = '';
    step: number = 0;
    isDisabled: boolean = false;
    disableTableFilter: boolean = false;
    condition: any[] = ['AND', 'OR'];
    wildcards: any[] = ['Starts With', 'Ends With', 'Contains'];
    operators: any[] = [];
    fieldArray: any[] = [];
    tableData: any[] = [];
    panelOpenState = false;
    panelOpenState1 = false;
    panelOpenState2 = false;
    mode: string = 'create';
    dateValueOptions:any[] = ['2','3','4'];
    dateOptions = [
      {
      name:'Current Month',
      operator: ['=','>','<','<=','>=','<>','!=']
      },
      {
        name:'Current Year',
        operator: ['=','>','<','<=','>=','<>','!=']
      },
      {
          name:'Last Month',
          operator: ['=','>','<','<=','>=','<>','!=']
      },
      {
        name:'Previous Year',
        operator: ['=','>','<','<=','>=','<>','!=']
      },
      {
        name:'Previous n Month',
        operator: ['=','>','<','<=','>=','<>','!=']
      },
      {
      name:'Previous Quarter',
      operator: ['=','>','<','<=','>=','<>','!=']
      },
      {
      name:'Previous n Quarter',
      operator: ['=','>','<','<=','>=','<>','!=']
      },
      {
      name:'Current n Quarter',
      operator: ['=','>','<','<=','>=','<>','!=']
      },
      {
        name:'Select Year',
        operator: ['=','>','<','<=','>=','<>','!=']
      },
      {
        name:'Select Date',
        operator: ['=','>','<','<=','>=','<>','!=']
      },
      {
        name:'Range',
        operator:['BETWEEN']
      }
    ]
    @Inject(MAT_DIALOG_DATA) public data: any;
    fields: string[] = ['name', 'age', 'city'];
    //operators: string[] = ['=', '>', '<'];
    rules: Rule[] = [];
    joinRules: JoinRule[] = [];
    selectedTables: any[] = [];
    selectedIndex: number = 0;
    @Output() childEvent = new EventEmitter();
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild('panelRef') panelRef!: MatExpansionPanel;
    displayedColumnsInput!: string[];
    totalLengthInput!: number;
    daysSelected: any[] = [];
    event: any;
    selectedDate: string = '';
    selectedColumns: any[] = [];
    currentYear: number = 0;
    years: number[] = [];
    todayDate:Date = new Date();
    @Input() tryMessage: any;
    isSelected: any = (event: any) => {
      const date =
        event.getFullYear() +
        '-' +
        ('00' + (event.getMonth() + 1)).slice(-2) +
        '-' +
        ('00' + event.getDate()).slice(-2);
      return this.daysSelected.find((x) => x == date) ? 'selected' : null;
    };
    selectDateRange(event: any) {
      console.log('date range event', event);
    }

    select(event: any, calendar: any, j: number, dataType: any, operator: any) {
      const date =
        event.getFullYear() +
        '-' +
        ('00' + (event.getMonth() + 1)).slice(-2) +
        '-' +
        ('00' + event.getDate()).slice(-2);
      const index = this.daysSelected.findIndex((x) => x == date);
      if (index < 0) this.daysSelected.push(date);
      else this.daysSelected.splice(index, 1);
      //this.selectedDate = this.daysSelected.join(', '); // Update the selectedDates property with the joined dates
      if (operator == 'IN' || (operator == 'NOT IN' && dataType == 'date')) {
        this.rules[j].value = this.daysSelected.join(', ');
      }
      calendar.updateTodaysDate();
    }

  constructor(
    public dialog: MatDialog,
    public dialogEffect: NgDialogAnimationService,
    public reportService: ReportService,
    private cdRef: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    public sharedService: SharedService,
    private datePipe: DatePipe) {
      this.currentYear = new Date().getFullYear();
      for (let year = this.currentYear; year >=1996; year--) {
        this.years.push(year);
      }
     }

  ngOnInit(): void {
    this.getTables();
    this.getAllOperators();
    this.selectedIndex = 0;
   
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    // this.cdRef.detectChanges();
    if(this.editData){
      console.log('edit data is here');
      this.getReportById();
    }
  } 
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
    
  }
  applyFilterYear(e: any) {

    this.years = this.years.filter((value: any) =>value.includes(e?.target.value))
     return this.years;
    }
    deleteAllRule(){
      this.step = 0;
      this.rules=[];
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
    });
  }
  getAllOperators() {
    this.reportService.getAllOperators().subscribe((res: any) => {
      this.operators = res;
      console.log('response of all operators', this.operators);
    });
  }
    /********Drag Properties************* */
    dragStart() {
      this.dragging = true;
    }
    dragEnd() {
      this.dragging = false;
    }
    dragHover(node: any) {
      this.hoverDropedNode = node;
      console.log('node', node);
      if (this.dragging) {
        clearTimeout(this.expandTimeout);
        this.expandTimeout = setTimeout(() => {
          //this.treeControl.expand(node);
        }, this.expandDelay);
      }
    }
    dragHoverEnd() {
      if (this.dragging) {
        clearTimeout(this.expandTimeout);
      }
    }
    /******************************************************* */

  onDrop(event: CdkDragDrop<any>) {
    console.log('dropped item', this.hoverDropedNode, event);
    this.reportService.drop(event);
    console.log('done item is', this.reportService.done);
    this.reportService.done.forEach((element) => {
      if (!this.selectedTables.includes(element.tableName)) {
        this.selectedTables.push(element.tableName);
      }
    });
  }
  addFromField(e: any,i:number){
    console.log('FROM values',e.value);
    this.tableData.forEach((table: any) => {
      console.log('columns', table.tablename, table.columns);
      if (table.tablename === e.value) {
        console.log('i m in if');
        this.joinRules[i].fromFieldList = [];
        for (let columns of table.columnslist) {
          this.joinRules[i].fromFieldList.push(columns.columnName);
        }
      }
      console.log('rules for id', i, ':', this.joinRules[i].fromFieldList);
    });
  }

  //ADD DROP DOWN VALUES FOR TO COLUMN
  addToField(e: any,i:number){
    console.log('To values',e.value);
    this.tableData.forEach((table: any) => {
      console.log('columns', table.tablename, table.columns);
      if (table.tablename === e.value) {
        console.log('i m in if');
        this.joinRules[i].toFieldList = [];
        for (let columns of table.columnslist) {
          this.joinRules[i].toFieldList.push(columns.columnName);
        }
      }
      console.log('rules for id', i, ':', this.joinRules[i].toFieldList);
    });
  }
  addJoinRule(index?:any) {
    console.log('index is',index);
    this.step = 1;
    if (this.joinRules.length == 0) {
      this.isDisabled = true;
      this.panelOpenState1 = true;
    }
    if(this.joinRules.length == 0 || (this.joinRules.length>0 && !this.joinRules[index+1]))
    this.joinRules.push({
      fromTables: [],
      fromTable: '',
      fromFieldList: [],
      fromColumn:'',
      searchType: '',
      toTable: '',
      toFieldList: [],
      toColumn: ''
    });
    if(this.joinRules.length === 1){
      this.joinRules[index].fromTables = this.selectedTables;
    }
    else {
      this.joinRules.forEach((jRule:any,i)=>{
       if(i<index+1){
        if(!this.joinRules[index+1].fromTables.includes(jRule.fromTable)){
          this.joinRules[index+1].fromTables.push(jRule.fromTable);
        }
        if(!this.joinRules[index+1].fromTables.includes(jRule.toTable)){
        this.joinRules[index+1].fromTables.push(jRule.toTable);
        }
        console.log('in else then in if',this.joinRules[index+1].fromTables)
       }
       else {
        return;
       }
      });
    }
    }
  removeJoinRule(rule: JoinRule) {
    const index = this.joinRules.indexOf(rule);

    if (index > -1) {
     // this.joinRules[index - 1].condition = '';
      this.joinRules.splice(index, 1);
    }
  }

  /***********Step 2 (Add Filters on Table Columns) ****/
  addRule(index?:any) {
    this.step = 2;

    if (this.rules.length == 0) {
      this.disableTableFilter = true;
      this.panelOpenState1 = false;
      this.panelOpenState2 = true;
    }
    if(this.rules.length == 0 || (this.rules.length>0 && !this.rules[index+1]))
    this.rules.push({
      tableName: '',
      fieldList: [],
      field: '',
      operator: '',
      dateOperation: '',
      value: '',
      value1: '',
      value2: '',
      valueHint: '',
      dataType: '',
      wildcard: '',
      condition: '',
    });
   
  }
  removeRule(rule: Rule) {
    const index = this.rules.indexOf(rule);

    if (index > -1) {
      this.rules[index - 1].condition = '';
      this.rules.splice(index, 1);
    }
  }
  onRuleChange(rule: Rule) {
    console.log('Rule changed:', rule);
  }
  genrateFields(tableName: string, i: number) {
    this.tableData.forEach((table: any) => {
      console.log('columns', table.tablename, table.columns);
      if (table.tablename === tableName) {
        console.log('i m in if');
        this.rules[i].fieldList = [];
        for (let columns of table.columnslist) {
          this.rules[i].fieldList.push(columns.columnName);
        }
      }
      console.log('rules for id', i, ':', this.rules[i].fieldList);
    });
  }

  openDialogForAddFilters(): void {
    //this.companyId = CompanyId;
    const dialogRef = this.dialogEffect.open(ReportNameComponent, {
      width: '300px',
      position: 'center',
      animation: { to: 'center' },
      data: { fields: this.done, tableName: this.reportService.selectedTableName },
      disableClose: true,
      panelClass: 'my-dialog',
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.reportName = dialogRef.componentInstance.reportName;
      console.log(`Dialog result:`, dialogRef.componentInstance.reportName);
      console.log('reportName', this.reportName);
      if(this.reportName !== undefined){
      this.saveReport();
      }
    });
  }
  sameData(data: any, tableName: string) {
    if (
      this.reportService.selectedTableName == '' ||
      this.reportService.selectedTableName == undefined ||
      this.reportService.selectedTableName == null
    ) {
      this.reportService.selectedTableName = tableName;
    }
    return this.done.includes(data) ? true : false;
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
  fieldSelection(e: any, selectedTableName: any, i: number) {
    console.log('value is', e.value);
    this.rules[i].dataType = this.tableData
      .find((element: any) => element.tablename == selectedTableName)
      .columnslist.find((column: any) => column.columnName == e.value).dataType;
    this.rules[i].value = '';
    this.rules[i].value2 = '';
  }
  genrateValidation() {
    this.rules.forEach((rule: any) => {
      if (rule.operator.length <= 0 || rule.field.length <= 0) {
        this.errorMessage = 'Operators & Field is Required';
        this.error = true;
        return this.errorMessage;
      } else if (
        rule.operator == 'IS NULL' ||
        (rule.operator == 'IS NOT NULL' && rule.field.length <= 0)
      ) {
        console.log('field length', rule.field.length, rule);
        this.errorMessage = 'Field is Required';
        this.error = true;
        return this.errorMessage;
      } else if (
        rule.operator !== 'IS NULL' &&
        rule.dataType !== 'date' &&
        rule.dataType !== 'datetime' &&
        rule.operator !== 'IS NOT NULL' &&
        rule.operator !== 'BETWEEN' &&
        rule.value.length <= 0
      ) {
        this.errorMessage = 'Operator,Field & Value is Required';
        this.error = true;
        return this.errorMessage;
      } else if (
        rule.operator !== 'IS NULL' &&
        (rule.dataType == 'date' ||  rule.dataType == 'datetime') &&
        rule.operator !== 'IS NOT NULL' &&
        rule.operator !== 'BETWEEN' &&
        rule.dateOperation == ''
      ) {
        this.errorMessage = 'Operator,Field & Date is Required';
        this.error = true;
        return this.errorMessage;
      } else if (
        (rule.operator == 'BETWEEN' &&
        rule.dataType !== 'date' &&
        rule.dataType !== 'datetime' &&
          rule.value1.length < 0) ||
        rule.value2.length < 0
      ) {
        this.errorMessage = 'Value From & Value To is Required';
        this.error = true;
        return this.errorMessage;
      } else if (
        (rule.operator == 'BETWEEN' &&
        (rule.dataType == 'date' ||  rule.dataType == 'datetime') &&
         rule.dateOperation == 'Range' &&
          (rule.value1.length <= 0 ||
        rule.value2.length <= 0))
      ) {
        this.errorMessage = 'Date in Range is Required';
        this.error = true;
        return this.errorMessage;
      }
      else if (
        (   rule.dataType == 'date' && rule.dateOperation == 'Select Year' && rule.value > this.currentYear)
      ) {
        this.errorMessage = 'Year Should be Less than or equal to Current Year';
        this.error = true;
        return this.errorMessage;
      }
      else {
        this.error = false;
        this.errorMessage = '';
        return this.errorMessage;
      }
    });
    return 'hello';
  }
  genrateHint(dataType: string, operator: any, position: number) {
    console.log('selected dataType', dataType);
    if (dataType == 'varchar' && operator == '') {
      this.rules[position].valueHint = 'Value should be in String Format';
    } else if (dataType == 'int' && operator == '') {
      this.rules[position].valueHint = 'Value should be in Numbers';
    } else if (dataType == 'datetime' && operator == '') {
      this.rules[position].valueHint = 'Value should be in Date Time format';
    } else if (
      (dataType == 'varchar' && operator == 'IN') ||
      operator == 'EXSIST' ||
      operator == 'NOT IN'
    ) {
      this.rules[position].valueHint =
        'Value should be in string & can contain  1 or 2 values in format: Value1, Value2 or Value';
    } else if (
      (dataType == 'int' && operator == 'IN') ||
      operator == 'EXSIST' ||
      operator == 'NOT IN'
    ) {
      this.rules[position].valueHint =
        'Value should be in string & can contain 1 or 2 values in format: Value1, Value2 or Value';
    } else if (
      (dataType == 'date' && operator == 'IN') ||
      operator == 'EXSIST' ||
      operator == 'NOT IN'
    ) {
      this.rules[position].valueHint =
        'Value should be in datetime & can contain 1 or 2 values in format: Value1, Value2 or Value';
    } else if (dataType == 'varchar' && operator == 'BETWEEN') {
      this.rules[position].valueHint =
        'Value should be in string & contain 2 values in format: Value1, Value2';
    } else if (dataType == 'int' && operator == 'BETWEEN') {
      this.rules[position].valueHint =
        'Value should be in string & contain 2 values in format: Value1, Value2';
    }
    // else if(dataType == 'datetime' && operator ==  'BETWEEN'){
    //   this.rules[position].valueHint = 'Date should be in datetime & contain 2 dates in format: Value1, Value2'
    // }
  }
  deleteColumn(j: number, item: any) {
    console.log('list is', this.fixedColumn, j, item);
    // const index =  this.mastersHierarchy.indexOf(master);
    const x = this.reportService.done.splice(j, 1);
    this.selectedTables = [];
    if(this.reportService.done.length === 0) {this.selectedTables = []}
    else {
    this.reportService.done.forEach((element) => {
      if (!this.selectedTables.includes(element.tableName)) {
        this.selectedTables.push(element.tableName);
      }
    });
  }
    //  this.tableColumn.push(item);
  }

  disableSaveButton() {
    let checkArr: any[] = [];
    if (this.reportService.done.length <= 0) {
      return true;
    }
    else if(this.selectedTables.length > 1){
      this.selectedTables.forEach((table: any)=>{
        this.joinRules.forEach((jRule:any)=>{
        if(table == jRule.fromTable){
          if(!checkArr.includes(table)){
            checkArr.push(table);
          }
        }
        if(table == jRule.toTable){
          if(!checkArr.includes(table)){
            checkArr.push(table);
          }
        }
      });
      });
       if (JSON.stringify(checkArr) === JSON.stringify(this.selectedTables)){
         return false;
      }
      else if(checkArr !== this.selectedTables) {
        return true;
      }
    }
    else if(this.error === true){
      return true;
    }
    return false;
  }

  disableTableFilterButton(){
    let checkArr: any[] = [];
    if(this.selectedTables.length == 0){
      return true;
    }
    else if(this.selectedTables.length > 1){
      this.selectedTables.forEach((table: any)=>{
        this.joinRules.forEach((jRule:any)=>{
        if(table == jRule.fromTable){
          if(!checkArr.includes(table)){
            checkArr.push(table);
          }
        }
        if(table == jRule.toTable){
          if(!checkArr.includes(table)){
            checkArr.push(table);
          }
        }
      });
      });
       if (JSON.stringify(checkArr) === JSON.stringify(this.selectedTables)){
         return false;
      }
      else if(checkArr !== this.selectedTables) {
        return true;
      }
    }
    else if(this.rules.length > 0){
      return true;
    }
    return false;
  }
  disableExcuteButton() {
    let checkArr: any[] = [];
    if(this.selectedTables.length > 1){
    this.selectedTables.forEach((table: any)=>{
      this.joinRules.forEach((jRule:any)=>{
      if(table == jRule.fromTable){
        if(!checkArr.includes(table)){
          checkArr.push(table);
        }
      }
      if(table == jRule.toTable){
        if(!checkArr.includes(table)){
          checkArr.push(table);
        }
      }
    });
    });
      console.log(' i m grater');
      console.log('selected Table',this.selectedTables);
      console.log('check array is',checkArr);
     if (JSON.stringify(checkArr) === JSON.stringify(this.selectedTables)){
      console.log('i m in this');
       return false;
    }
    else if(checkArr !== this.selectedTables) {
      console.log('in else if');
      return true;
    }
  }
   else if (this.reportService.done.length <= 0) {
      return true;
    }
    else if(this.error === true){
      return true;
    }
    return false;
  }
  //show table method
  saveReport() {
    this.genrateValidation();
    let count = 0;
    if (this.reportName !== undefined){
      count = this.reportName.length;
    }
    //this.step = 2;
    if (this.mode == 'create' && this.error === false && this.reportName == ''|| this.reportName == undefined) {
      this.openDialogForAddFilters();
    } else if (
      this.reportName !== '' &&
      this.reportName !== null &&
      this.reportName !== undefined &&
      count > 0
    ) {
      console.log('save table clicked!!!!', this.rules);
      let obj = {
        field: '',
        operator: '',
        dateOpeartion: '',
        value: '',
        value2: '',
        datatype: '',
        condition: '',
        wildcard: '',
        tableName: '',
      };
      let requestBody;
      let finalRequestBody;

      if (this.mode == 'update') {
        console.log('in update');

        this.reportService.done.forEach((column: any) => {
          // Check if the column name already exists in the selectedColumns list

          const isColumnAlreadySelected = this.selectedColumns.some(
            (selectedColumn: any) => {
              return (
                selectedColumn.columnName === column.columnName &&
                selectedColumn.tableName === column.tableName
              );
            }
          );

          if (!isColumnAlreadySelected) {
            // Create the new object

            const obj = {
              columnName: column.columnName,

              tableName: column.tableName,
            };

            // Push the new object into the selectedColumns list

            this.selectedColumns.push(obj);
          }
        });

        // Filter out any duplicates based on columnName and tableName

        this.selectedColumns = this.selectedColumns.filter(
          (column: any, index: number, self: any[]) => {
            return (
              index ===
              self.findIndex(
                (c: any) =>
                  c.columnName === column.columnName &&
                  c.tableName === column.tableName
              )
            );
          }
        );
      } else if (this.mode == 'create') {
        this.selectedColumns = this.reportService.done;
      }
      const objjoin = {
        tableJoin: this.joinRules,
      };
      // Convert objjoin to JSON string
      const jsonString = JSON.parse(JSON.stringify(objjoin));
      if (this.rules.length <= 0 && this.reportService.done.length >= 0) {
        this.panelOpenState1 = false;
        this.panelOpenState2 = false;
        this.checkCondition = 'emptyFilter';
        //this.step = 2;
      } else {
        this.genrateValidation();
        if(this.error === true ){
          return;
        }
        else if (this.error === false) {
          this.panelOpenState1 = false;
          this.panelOpenState2 = false;
          this.step = 2;
          this.rules.forEach((rule: any) => {
            console.log('rules are', this.rules);
            if (rule.operator == 'BETWEEN' &&  rule.dataType !== 'date' &&  rule.dataType !== 'datetime') {
              rule.value = rule.value1 + ';' + rule.value2;
            } else if (rule.operator == 'BETWEEN' &&  (rule.dataType == 'date' ||  rule.dataType == 'datetime') && rule.dateOperation == 'Range') {
              const date1 =
                rule.value1.getFullYear() +
                '-' +
                ('00' + (rule.value1.getMonth() + 1)).slice(-2) +
                '-' +
                ('00' + rule.value1.getDate()).slice(-2);
              const date2 =
                rule.value2.getFullYear() +
                '-' +
                ('00' + (rule.value2.getMonth() + 1)).slice(-2) +
                '-' +
                ('00' + rule.value2.getDate()).slice(-2);
              rule.value = date1 + ';' + date2;
              console.log('date value is', rule.value);
            }
            else if (  (rule.dataType == 'date' ||  rule.dataType == 'datetime') && (rule.operator == '>'|| rule.operator == '<' || rule.operator == '<=' || rule.operator == '>=' || rule.operator == '<>') && rule.dateOperation === 'Select Year') {
              const currentDate = rule.value instanceof Date ? rule.value :
            new Date(rule.value);
            const date1 = currentDate.getFullYear() + '-' + ('00' + (currentDate.getMonth() + 1)).slice(-2) + '-' + ('00' + currentDate.getDate()).slice(-2);
            rule.value = currentDate instanceof Date ? date1 : new Date(date1);
            console.log('date value is', rule.value);
            }
          });
        }

        console.log('rules', this.rules);
      }
      requestBody = [
        {
          jsonString,
          selectedColumns: this.selectedColumns,
          tableName: this.reportService.selectedTableName,
          reportName: this.reportName,
          reportQuery: this.rules.length > 0 ? this.rules : [obj],
        },
      ];

      const updatedRequestBody = requestBody.map(({ jsonString, ...rest }) => ({
        ...jsonString,
        ...rest,
      }));
      finalRequestBody = updatedRequestBody.map((obj) => ({
        ...obj.jsonString,
        ...obj,
      }));
      console.log(finalRequestBody);
      console.log('requestBody is', JSON.stringify(requestBody));
      this.childEvent.emit(finalRequestBody);
      
    }
  }
  applyFilter(event: any) {
    let filterValue = event?.target.value; //(event.target as HTMLInputElement).value;
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  showTable() {
    //this.panelRef?.close();
    this.displayedColumns = [];
    let requestBody;
    let finalRequestBody;
    let obj = {
      field: '',
      operator: '',
      dateOpeartion: '',
      value: '',
      value2: '',
      datatype: '',
      condition: '',
      wildcard: '',
      tableName: '',
    };
    if (this.mode == 'update') {
      console.log('in update');

      this.reportService.done.forEach((column: any) => {
        // Check if the column name already exists in the selectedColumns list

        const isColumnAlreadySelected = this.selectedColumns.some(
          (selectedColumn: any) => {
            return (
              selectedColumn.columnName === column.columnName &&
              selectedColumn.tableName === column.tableName
            );
          }
        );

        if (!isColumnAlreadySelected) {
          // Create the new object

          const obj = {
            columnName: column.columnName,
            tableName: column.tableName,
          };

          // Push the new object into the selectedColumns list

          this.selectedColumns.push(obj);
        }
      });

      // Filter out any duplicates based on columnName and tableName

      this.selectedColumns = this.selectedColumns.filter(
        (column: any, index: number, self: any[]) => {
          return (
            index ===
            self.findIndex(
              (c: any) =>
                c.columnName === column.columnName &&
                c.tableName === column.tableName
            )
          );
        }
      );

      console.log('selected columns', this.selectedColumns);
    } else if (this.mode == 'create') {
      this.selectedColumns = this.reportService.done;
    }

    const objjoin = {
      tableJoin: this.joinRules,
    };
    // Convert objjoin to JSON string
    const jsonString = JSON.parse(JSON.stringify(objjoin));
    if (this.rules.length <= 0 && this.reportService.done.length >= 0) {
      this.panelOpenState1 = false;
      this.panelOpenState2 = false;
      this.checkCondition = 'emptyFilter';
     // this.step = 3;
    } else {
      this.genrateValidation();
      if(this.error === true){
        return;
      }
      if (this.error === false) {
        this.panelOpenState1 = false;
        this.panelOpenState2 = false;
        //this.step = 2;
        this.rules.forEach((rule: any) => {
          console.log('rules are', this.rules);
          if (rule.operator == 'BETWEEN' &&  rule.dataType !== 'date' &&  rule.dataType !== 'datetime') {
            rule.value = rule.value1 + ';' + rule.value2;
          } else if (rule.operator == 'BETWEEN' &&  (rule.dataType == 'date' ||  rule.dataType == 'datetime') && rule.dateOperation == 'Range') {
            const date1 =
              rule.value1.getFullYear() +
              '-' +
              ('00' + (rule.value1.getMonth() + 1)).slice(-2) +
              '-' +
              ('00' + rule.value1.getDate()).slice(-2);
            const date2 =
              rule.value2.getFullYear() +
              '-' +
              ('00' + (rule.value2.getMonth() + 1)).slice(-2) +
              '-' +
              ('00' + rule.value2.getDate()).slice(-2);
            rule.value = date1 + ';' + date2;
            console.log('date value is', rule.value);
          }
          else if ((rule.dataType == 'date' ||  rule.dataType == 'datetime') && (rule.operator == '>'|| rule.operator == '<' || rule.operator == '<=' || rule.operator == '>=' || rule.operator == '<>') && rule.dateOperation == 'Select Date') {
            const currentDate = rule.value instanceof Date ? rule.value :
            new Date(rule.value);
            const date1 = currentDate.getFullYear() + '-' + ('00' + (currentDate.getMonth() + 1)).slice(-2) + '-' + ('00' + currentDate.getDate()).slice(-2);
            rule.value = currentDate instanceof Date ? date1 : new Date(date1);
            console.log('date value is', rule.value);
          }
        });
      }

      console.log('rules',jsonString, this.rules);
    }
    requestBody = [
      {
        jsonString,
        selectedColumns: this.selectedColumns,
        tableName: this.reportService.selectedTableName,
        reportName: this.reportName,
        reportQuery: this.rules.length > 0 ? this.rules : [obj],
      },
    ];

    const updatedRequestBody = requestBody.map(({ jsonString, ...rest }) => ({
      ...jsonString,
      ...rest,
    }));
    finalRequestBody = updatedRequestBody.map((obj) => ({
      ...obj.jsonString,
      ...obj,
    }));
    console.log(finalRequestBody);
    this.reportService.genrateTable(finalRequestBody).subscribe((res: any) => {
      console.log('response', res);
       if(res.ResultList.length <= 0){
        this.snackBar.open(`No Data Found with applied filter`, 'Close', {
          duration: 3000, // Snackbar display duration in milliseconds
        });
        return;
       }
      this.list = res.ResultList;
      this.selectTab(1);
      this.displayedColumnsInput = res;
      console.log('keys are', Object.keys(this.list[0]));
      if (this.selectedTables.length == 1) {
        this.reportService.done.forEach((column: any) => {
          this.displayedColumns.push(column.columnName);
          //  this.displayedColumns = Object.keys(this.list[0]);
        });
      } else if (this.selectedTables.length > 1) {
        this.displayedColumns = Object.keys(this.list[0]);
      }
      // Check and format date values
      this.list.forEach((item: any) => {
        Object.keys(item).forEach((key: string) => {
          const value = item[key];
          if (
            typeof value === 'string' &&
            /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
          ) {
            item[key] = this.datePipe.transform(value, 'dd-MM-yyyy'); // Modify the format as per your requirements
          }
        });
      });
    });

    //INITIALIZE MatTableDataSource
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
  getReportById() {
    this.rules = [];
      this.step = 2;
      this.selectedTables = [];
      console.log('selected columns', this.editData[0].selectedColumns);
      this.editData[0].selectedColumns.forEach((element: any) => {
        if (!this.selectedTables.includes(element.tableName)) {
          this.selectedTables.push(element.tableName);
        }
      });

      this.selectedColumns = this.editData[0].selectedColumns;
      console.log('this selected colmns', this.selectedColumns);
      this.reportService.done = this.selectedColumns;
      //this.sameData(obj2,reportQ.tableName);
      this.tableData = this.tableData;
      //this.reportService.selectedTableName = this.editData[0].TableName;
      this.reportName = this.editData[0].ReportName;
      this.editData[0].tableJoin.forEach((joinRule:any)=>{
        let joinObj = {
          fromTables: [],
          fromTable: joinRule.fromTable,
          fromFieldList: [],
          fromColumn: joinRule.fromColumn,
          searchType: joinRule.searchType,
          toTable: joinRule.toTable,
          toFieldList: [],
          toColumn: joinRule.toColumn
          }
          this.joinRules.push(joinObj)
      });
      this.joinRules.forEach((jRule:any, i) => {
        this.tableData.forEach((table: any) => {
          if(table.tablename == jRule.fromTable){
            for (let columns of table.columnslist) {
              jRule.fromFieldList.push(columns.columnName);
            } 
          }
          if(table.tablename == jRule.toTable){
            for (let columns of table.columnslist) {
              jRule.toFieldList.push(columns.columnName);
            } 
          }
        });
      if(this.joinRules.length === 1){
       jRule.fromTables = this.selectedTables;
      }
      else if(this.joinRules.length > 1) {
          if (i === 0) {
            jRule.fromTables = this.selectedTables;
          } else {
            for (let z = 0; z < i; z++) {
              if(jRule.fromTables.length > 0 ){
              if (!jRule.fromTables.includes(this.joinRules[z].fromTable)) {
                jRule.fromTables.push(this.joinRules[z].fromTable);
              }
              if (!jRule.fromTables.includes(this.joinRules[z].toTable)) {
                jRule.fromTables.push(this.joinRules[z].toTable);
              }
            }
            else {
              jRule.fromTables.push(this.joinRules[z].fromTable);
              jRule.fromTables.push(this.joinRules[z].toTable);
            }
            }
          }
      }
    });
      console.log('jon rules *******',this.joinRules);
      //{Field: 'Age', Operator: '>', Value: '20', datatype: 'int', condition: 'AND'}
      this.editData[0].ReportQuery.forEach((reportQ: any) => {
        this.fieldArray.push(reportQ.field);
      });
      this.editData[0].ReportQuery.forEach((reportQ: any, index: number) => {
        if (
          reportQ.operator == '' ||
          reportQ.operator == undefined ||
          reportQ.operator == null
        ) {
          this.checkCondition = 'emptyFilter';
          return;
        }
        let val;
        if (reportQ.operator == 'BETWEEN') {
          val = reportQ.value.split(',');
        }
        let obj = {
          tableName: reportQ.tableName,
          fieldList: this.genrateFieldsEdit(reportQ.tableName, index),
          field: reportQ.field,
          operator: reportQ.operator,
          dateOperation: reportQ.dateOperation,
          value: reportQ.operator !== 'BETWEEN' ? reportQ.value : '',
          value1: reportQ.operator == 'BETWEEN' ? val[0] : '',
          value2: reportQ.operator == 'BETWEEN' ? val[1] : '',
          valueHint: '',
          dataType: reportQ.datatype,
          wildcard: reportQ.wildcard,
          condition: reportQ.condition,
        };
        this.rules.push(obj);
      });
    this.mode = 'update';
  }
  getToolTip(position: number) {
    if (
      this.rules[position].operator == 'IS NULL' &&
      this.rules[position].operator == 'IS NOT NULL'
    ) {
      return 'Not Requird';
    } else {
      return this.rules[position].valueHint;
    }
  }
  clearAll() {
    this.step = 0;
    this.disableTableFilter = true;
    this.isDisabled = false;
    this.mode = 'create';
    this.checkCondition = '';
    this.reportService.done = [];
    this.selectedTables = [];
    this.rules = [];
    this.list = [];
    this.reportService.selectedTableName = '';
    this.reportName = '';
    this.displayedColumns = [];
    this.dataSource = [];
  }
  selectTab(index: number): void {
    this.selectedIndex = index;
  }
  switchTab(val: number) {
    console.log('tabs value',val)
    this.selectedIndex = val;
   // this.currentUpdatedValues = val.currentTabValues
  }
}
