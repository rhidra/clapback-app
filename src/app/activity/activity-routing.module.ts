import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ActivitySearchComponent} from "./search/search.component";
import {AuthGuardService} from "../auth/auth-guard.service";


const routes: Routes = [
  { path: '', component: ActivitySearchComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivityRoutingModule { }
