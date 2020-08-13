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
  ],
  imports: [
    CommonModule,
    UtilsRoutingModule,
    IonicModule,
    FormsModule
  ],
})
export class UtilsModule { }
