import { Component, OnInit } from '@angular/core';
import { DataService } from './../services/data.service'
@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  result="";
  constructor(private _dataService: DataService) { }

  ngOnInit(): void {
    this._dataService.getPyResult()
      .subscribe(data => {
        console.log(data)
        this.result=data
      });
  }

}
