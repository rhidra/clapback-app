import {AfterViewInit, Component, HostListener, Input, NgZone, OnInit, ViewChild} from '@angular/core';
import {VgAPI} from 'videogular2/compiled/src/core/services/vg-api';
import {TopicPanel} from '../../models/topic.model';
import {QuizService} from '../quiz.service';
import {Quiz} from '../../models/quiz.model';
import {AuthService} from '../../auth/auth.service';
import {MediaUrlPipe} from "../../utils/pipes/media-url.pipe";

declare var Hls;

@Component({
  selector: 'app-news-panel',
  templateUrl: './panel.component.html',
})
export class PanelComponent implements OnInit, AfterViewInit {
  
  _panel: TopicPanel;
  @Input()
  set panel(p: TopicPanel) {
    this.type = p.quiz ? 'quiz' : p.text ? 'text' : 'video';
    this._panel = p;
    if (this.type === 'quiz') {
      this.loadQuiz();
    }
  }
  get panel(): TopicPanel { return this._panel; }

  @ViewChild('media', {static: false}) video: any;
  hls: any;

  type: string;
  tappingText: boolean = false;
  videoPlayer: VgAPI = null;
  quiz: Quiz;
  quizChoice: string;
  isActive = false;
  isLoading = false;
  maxCount = 0;

  constructor(
    private quizService: QuizService,
    private authService: AuthService,
    private ngZone: NgZone,
    private mediaUrl: MediaUrlPipe,
  ) { }

  ngOnInit() {}

  ngAfterViewInit() {
    if (Hls.isSupported() && this.type === 'video' && this.video) {
      this.hls = new Hls();
      this.hls.attachMedia(this.video.nativeElement);
      this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        this.hls.loadSource(this.mediaUrl.transform(this.panel.video, 'video'));
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
    this.videoPlayer.pause();
  }

  startViewing() {
    this.isActive = true;
    if (this.videoPlayer) {
      this.videoPlayer.play();
    }
  }

  rewind() {
    if (this.videoPlayer) {
      this.videoPlayer.seekTime(this.videoPlayer.currentTime - 5);
      this.videoPlayer.play();
    }
  }

  stopViewing() {
    this.isActive = false;
    if (this.videoPlayer) {
      this.videoPlayer.pause();
    }
  }

  @HostListener('document:touchstart', ['$event'])
  startTappingText(event) {
    if (this.isActive && this.type === 'text') {
      this.ngZone.run(() => this.tappingText = true);
    }
  }

  @HostListener('document:touchend', ['$event'])
  stopTappingText(event) {
    if (this.isActive && this.type === 'text') {
      this.ngZone.run(() => this.tappingText = false);
    }
  }

  loadQuiz() {
    this.isLoading = true;
    this.quizService.get(this.panel.quiz)
      .then(quiz => {
        this.quiz = quiz;
        this.isLoading = false;
        return this.authService.onAuthenticated();
      })
      .then(() => this.quizService.getVote(this.panel.quiz))
      .then(quizChoice => this.quizChoice = quizChoice)
      .then(() => this.quizChoice && this.quiz.isPoll ? this.quizService.getResults(this.panel.quiz) : null)
      .then(results => this.setResults(results))
      .catch(() => {});
  }

  vote(choiceId: string) {
    this.authService.onAuthenticated(true)
      .then(() => this.quizChoice = choiceId)
      .then(() => this.quizService.vote(this.quiz, choiceId))
      .then(() => this.quiz.isPoll ? this.quizService.getResults(this.quiz._id) : null)
      .then(results => this.setResults(results));
  }

  setResults(results: Array<any>) {
    if (results) {
      this.quiz.choices.forEach(choice => choice.count = results.find(r => r.choice === choice._id).count);
      this.maxCount = results.reduce((a, b) => a + b.count, 0);
    }
  }
}
