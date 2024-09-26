import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, SimpleChanges, Output, EventEmitter, HostListener } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReportService } from '../reportService/report.service';
import { registerables } from 'chart.js/auto';
import { Chart } from 'chart.js';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatDialog } from '@angular/material/dialog';
import { ChartDialogComponent } from '../chart-dialog/chart-dialog.component';
import { CommonService } from '../reportService/common.service';
import { ChartsService } from '../reportService/charts.service';

Chart.register(...registerables);


@Component({
  selector: 'app-dynamic-chart',
  templateUrl: './dynamic-chart.component.html',
  styleUrls: ['./dynamic-chart.component.scss'],
})
export class DynamicChartComponent implements OnInit,AfterViewInit {
  nodes: any = [
    {
      name: 'Sundar Pichai',
      cssClass: 'ngx-org-ceo',
      image: '',
      title: 'Chief Executive Officer',
      childs: [
        {
          name: 'Thomas Kurian',
          cssClass: 'ngx-org-ceo',
          image: 'assets/node.svg',
          title: 'CEO, Google Cloud',
        },
        {
          name: 'Susan Wojcicki',
          cssClass: 'ngx-org-ceo',
          image: 'assets/node.svg',
          title: 'CEO, YouTube',
          childs: [
            {
              name: 'Beau Avril',
              cssClass: 'ngx-org-head',
              image: 'assets/node.svg',
              title: 'Global Head of Business Operations',
              childs: []
            },
            {
              name: 'Tara Walpert Levy',
              cssClass: 'ngx-org-vp',
              image: 'assets/node.svg',
              title: 'VP, Agency and Brand Solutions',
              childs: []
            },
            {
              name: 'Ariel Bardin',
              cssClass: 'ngx-org-vp',
              image: 'assets/node.svg',
              title: 'VP, Product Management',
              childs: []
            }
          ]
        },
        {
          name: 'Jeff Dean',
          cssClass: 'ngx-org-head',
          image: 'assets/node.svg',
          title: 'Head of Artificial Intelligence',
          childs: [
            {
              name: 'David Feinberg',
              cssClass: 'ngx-org-ceo',
              image: 'assets/node.svg',
              title: 'CEO, Google Health',
              childs: []
            }
          ]
        }
      ]
    },
    {
      name: 'Sundar Pichai',
      cssClass: 'ngx-org-ceo',
      image: 'assets/node.svg',
      title: 'Chief Executive Officer',
      childs: [
        {
          name: 'Thomas Kurian',
          cssClass: 'ngx-org-ceo',
          image: 'assets/node.svg',
          title: 'CEO, Google Cloud',
        },
        {
          name: 'Susan Wojcicki',
          cssClass: 'ngx-org-ceo',
          image: 'assets/node.svg',
          title: 'CEO, YouTube',
          childs: [
            {
              name: 'Beau Avril',
              cssClass: 'ngx-org-head',
              image: 'assets/node.svg',
              title: 'Global Head of Business Operations',
              childs: []
            },
            {
              name: 'Tara Walpert Levy',
              cssClass: 'ngx-org-vp',
              image: 'assets/node.svg',
              title: 'VP, Agency and Brand Solutions',
              childs: []
            },
            {
              name: 'Ariel Bardin',
              cssClass: 'ngx-org-vp',
              image: 'assets/node.svg',
              title: 'VP, Product Management',
              childs: []
            }
          ]
        },
        {
          name: 'Jeff Dean',
          cssClass: 'ngx-org-head',
          image: 'assets/node.svg',
          title: 'Head of Artificial Intelligence',
          childs: [
            {
              name: 'David Feinberg',
              cssClass: 'ngx-org-ceo',
              image: 'assets/node.svg',
              title: 'CEO, Google Health',
              childs: []
            }
          ]
        }
      ]
    },
    {
      name: 'Sundar Pichai',
      cssClass: 'ngx-org-ceo',
      image: 'assets/node.svg',
      title: 'Chief Executive Officer',
      childs: [
        {
          name: 'Thomas Kurian',
          cssClass: 'ngx-org-ceo',
          image: 'assets/node.svg',
          title: 'CEO, Google Cloud',
        },
        {
          name: 'Susan Wojcicki',
          cssClass: 'ngx-org-ceo',
          image: 'assets/node.svg',
          title: 'CEO, YouTube',
          childs: [
            {
              name: 'Beau Avril',
              cssClass: 'ngx-org-head',
              image: 'assets/node.svg',
              title: 'Global Head of Business Operations',
              childs: []
            },
            {
              name: 'Tara Walpert Levy',
              cssClass: 'ngx-org-vp',
              image: 'assets/node.svg',
              title: 'VP, Agency and Brand Solutions',
              childs: []
            },
            {
              name: 'Ariel Bardin',
              cssClass: 'ngx-org-vp',
              image: 'assets/node.svg',
              title: 'VP, Product Management',
              childs: []
            }
          ]
        },
        {
          name: 'Jeff Dean',
          cssClass: 'ngx-org-head',
          image: 'assets/node.svg',
          title: 'Head of Artificial Intelligence',
          childs: [
            {
              name: 'David Feinberg',
              cssClass: 'ngx-org-ceo',
              image: 'assets/node.svg',
              title: 'CEO, Google Health',
              childs: []
            }
          ]
        }
      ]
    }
  ];
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    
    // You can perform your actions here, such as making an API call or showing an alert.
    const confirmationMessage = 'Are you sure you want to leave?';
    alert(confirmationMessage)
    $event.returnValue = confirmationMessage;
  }
  @Input() selectedIndex!: number;
  @Input() displayedColumnsInput!: any;
  @Input() charData: any;
  @Input() graphData: any;
  @Output() tabEvent = new EventEmitter<number>();
  chartForm!: FormGroup;
  columnDataFromInput: any = [];
  MultipleCharts: any = [];
  public chart:any;
  public chartsTypes: any = ['bar', 'doughnut', 'line', 'scatter'];
  dataTypes: any[] = [
    { aggFn: 'count', value: 'count' },
    { aggFn: 'sum', value: 'sum' },
    { aggFn: 'minimum', value: 'min' },
    { aggFn: 'maximum', value: 'max' },
    { aggFn: 'average', value: 'avg' },
  ];
  public groupList: any = ['none', 'group by'];
  public dateFormats: any = [
    {formate:'Month', value:'MM'},
    {formate:'Month and Year', value:'MY'}
  ];
  xAxisColumnControl!: any;
  xAxisColumnSubscription!: any;
  yAxisColumnControl!: any;
  yAxisColumnSubscription!: any;
  showDateXaxis: boolean = true;
  showDateYaxis: boolean = true;
  isEditClicked: boolean = false;
  chartDetailsArray:any = [];  
  chartDetailsArray2:any = [];  
  chartInstances: { [chartId: string]: any } = {};
  isTabActive: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    public service: ReportService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public commonService: CommonService,
    private changeDetectorRef: ChangeDetectorRef,
    public chartsService: ChartsService
  ) {}

  ngOnInit(): void {
    this.createChartForm();
    
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.chartForm.reset();
    this.DeleteAll();
    this.columnDataFromInput = this.groupByColumnNames(
      this.displayedColumnsInput.ResultList
    );
    console.log('INPUTColumns', this.columnDataFromInput);
    this.checkChangeInXY();
    if(this.graphData){
      console.log("Graph Details",this.graphData)
      console.log("XDateGroup",this.graphData.XDateGroup)
      console.log("YDateGroup",this.graphData.GraphDetails.YDateGroup)
      // alert(this.graphData)
      // this.graphDataFromInput();
    }
  }
  graphDataFromInput(){
    setTimeout(() => {
      console.log('edit changes Graph',this.graphData)
    this.graphData.forEach((res: any) => {
     this.getChartValues(res.GraphDetails);
     this.isEditClicked= true;
    });
    }, 500);
  }
  ngAfterViewInit(): void {
    // this.isTabActive = true; // Set isTabActive to true when the tab's view is initialized
  }
  checkChangeInXY() {
    this.xAxisColumnControl = this.chartForm.get('xAxisColumn') as FormControl;
    this.xAxisColumnSubscription =
      this.xAxisColumnControl.valueChanges.subscribe((newValue: any) => {
        this.onXAxisColumnChange(newValue);
      });
    this.yAxisColumnControl = this.chartForm.get('yAxisColumn') as FormControl;
    this.yAxisColumnSubscription =
      this.yAxisColumnControl.valueChanges.subscribe((newValue: any) => {
        this.onYAxisColumnChange(newValue);
      });
  }
  onXAxisColumnChange(newValue: any) {
    if (Array.isArray(newValue.value) && newValue.value.length > 0) {
      const firstValue = newValue.value[0];
      const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
      const dateRegex1 = /^\d{2}-\d{2}-\d{4}$/; 
      const dateRegex2 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;


      if (dateRegex.test(firstValue)|| dateRegex1.test(firstValue) || dateRegex2.test(firstValue)) {
        this.showDateXaxis = false;
      } else {
        this.showDateXaxis = true;
        this.chartForm.patchValue({ xDateGroup: '' });
      }
    }
    console.log('New Y-Axis Column Value:', newValue);
  }
  
  onYAxisColumnChange(newValue: any) {
    if (Array.isArray(newValue.value) && newValue.value.length > 0) {
      const firstValue = newValue.value[0];
      const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
      const dateRegex1 = /^\d{2}-\d{2}-\d{4}$/;
      const dateRegex2 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
      if (dateRegex.test(firstValue)|| dateRegex1.test(firstValue) || dateRegex2.test(firstValue)) {
        this.showDateYaxis = false;
      } else {
        this.showDateYaxis = true;
        this.chartForm.patchValue({ yDateGroup: '' });
      }
    }
    console.log('New Y-Axis Column Value:', newValue);
  }
  
  createChartForm() {
    this.chartForm = this.formBuilder.group({
      xAxisColumn: ['', Validators.required], // Marked as required
      yAxisColumn: [''], // Marked as required
      selectedChart: ['', Validators.required], // Marked as required
      aggregateFunction: ['', Validators.required], // Marked as required
      xGroupBy: ['', Validators.required], // Marked as required
      xDateGroup: [''], // Not marked as required initially
      yDateGroup: [''], // Not marked as required initially
    });
  }  
 
  onSubmit() {  
    console.log("CHART FORM",this.chartForm.value);
     
    let requestBody = {           
      table_query: this.displayedColumnsInput.Query,
      x_axis_column: this.chartForm.value.xAxisColumn.key,
      y_axis_column: (this.chartForm.value.yAxisColumn ==  null)?this.chartForm.value.xAxisColumn.key:this.chartForm.value.yAxisColumn?.key,
      // y_axis_column: this.chartForm.value.yAxisColumn.key || this.chartForm.value.xAxisColumn.key,
      caluculationType: this.chartForm.value.aggregateFunction,
      yGroupBy: this.chartForm.value.xGroupBy=='group by'?'':this.chartForm.value.xGroupBy,
      XDateGroup: this.chartForm.value.xDateGroup,
      YDateGroup: this.chartForm.value.yDateGroup || "",
      isXDate: !this.showDateXaxis,
      isYDate: !this.showDateYaxis,
      ChartType:this.chartForm.value.selectedChart,
    };
    // this.chartDetailsArray.push(requestBody);    
    console.log('chartDetailsData is',this.chartDetailsArray);
    console.log('REQUESTBODY', requestBody);
    this.getChartValues(requestBody);    
  }
  // enableDropdowns(): void {
  //   this.chartForm.enable();
  // }
  getChartValues(requestBody: any) {
    const graphSpinner = this.commonService.start('Getting Graph');
    try{
      this.service.getChartData(requestBody).subscribe((res: any) => {
        
        console.log("THIS>",requestBody);
        this.MultipleCharts.push(res);
        
        const chartId = `Chart${this.MultipleCharts.length - 1}`; // Generate dynamic chart ID
        this.chartDetailsArray.push(requestBody);
        if(this.graphData){
          setTimeout(() => {
            
            this.chartsService.createChart(res, chartId,requestBody.ChartType);
            this.commonService.stop(graphSpinner);
          }, 600);
          console.log("Multi", this.MultipleCharts);
        }else{
          setTimeout(() => {
            this.chartsService.createChart(res, chartId,this.chartForm.value.selectedChart);
            this.commonService.stop(graphSpinner);
          }, 600);
          console.log("Multi", this.MultipleCharts);
        }
        
      }, (error) => {
        // console.log("EERRORRRRR",error.error.message);
        this.snackBar.open("Error occurred: " + error.error.message, 'Dismiss', {
          duration: 3000, 
        });
        
      }).add(() => {
        // This code will run whether the request is successful or not
        // this.commonService.stop(graphSpinner);
      });
    } catch(error){
      this.commonService.stop(graphSpinner);
    }
  }
  //Extracting Columns from Given Input Data
  groupByColumnNames(data: any[]) {
   
    const result: { key: string; value: any[] }[] = [];

    data.forEach((person) => {
      for (const key in person) {
        const existingIndex = result.findIndex((item) => item.key === key);
        if (existingIndex !== -1) {
          result[existingIndex].value.push(person[key]);
        } else {
          result.push({ key, value: [person[key]] });
        }
      }
    });

    return result;
  }


  deleteChart(index: number) {
    if (index >= 0 && index < this.MultipleCharts.length) {
      this.MultipleCharts.splice(index, 1); // Remove the chart data from the array
      const chartId = `Chart${index}`;
      const canvas = document.getElementById(chartId) as HTMLCanvasElement;
      if (canvas) {
        canvas.remove(); // Remove the canvas element from the DOM
      }
      this.chart = null; // Remove reference to the deleted chart
    }
    this.chartDetailsArray.splice(index, 1);
  }
  saveChart(index: number){
    this.chartDetailsArray2 = [];
    let chartDetails = this.chartDetailsArray[index];
    this.chartDetailsArray2.push(chartDetails);
    this.service.saveChartData(this.chartDetailsArray2).subscribe(
      (res: any) => {
        const responsemsg = res; // Assuming the API response contains the message
        console.log('chartData', chartDetails);    
        this.snackBar.open(responsemsg.message, 'Close', {
          duration: 3000, // Snackbar display duration in milliseconds
        });
        //this.deleteChart(index);
      },
      (error: any) => {
        console.error('Error:', error);
        const errorMessage = 'An error occurred'; // Default error message
        this.snackBar.open(errorMessage, 'Close', {
          duration: 3000, // Snackbar display duration in milliseconds
        });
      }
    );    
  }
  SaveAll(){
    console.log('saveAll api');
    console.log("this.chartDetailsArray",this.chartDetailsArray);
    
    this.service.saveChartData(this.chartDetailsArray).subscribe(
      (res: any) => {
        const responsemsg = res; // Assuming the API response contains the message
        console.log('chartData', this.chartDetailsArray);
    
        this.snackBar.open(responsemsg.message, 'Close', {
          duration: 3000, // Snackbar display duration in milliseconds
        });
        if(res.message != 'Please Save the Report before Saving the Graph...!'){
        this.chartForm.reset()
       this.DeleteAll();
        }
       console.log("RES",res);
       
      },
      (error: any) => {
        console.error('Error:', error);
        const errorMessage = 'An error occurred'; // Default error message
        this.snackBar.open(errorMessage, 'Close', {
          duration: 3000, // Snackbar display duration in milliseconds
        });
      }
    );    

  }
  DeleteAll(){
    console.log('deleteAll api');
    for (let i = this.MultipleCharts.length - 1; i >= 0; i--) {
      this.MultipleCharts.splice(i, 1); // Remove the chart data from the array
      const chartId = `Chart${i}`;
      const canvas = document.getElementById(chartId) as HTMLCanvasElement;
      if (canvas) {
        canvas.remove(); // Remove the canvas element from the DOM
      }
      this.chartDetailsArray.splice(i, 1);
      this.chart = null; // Remove reference to the deleted chart
    }
    this.chartForm.reset()
  } 
  previewChart(index: any,isEditMode:boolean) {
    console.log("this.chartDetailsArray",this.chartDetailsArray);
    console.log("this.MultipleCharts",this.MultipleCharts);
    
    const dialogRef = this.dialog.open(ChartDialogComponent, {
      data: {
        chartData: this.chartDetailsArray[index],
        chartType: this.chartForm.value.selectedChart,
        chartsArray: this.MultipleCharts[index],
        chartForm: this.chartForm,
        resultData: this.displayedColumnsInput.ResultList,
        IndexPosition: index,
        isEdit:isEditMode
      },
      width: isEditMode?'110%':'80%', // Adjust as needed
      height: isEditMode?'95%':'70%', // Adjust as needed
    });
    
    dialogRef.afterClosed().subscribe((dataFromDialog: any) => {
      if (dataFromDialog) {
        console.log("Data received from dialog:", dataFromDialog);
        let res = dataFromDialog.chartResponse;
        let indexRep = dataFromDialog.index;
        let chartType = dataFromDialog?.payload?.ChartType;
        this.destroyChart(indexRep);
        this.chartDetailsArray[indexRep] = dataFromDialog.payload;
        this.MultipleCharts[indexRep] = res;
        const chartId = `Chart${indexRep}`;
        setTimeout(() => {
          this.chartsService.createChart(res, chartId, chartType);
        }, 500);
        console.log("Multi", this.MultipleCharts);
      }
    });
  }
  destroyChart(index: number) {
    if (index >= 0 && index < this.MultipleCharts.length) {
      const chartId = `Chart${index}`;
      const canvas = document.getElementById(chartId) as HTMLCanvasElement;
      if (canvas) {
        canvas.remove(); 
      }
      if (this.chartInstances[chartId]) {
        this.chartInstances[chartId].destroy();
        delete this.chartInstances[chartId];
      }
    }
  }
  
  switchToTab(newTab: number){
    this.tabEvent.emit(newTab)
  } 
}
