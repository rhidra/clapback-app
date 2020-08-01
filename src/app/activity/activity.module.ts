import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivityRoutingModule } from './activity-routing.module';
import {ActivitySearchComponent} from "./search/search.component";
import {IonicModule} from "@ionic/angular";
import {UtilsModule} from "../utils/utils.module";


@NgModule({
  declarations: [
      ActivitySearchComponent,
  ],
  imports: [
    CommonModule,
    ActivityRoutingModule,
    IonicModule,
    UtilsModule,
  ]
})
export class ActivityModule { }
