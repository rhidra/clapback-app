import {Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {NewsFeedService} from './feed.service';

@Component({
  selector: 'app-news-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class NewsFeedComponent implements OnInit {

  isLoading: boolean = true;
  currentItem: number;

  slidesOpt = {
    direction: 'vertical'
  };

  constructor(
      public feedService: NewsFeedService,
  ) { }

  ngOnInit() {}

  ngAfterViewInit() {
    this.feedService.load().then(() => {
      this.currentItem = 0;
      this.isLoading = false;
    });
  }
}
