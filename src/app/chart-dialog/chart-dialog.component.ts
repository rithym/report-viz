import { Component, Inject, OnInit, SimpleChanges } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Chart } from 'chart.js';
import { ReportService } from '../reportService/report.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ChartsService } from '../reportService/charts.service';

@Component({
  selector: 'app-chart-dialog',
  templateUrl: './chart-dialog.component.html',
  styleUrls: ['./chart-dialog.component.scss'],
})
export class ChartDialogComponent implements OnInit {
  chartForm!: FormGroup;
  showDateXaxis: boolean = true;
  showDateYaxis: boolean = true;
  editButtonClicked: boolean = false;
  xAxisColumnControl!: any;
  xAxisColumnSubscription!: any;
  yAxisColumnControl!: any;
  yAxisColumnSubscription!: any;
  public chart: any;
  public chartsTypes: any = ['bar', 'doughnut', 'line', 'scatter'];
  columnDataFromInput: any[] = [];
  dataTypes: any[] = [
    { aggFn: 'count', value: 'count' },
    { aggFn: 'sum', value: 'sum' },
    { aggFn: 'minimum', value: 'min' },
    { aggFn: 'maximum', value: 'max' },
    { aggFn: 'average', value: 'avg' },
  ];
  public groupList: any = ['none', 'group by'];
  public dateFormats: any = [
    { formate: 'Month', value: 'MM' },
    { formate: 'Month and Year', value: 'MY' },
  ];
  public chartResp: any;
  public onEditrequestBody: any;
  public editMode!: boolean;
  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public service: ReportService,
    public dialogRef: MatDialogRef<ChartDialogComponent>,
    public chartsService: ChartsService
  ) {}
  ngOnInit(): void {
    this.createChartForm();
    this.checkChangeInXY();
  }
  ngAfterViewInit() {
    this.editMode = this.data.isEdit;
    console.log("DATAAA", this.data);
    
    setTimeout(() => {
      const chartData = this.data.chartData;
      this.columnDataFromInput = this.groupByColumnNames(this.data.resultData);
      console.log('ALERT', this.columnDataFromInput);
      this.getChartValues(chartData);
      this.patchValue(chartData);
    }, 800);
  }
  patchValue(chartData: any) {
    if(chartData.XDateGroup){
      this.showDateXaxis = false
    }
    if(chartData.YDateGroup){
      this.showDateYaxis = false
    }
    let xColumn: any = this.columnDataFromInput.find((res: any) => {
      return res.key === chartData.x_axis_column;
    });
    let yColumn: any = this.columnDataFromInput.find((res: any) => {
      return res.key === chartData.y_axis_column;
    });
    console.log('PATCH chartData-->', chartData);

    this.chartForm.patchValue({
      xAxisColumn: xColumn,
      yAxisColumn: yColumn,
      selectedChart: chartData.ChartType,
      aggregateFunction: chartData.caluculationType,
      xGroupBy: chartData.yGroupBy == '' ? 'group by' : chartData.yGroupBy,
      xDateGroup: chartData.XDateGroup,
      yDateGroup: chartData.YDateGroup,
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && !changes['data'].firstChange) {
      const chartData = this.data.chartData;
      this.getChartValues(chartData);
    }
    this.checkChangeInXY();
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
  closeDialog() {
    this.dialogRef.close();
  }
  onSaveDataAndClose() {
    let result: any = {
      index: this.data.IndexPosition,
      chartResponse: this.chartResp,
      payload: this.onEditrequestBody,
    };
    this.dialogRef.close(result);
  }
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
  getChartValues(requestBody: any) {
    console.log('dialog requestbody', requestBody);
    console.log('index position is', this.data.IndexPosition);
    this.service.getChartData(requestBody).subscribe((res: any) => {
      if (this.chart) {
        this.chart.destroy();
        this.chart = null;
      }
      this.chartResp = res;
      this.createChart(res, this.data.IndexPosition, requestBody?.ChartType);
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
      xAxisColumn: [''],
      yAxisColumn: [''],
      selectedChart: [''],
      aggregateFunction: [''],
      xGroupBy: [''],
      xDateGroup: [''],
      yDateGroup: [''],
    });
  }
  onEdit() {
    this.onEditrequestBody = {
      table_query: this.data.chartData.table_query,
      x_axis_column: this.chartForm.value.xAxisColumn.key,
      y_axis_column: this.chartForm.value.yAxisColumn.key,
      caluculationType: this.chartForm.value.aggregateFunction,
      yGroupBy:
        this.chartForm.value.xGroupBy == 'group by'
          ? ''
          : this.chartForm.value.xGroupBy,
      XDateGroup: this.chartForm.value.xDateGroup,
      YDateGroup: this.chartForm.value.yDateGroup,
      isXDate: !this.showDateXaxis,
      isYDate: !this.showDateYaxis,
      ChartType: this.chartForm.value.selectedChart,
    };
    this.getChartValues(this.onEditrequestBody);
    this.editButtonClicked = true;
  }

  createChart(res: any, chartId: any, chartType: any) {
    console.log('dialog res', res);
    console.log('RREESS', res);
    const keys = Object.keys(res).filter((key) => key !== 'xAxisData');
    const datasets = keys.map((key, index) => {
      const backgroundColor = [
        'rgb(144, 36, 109)',
        'rgb(74, 49, 145)',
        'rgb(110, 171, 221)',
        'rgb(155, 72, 119)',
        'rgb(115, 68, 153)',
      ];
      const borderColor = backgroundColor.slice();
      return {
        label: key,
        data: res[key],
        backgroundColor: backgroundColor[index % backgroundColor.length], // Use modulo to cycle through colors
        borderColor: borderColor[index % borderColor.length],
      };
    });
    chartId = `Chart${this.data.chartsArray.length - 1}`;
    const canvas = document.getElementById('chartCanvas') as HTMLCanvasElement;
    console.log('canvas number is', canvas.id);
    if (!canvas) {
      console.error(`Canvas element with ID "${chartId}" not found.`);
      return;
    }

    this.chart = new Chart(canvas, {
      type: chartType,
      data: {
        labels: res.xAxisData,
        datasets,
      },
      options: {
        aspectRatio: 2.5,
        plugins: {
          legend: {
            display: false,
            // labels: {
            //     color: 'rgb(255, 99, 132)'
            // }
          },
        },
      },
    });
  }
}
