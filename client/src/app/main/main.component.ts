import { Component, OnInit } from '@angular/core';
import { DataService } from './../services/data.service'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  userDetails = [];
  constructor(private _dataService: DataService) { }

  ngOnInit(): void {

    this._dataService.getUserDetails()
      .subscribe(data => {
        console.log(data)
        this.userDetails=data
        console.log(this.userDetails)
        console.log(this.userDetails['name'])
        console.log(this.userDetails['email'])
        console.log(this.userDetails['pass'])
      
      });
  }

}
