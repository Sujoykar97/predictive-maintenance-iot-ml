import { Component, OnInit } from '@angular/core';
import * as CanvasJS from './../../assets/canvasjs.min';
import { DataService } from './../services/data.service';



@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

	dataPoints = [];
	data=[];
	
  constructor(private _dataService: DataService) { }

  ngOnInit(): void {

	this._dataService.getTestData()
      .subscribe(data => {
        this.dataPoints=data
		console.log(this.dataPoints)
		
  var i;
		let m = this.dataPoints['current'].length;
		while (m) {
			i = Math.round(Math.random() * m--);
			// let ti = this.dataPoints['current'][m];let tp =  this.dataPoints['power'][m]
			// this.dataPoints['current'][m] = this.dataPoints['current'][i]; this.dataPoints['power'][m]=this.dataPoints['power'][i]
			// this.dataPoints['current'][i] = this.dataPoints['current'][ti]; this.dataPoints['power'][i] = this.dataPoints['power'][tp]

			this.data.push({x: this.dataPoints['current'][i], y: this.dataPoints['power'][i]});
			
		}
		console.log(this.data)
	  	
		  let chart = new CanvasJS.Chart("chartContainer", {
			zoomEnabled: true,
			animationEnabled: true,
			exportEnabled: true,
			title: {
				text: "Performance Demo - 10000 DataPoints"
			},
			subtitles:[{
				text: "Try Zooming and Panning"
			}],
			data: [
			{
		  axisXType: "secondary", 
				type: "line",                
				dataPoints: this.data
			}]
		});
			
		chart.render();	  
      });
    
		  }

	  }
	  
		
	  
	  
	   
  


	  
	
    
  // for ( i = 0 ; i<29;i++ ) {		  
  //   data.push({x: this.dataPoints['current'][i], y: this.dataPoints['power'][i]});
    
  // }
  
	



