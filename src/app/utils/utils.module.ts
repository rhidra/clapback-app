import {Injectable, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { UtilsRoutingModule } from './utils-routing.module';
import {IonicModule} from '@ionic/angular';
import { BoldPipe } from './pipes/bold.pipe';
import { ItalicPipe } from './pipes/italic.pipe';
import { HashtagPipe } from './pipes/hashtag.pipe';
import {ChipInputComponent} from './chip-input/chip-input.component';
import {FormsModule} from '@angular/forms';
import {EmptyViewComponent} from './empty-view/empty-view.component';
import { MediaUploadDirective } from './media-upload/media-upload.directive';
import { DoubleTapDirective } from './double-tap/double-tap.directive';
import { MediaUrlPipe } from './pipes/media-url.pipe';
import {IntlPhoneInputComponent} from './intl-phone-input/intl-phone-input.component';
import {Ng2TelInputModule} from 'ng2-tel-input';
import { SplashComponent } from './splash/splash.component';


@NgModule({
  declarations: [
    BoldPipe,
    ItalicPipe,
    HashtagPipe,
    ChipInputComponent,
    EmptyViewComponent,
    MediaUploadDirective,
    DoubleTapDirective,
    MediaUrlPipe,
    IntlPhoneInputComponent,
    SplashComponent,
  ],
  exports: [
    BoldPipe,
    ItalicPipe,
    HashtagPipe,
    ChipInputComponent,
    EmptyViewComponent,
    MediaUploadDirective,
    DoubleTapDirective,
    MediaUrlPipe,
    IntlPhoneInputComponent,
    SplashComponent,
  ],
  imports: [
    CommonModule,
    UtilsRoutingModule,
    IonicModule,
    FormsModule,
    Ng2TelInputModule,
  ],
  entryComponents: [
    SplashComponent,
  ]
})
export class UtilsModule { }
