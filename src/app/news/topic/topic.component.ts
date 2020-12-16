import {Component, Input, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';
import {Topic} from '../../models/topic.model';
import {PanelComponent} from '../panel/panel.component';
import {SwiperComponent} from 'angular2-useful-swiper';
import {AuthService} from '../../auth/auth.service';
import {NewsFeedService} from '../feed.service';
import {ReactionService} from '../../reaction/reaction.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-news-topic',
  templateUrl: './topic.component.html',
  animations: [
    trigger('heart', [
      state('liked', style({
        transform: 'scale(0)',
        opacity: 1,
      })),
      transition('* => liked', [
        animate('1200ms ease-in-out', keyframes([
          style({transform: 'scale(0)', opacity: 1, offset: 0}),
          style({transform: 'scale(7)', opacity: 1, offset: .2}),
          style({transform: 'scale(6)', opacity: 1, offset: .4}),
          style({transform: 'scale(6)', opacity: 1, offset: .8}),
          style({transform: 'scale(6)', opacity: 0, offset: 1}),
        ]))
      ])
    ])
  ]
})
export class TopicComponent {

  @Input() topic: Topic;

  @ViewChild('swiperComp', {static: false}) swiperComponent: SwiperComponent;
  @ViewChildren(PanelComponent) newsPanel: QueryList<PanelComponent>;

  currentSlide: number = 1;
  heartState: string = 'notLiked';
  showRewind = true;
  config = {
    pagination: '.swiper-pagination',
    spaceBetween: 0,
    initialSlide: 1,
    nested: true,
    on: {
      slideChange: () => this.slideChanged(),
    }
  };

  constructor(
    public authService: AuthService,
    public feedService: NewsFeedService,
    public reactionService: ReactionService,
    private socialSharing: SocialSharing,
  ) { }

  startViewing() {
    this.startPanel(this.currentSlide);
  }

  stopViewing() {
    this.stopPanel(0);
    this.stopPanel(1);
    this.stopPanel(2);
  }

  slideChanged() {
    if (this.swiperComponent.swiper) {
      const newSlide = this.swiperComponent.swiper.activeIndex;
      this.startPanel(newSlide);
      this.stopPanel(this.currentSlide);
      this.currentSlide = newSlide;
    }
  }

  startPanel(panelIndex: number) {
    this.newsPanel.find((_, index) => index === panelIndex).startViewing();
    this.showRewind = (panelIndex === 1) || (panelIndex === 0 && !!this.topic.leftPanel.video)
                      || (panelIndex === 2 && !!this.topic.rightPanel.video);
  }

  stopPanel(panelIndex: number) {
    this.newsPanel.find((_, index) => index === panelIndex).stopViewing();
  }

  like() {
    this.authService.onAuthenticated(true).then(() => {
      if (this.topic.hasLiked) {
        this.feedService.unlike(this.topic);
      } else {
        this.feedService.like(this.topic);
      }
      this.topic.hasLiked = !this.topic.hasLiked;
      this.heartState = this.topic.hasLiked ? 'liked' : 'notLiked';
    });
  }

  share() {
    this.socialSharing.shareWithOptions({
      message: 'I saw this very cool news on Clapback today !',
      subject: 'Look at this news !',
      url: 'https://clapbacktheapp.com',
    });
  }

  rewind() {
    this.newsPanel.find((_, index) => index === this.currentSlide).rewind();
  }
}
