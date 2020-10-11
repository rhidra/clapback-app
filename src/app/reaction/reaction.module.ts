import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactionRoutingModule } from './reaction-routing.module';
import {IonicModule} from '@ionic/angular';
import {ReactVideoEditComponent} from './video-edit/video-edit.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ReactSearchComponent} from './search/search.component';
import {ReactDetailComponent} from './detail/detail.component';
import {VgCoreModule} from 'videogular2/compiled/src/core/core';
import {VgControlsModule} from 'videogular2/compiled/src/controls/controls';
import {VgBufferingModule} from 'videogular2/compiled/src/buffering/buffering';
import {ReactCommentComponent} from './comment/comment.component';
import {ReactAddCommentComponent} from './add-comment/add-comment.component';
import {UtilsModule} from '../utils/utils.module';
import {Nl2BrPipeModule} from 'nl2br-pipe';
import {MediaUrlPipe} from "../utils/pipes/media-url.pipe";
import {ReactCommentListComponent} from "./comment-list/comment-list.component";
import {ReactCameraComponent} from "./camera/camera.component";
import {CameraPreview} from '@ionic-native/camera-preview/ngx';


@NgModule({
  declarations: [
    ReactVideoEditComponent,
    ReactSearchComponent,
    ReactDetailComponent,
    ReactCommentComponent,
    ReactAddCommentComponent,
    ReactCommentListComponent,
    ReactCameraComponent,
  ],
  imports: [
    CommonModule,
    ReactionRoutingModule,
    IonicModule,
    ReactiveFormsModule,
    VgCoreModule,
    VgControlsModule,
    VgBufferingModule,
    FormsModule,
    UtilsModule,
    Nl2BrPipeModule
  ],
  providers: [
    MediaUrlPipe,
    CameraPreview,
  ],
})
export class ReactionModule { }
