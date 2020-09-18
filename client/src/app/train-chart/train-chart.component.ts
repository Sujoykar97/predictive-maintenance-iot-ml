import { Component, OnInit } from '@angular/core';
import * as CanvasJS from './../../assets/canvasjs.min';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-train-chart',
  templateUrl: './train-chart.component.html',
  styleUrls: ['./train-chart.component.scss']
})
export class TrainChartComponent implements OnInit {

  train_data:any = []
  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {

    this.httpClient.get("./../../assets/dataset.json").subscribe(data =>{
      
      this.train_data = data;
      console.log(this.train_data.length);
      console.log(this.train_data)

      let dataPoints = [];
	
	for ( var i = 0; i < this.train_data.length; i++ ) {		  	
		dataPoints.push({x: +this.train_data[i]['Current'], y: +this.train_data[i]['Power']});
  }
  console.log(dataPoints)
	let chart = new CanvasJS.Chart("chartContainer", {
		zoomEnabled: true,
		animationEnabled: true,
		exportEnabled: true,
		title: {
			text: "Performance Graph - Power vs Current"
		},
		subtitles:[{
			text: "Try Zooming and Panning"
		}],
		data: [
		{
      axisXType: "secondary",
			type: "line",                
			dataPoints: dataPoints
		}]
	});
		
  chart.render();
  
    });
    
  }

}
