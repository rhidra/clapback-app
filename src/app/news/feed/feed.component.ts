import {Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {NewsFeedService} from '../feed.service';
import {IonSlides, MenuController} from '@ionic/angular';
import {TopicComponent} from '../topic/topic.component';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-news-feed',
  templateUrl: './feed.component.html',
})
export class NewsFeedComponent implements OnInit {

  @ViewChild('slides', {static: false}) slides: IonSlides;
  @ViewChildren(TopicComponent) topicComponents: QueryList<TopicComponent>;

  isLoading: boolean = true;
  noConnection: boolean = false;

  slidesOpt = {
    direction: 'vertical',
    slidesPerView: 1,
  };

  constructor(
      public feedService: NewsFeedService,
      private authService: AuthService,
      private menuCtrl: MenuController,
  ) { }

  async ngOnInit() {
    this.isLoading = true;
    await this.authService.getToken();
    try {
      await this.feedService.loadMore();
      this.isLoading = false;
      this.noConnection = false;
      setTimeout(() => {
        const topics = this.topicComponents.toArray();
        if (topics[0]) {
          topics[0].startViewing();
        }
      });
    } catch (err) {
      this.isLoading = false;
      this.noConnection = true;
    }
  }

  ionViewDidEnter() {
    if (this.slides) {
      const topics = this.topicComponents.toArray();
      this.slides.getActiveIndex().then(slideIndex => topics[slideIndex].startViewing());
    }
  }

  ionViewWillLeave() {
    const topics = this.topicComponents.toArray();
    this.slides.getActiveIndex().then(slideIndex => topics[slideIndex].stopViewing());
  }

  async slideChanged(event) {
    const topics = this.topicComponents.toArray();
    const idxActive = await this.slides.getActiveIndex();
    topics[idxActive].startViewing();
    const idxPrev = await this.slides.getPreviousIndex();
    topics[idxPrev].stopViewing();

    if (idxActive >= this.feedService.topics.length - 5) {
      await this.feedService.loadMore();
    }
  }

  async menuClick() {
    await this.authService.onAuthenticated(true);
    await this.menuCtrl.toggle();
  }
}
