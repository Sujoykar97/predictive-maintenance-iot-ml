import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { HttpClient } from "@angular/common/http";


@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {
  data = [{key: "2020-05-28T05:40:00.000Z", max: 97, value: 92},
{key: "2020-05-28T06:45:00.000Z", max: 97, value: 73},
{key: "2020-05-28T06:50:00.000Z", max: 97, value: 64.4},
{key: "2020-05-28T06:55:00.000Z", max: 97, value: 64.4},
{key: "2020-05-28T07:00:00.000Z", max: 97, value: 64.4},
{key: "2020-05-28T07:05:00.000Z", max: 97, value: 64.4},
{key: "2020-05-28T07:10:00.000Z", max: 97, value: 64.4},
{key: "2020-05-28T07:15:00.000Z", max: 97, value: 64.4},
{key: "2020-05-28T07:20:00.000Z", max: 97, value: 64.4},
{key: "2020-05-28T07:25:00.000Z", max: 97, value: 64.4},
{key: "2020-05-28T07:30:00.000Z", max: 97, value: 64.4}]

    series_data:any = [];
     data1= [];
     data2 = []
     labels=[]

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    
    console.log(this.data1)
    for (let index = 0; index < this.data.length; index++) {
      const element = this.data[index];
      let temp = (new Date((this.data[index]['key'])));
      this.labels.push(temp.getHours()+":"+temp.getMinutes())
      console.log(this.data[index]['key'] + " " + this.data[index]['value'] + " "+  this.data[index]['max']) 
      this.data1.push({'x':this.data[index]['key'], 'y': this.data[index]['value']})
      this.data2.push({'x':this.data[index]['key'], 'y': this.data[index]['max']})
      
    }
    console.log(this.data1)
    console.log("data1 ="+this.data1)
      console.log("data2 ="+this.data2)
    this.httpClient.get("./../../assets/seriesData.json").subscribe(data =>{
      
      this.series_data = data;
      console.log(this.series_data.length);
      console.log(this.series_data)})
      
    

  }
lineChartOptions: {

    
   }


  lineChartData: ChartDataSets[] = [
    { data: this.data1, 
    label: 'Percentage',
    borderWidth: 2,
    lineTension: 0,
    pointBackgroundColor: '#7cb5ec'
    },
    { data: this.data2,
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: 'transparent',
    pointRadius: 0
    },
    
  ];
  
  
  lineChartLabels: Label[] = this.labels;

  

  lineChartColors: Color[] = [
    {
      borderColor: '#7cb5ec',

      backgroundColor: 'transparent',
    },
  ];

  // lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';
 
}
  

