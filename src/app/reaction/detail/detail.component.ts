import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ReactionService} from '../reaction.service';
import {Reaction} from '../../models/reaction.model';
import {environment as env} from '../../../environments/environment';
import {VgAPI} from 'videogular2/compiled/src/core/services/vg-api';
import {AuthService} from '../../auth/auth.service';
import {CommentService} from '../comment.service';
import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';
import {User} from '../../models/user.model';

declare var Hls;

@Component({
  selector: 'app-reaction-detail',
  templateUrl: './detail.component.html',
  animations: [
    trigger('heart', [
      state('liked', style({
        transform: 'scale(0)',
        opacity: 1,
      })),
      transition('* => liked', [
        animate('1200ms ease-in-out', keyframes([
          style({transform: 'scale(0%)', opacity: 1, offset: 0}),
          style({transform: 'scale(7)', opacity: 1, offset: .2}),
          style({transform: 'scale(6)', opacity: 1, offset: .4}),
          style({transform: 'scale(6)', opacity: 1, offset: .8}),
          style({transform: 'scale(6)', opacity: 0, offset: 1}),
        ]))
      ])
    ])
  ]
})
export class ReactDetailComponent implements OnInit, AfterViewInit {

  @ViewChild('media', {static: false}) video: any;
  hls: any;

  isLoading: boolean = true;
  isLoadingComments: boolean = true;
  reaction: Reaction;
  videoPlayer: VgAPI;
  host = env.mediaHost;
  comment: string;
  canEdit: boolean = false;
  heartState: string = 'notLiked';

  constructor(
    public activatedRoute: ActivatedRoute,
    public reactionService: ReactionService,
    public authService: AuthService,
    public commentService: CommentService,
  ) { }

  ngOnInit() {}

  ngAfterViewInit() {
    this.activatedRoute.params.subscribe(params => {
      const id = params.id;
      if (id) {
        this.authService.getToken()
          .then(token => this.reactionService.get(id))
          .then(reaction => this.reaction = reaction)
          .then(() => this.isLoading = false)
          .then(() => this.loadVideo())
          .then(() => this.commentService.searchByReaction(id))
          .then(() => this.isLoadingComments = false)
          .then(() => this.authService.onAuthenticated())
          .then(() => this.canEdit = this.authService.user._id === (this.reaction.user as User)._id)
          .catch(() => {});
      }
    });
  }

  loadVideo() {
    if (Hls.isSupported() && this.video) {
      this.hls = new Hls();
      this.hls.attachMedia(this.video.nativeElement);
      this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        this.hls.loadSource(this.host + this.reaction.video);
      });
      this.hls.on(Hls.Events.ERROR, function (event, data) {
        console.error('event', event);
        console.error('data', data);
      });
    } else if (!Hls.isSupported()) {
      console.error('Hls is not supported !');
    }
  }

  onPlayerReady(api: VgAPI) {
    this.videoPlayer = api;
    this.videoPlayer.play();
  }

  like() {
    this.authService.onAuthenticated(true).then(() => {
      if (this.reaction.hasLiked) {
        this.reactionService.unlike(this.reaction);
      } else {
        this.reactionService.like(this.reaction);
      }
      this.reaction.hasLiked = !this.reaction.hasLiked;
      this.heartState = this.reaction.hasLiked ? 'liked' : 'notLiked';
    });
  }

  rewind() {
    if (this.videoPlayer) {
      this.videoPlayer.seekTime(this.videoPlayer.currentTime - 5);
      this.videoPlayer.play();
    }
  }
}
