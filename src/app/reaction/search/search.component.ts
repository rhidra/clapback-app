import {Component, OnInit, ViewChild} from '@angular/core';
import {ReactionService} from '../reaction.service';
import {ActivatedRoute} from '@angular/router';
import {environment as env} from '../../../environments/environment';
import {CommentService} from '../comment.service';
import {Query, QueryService} from '../../utils/query.service';
import {IonSearchbar} from '@ionic/angular';

@Component({
  selector: 'app-reaction-search',
  templateUrl: './search.component.html',
})
export class ReactSearchComponent implements OnInit {

  @ViewChild('searchbar', {static: false}) searchbar: IonSearchbar;

  idTopic: string;
  titleHashtag: string;
  isLoading;
  noConnection: boolean = false;
  searchbarContent: string;
  host = env.mediaHost;

  constructor(
    private reactionService: ReactionService,
    private activatedRoute: ActivatedRoute,
    private commentService: CommentService,
    private queryService: QueryService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.idTopic = params.idTopic;
      if (this.idTopic) {
        this.commentService.searchByTopic(this.idTopic);
      }
    });
    this.activatedRoute.queryParamMap.subscribe(query => {
      const q: Query = this.queryService.parseQuery(query);
      if (q) {
        this.titleHashtag = q.hashtags[0];
        this.search(q);
      } else {
        this.reactionService.clear();
      }
    });
  }

  ionViewDidEnter() {
    if (!this.idTopic) {
      this.searchbar.setFocus();
    }
  }

  updateSearch() {
    const q = this.queryService.parseString(this.searchbarContent);
    this.search(q);
  }

  search(q: Query) {
    this.isLoading = true;
    this.reactionService.searchByQuery(q)
      .then(() => {
        this.isLoading = false;
        this.noConnection = false;
      })
      .catch(() => {
        this.isLoading = false;
        this.noConnection = true;
      });
  }
}
