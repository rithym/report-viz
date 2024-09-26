import { Injectable } from '@angular/core';
import { Chart } from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class ChartsService {
  public chart:any;
  constructor() { }

  createChart(res: any, chartId: string,chartType:any) {
    console.log('RREESS', res);
    const keys = Object.keys(res).filter((key) => key !== 'xAxisData');
    const backgroundColor = [
      'rgb(144, 36, 109)',
      'rgb(74, 49, 145)',
      'rgb(110, 171, 221)',
      'rgb(155, 72, 119)',
      'rgb(115, 68, 153)',
    ];
  const borderColor = backgroundColor.slice(); // Copy the array to avoid modifying the original
    const datasets = keys.map((key, index) => {
      return {
        label: key,
        data: res[key],
        backgroundColor: backgroundColor[index % backgroundColor.length], // Use modulo to cycle through colors
        borderColor: borderColor[index % borderColor.length], // Use modulo to cycle through colors
      };
    });

    const canvas = document.getElementById(chartId) as HTMLCanvasElement;
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
          }
      }
      },
    });
    
  }
}
