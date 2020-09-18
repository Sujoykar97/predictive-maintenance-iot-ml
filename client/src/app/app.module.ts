import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import {HttpClientModule} from '@angular/common/http';
import {DataService} from './services/data.service'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { ResultComponent } from './result/result.component';
import { ChartComponent } from './chart/chart.component';
import { CommonModule } from '@angular/common';
import { TrainChartComponent } from './train-chart/train-chart.component';
import { HomeComponent } from './home/home.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LinksComponent } from './links/links.component';
import { DatasetComponent } from './dataset/dataset.component';
import { TableComponent } from './table/table.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { from } from 'rxjs';
import { GraphComponent } from './graph/graph.component';
import { MlResultComponent } from './ml-result/ml-result.component';
import { D3ChartComponent } from './d3-chart/d3-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { ChartsModule } from 'ng2-charts';
import { ChartJsComponent } from './chart-js/chart-js.component';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ResultComponent,
    ChartComponent,
    TrainChartComponent,
    HomeComponent,
    HomePageComponent,
    LinksComponent,
    DatasetComponent,
    TableComponent,
    GraphComponent,
    MlResultComponent,
    D3ChartComponent,
    LineChartComponent,
    ChartJsComponent
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AngularSvgIconModule.forRoot(),
    CommonModule,
    ChartsModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { 
}
