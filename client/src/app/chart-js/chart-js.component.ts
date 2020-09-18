import { Component, OnInit } from '@angular/core';
import {Chart} from 'chart.js';
import  'chartjs-plugin-zoom';
@Component({
  selector: 'app-chart-js',
  templateUrl: './chart-js.component.html',
  styleUrls: ['./chart-js.component.scss']
})
export class ChartJsComponent implements OnInit {

   
   canvas:any;
   ctx: any;
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

  data1= [];
  data2 = []
  labels=[]
chart;
  constructor() { }



  ngOnInit(): void {

    
    for (let index = 0; index < this.data.length; index++) {
      
      let temp = (new Date((this.data[index]['key'])));
      this.labels.push(temp.getHours()+":"+temp.getMinutes())
      console.log(this.data[index]['key'] + " " + this.data[index]['value'] + " "+  this.data[index]['max']) 
      this.data1.push({'x':this.data[index]['key'], 'y': this.data[index]['value']})
      this.data2.push({'x':this.data[index]['key'], 'y': this.data[index]['max']})
      
    }


    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');

     this.chart = new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [
          {
            data: this.data1,
            label: 'Percentage',
            borderWidth: 2,
            lineTension: 0,
            borderColor: '#7cb5ec',
            pointBackgroundColor: '#7cb5ec',
            backgroundColor: 'transparent',
          },
          { data: this.data2,
            borderWidth: 1,
            borderColor: 'gray',
            backgroundColor: 'transparent',
            pointRadius: 0
            },
        ]
      },
      options: {
        responsive: true,
        plugins: {
					zoom: {
						zoom: {
							enabled: true,
							drag: true,
              mode: 'x',
              rangeMin: {
                // Format of min zoom range depends on scale type
                x: null,
                y: null
            },
            rangeMax: {
                // Format of max zoom range depends on scale type
                x: null,
                y: null
            },
            speed: 0.1,
 
            // Minimal zoom distance required before actually applying zoom
            threshold: 2,
 
            // On category scale, minimal zoom level before actually applying zoom
            sensitivity: 3
 
						}
					}
      }}
    });
    
    
  }
  resetZoom() {
    this.chart.resetZoom();
  }
   toggleDragMode()  {
			
    var zoomOptions = this.chart.options.plugins.zoom.zoom;
    zoomOptions.drag = zoomOptions.drag ? false : {animationDuration: 1000};

    this.chart.update();
    document.getElementById('drag-switch').innerText = zoomOptions.drag ? 'Disable drag mode' : 'Enable drag mode';
  };
}
