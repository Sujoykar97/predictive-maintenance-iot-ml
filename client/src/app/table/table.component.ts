import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  testData = [];
  trainData : string [];

  constructor(
    private _dataService: DataService,
    private httpClient: HttpClient
    ) { }

  ngOnInit(): void {
    this.httpClient.get("../assets/dataset.json").subscribe(result =>{
      
      this.trainData = result as string[];
      console.log(this.trainData)}
      )
      

    this._dataService.getTestData()
    .subscribe(data => {this.testData=data
      console.log(this.testData)
    }
      );

    
  }

}
