import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import {LoginEmailComponent} from './login-email/login.component';
import {IonicModule} from '@ionic/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UtilsModule} from '../utils/utils.module';


@NgModule({
  declarations: [
    LoginEmailComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    UtilsModule,
  ],
})
export class AuthModule { }
