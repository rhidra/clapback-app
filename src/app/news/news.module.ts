import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewsRoutingModule } from './news-routing.module';
import {IonicModule} from '@ionic/angular';
import {NewsFeedComponent} from './feed/feed.component';
import {PanelComponent} from './panel/panel.component';
import {Angular2UsefulSwiperModule} from 'angular2-useful-swiper';
import {VgBufferingModule} from 'videogular2/compiled/src/buffering/buffering';
import {VgOverlayPlayModule} from 'videogular2/compiled/src/overlay-play/overlay-play';
import {VgControlsModule} from 'videogular2/compiled/src/controls/controls';
import {VgCoreModule} from 'videogular2/compiled/src/core/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {TopicComponent} from './topic/topic.component';
import {NewsFeedService} from './feed.service';
import {QuizService} from './quiz.service';


@NgModule({
  declarations: [
    NewsFeedComponent,
    PanelComponent,
    TopicComponent,
  ],
  imports: [
    CommonModule,
    NewsRoutingModule,
    IonicModule,
    Angular2UsefulSwiperModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    FontAwesomeModule,
  ],
  providers: [
    NewsFeedService,
    QuizService,
  ]
})
export class NewsModule { }
