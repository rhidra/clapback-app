import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivityRoutingModule } from './activity-routing.module';
import {ActivitySearchComponent} from "./search/search.component";
import {IonicModule} from "@ionic/angular";


@NgModule({
  declarations: [
      ActivitySearchComponent,
  ],
  imports: [
    CommonModule,
    ActivityRoutingModule,
    IonicModule
  ]
})
export class ActivityModule { }
