import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDetails } from './../interfaces/users'
import { ChartData } from './../interfaces/chart'

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private _urlget: string = "http://localhost:3000/api/data/get";
  private _urlpy: string = "http://localhost:3000/api/python/py";

  private _urlchart: string = "http://localhost:3000/api/data/read";

  constructor(private http: HttpClient) { }

  getUserDetails(): Observable<UserDetails[]>{
    return this.http.get<UserDetails[]>(this._urlget);
  }

  getPyResult(): Observable<string>{
    return this.http.get<string>(this._urlpy,{responseType:'text' as 'json'});
  }

  getTestData(): Observable<ChartData[]>{
    return this.http.get<ChartData[]>(this._urlchart);
  }
}
