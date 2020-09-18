import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component'
import { DatasetComponent } from './dataset/dataset.component'
import { GraphComponent } from './graph/graph.component'
import {MlResultComponent} from './ml-result/ml-result.component'

import { from } from 'rxjs';


const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: '', component: HomePageComponent },
  { path: '*', component: HomePageComponent },
  { path: 'dataset', component: DatasetComponent },
  { path: 'graphs', component: GraphComponent },
  { path: 'result', component: MlResultComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
