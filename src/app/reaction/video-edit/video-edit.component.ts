import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Reaction} from '../../models/reaction.model';
import * as moment from 'moment';
import {AuthService} from '../../auth/auth.service';
import {NewsFeedService} from '../../news/feed.service';
import {ReactionService} from '../reaction.service';
import {LoadingController, NavController, ToastController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {File} from '@ionic-native/file/ngx';
import {Topic} from '../../models/topic.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MediaService } from 'src/app/media/media.service';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-video-edit',
  templateUrl: './video-edit.component.html',
})
export class ReactVideoEditComponent implements OnInit {

  topic: Topic;
  mediaUrl: string;
  reaction: Reaction = new Reaction();
  form: FormGroup;
  isCreation: boolean;
  isLoading = true;
  loading: any;

  constructor(
    private authService: AuthService,
    private reactionService: ReactionService,
    private navCtrl: NavController,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private feedService: NewsFeedService,
    private mediaService: MediaService,
    private loadingCtrl: LoadingController,
    private notifications: LocalNotifications,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const idTopic = params.idTopic;
      const idReaction = params.idReaction;
      if (idTopic) {
        this.isCreation = true;
        this.feedService.getTopic(idTopic)
          .then(topic => this.topic = topic)
          .then(() => this.initForm());
      } else if (idReaction) {
        this.isCreation = false;
        this.reactionService.get(idReaction)
          .then(reaction => this.reaction = reaction)
          .then(() => this.feedService.getTopic(this.reaction.topic as string))
          .then(topic => this.topic = topic)
          .then(() => this.initForm());
      }
    });
    this.mediaUrl = this.mediaService.getPendingMediaUrl();
    this.loadingCtrl.create({message: 'Please wait...'}).then(l => this.loading = l);
  }

  initForm() {
    this.form = this.fb.group({
      text: [this.reaction.text || ''],
      hashtags: [(this.isCreation ? this.topic.hashtags : this.reaction.hashtags) || [], [Validators.required]],
    });
    this.isLoading = false;
  }

  async onSubmit() {
    if (this.isCreation) {
      await this.authService.onAuthenticated(true);
      console.log('request filename');
      const filename = await this.mediaService.allocateFilename(this.mediaUrl);
      console.log('filename:', filename);
      await this.createReaction(filename);
      console.log('reaction created');
      this.mediaService.uploadVideo(filename, this.mediaUrl)
        .then(() => this.notifications.schedule({id: 1, title: 'Clapback successfully published !'}))
        .catch(() => this.notifications.schedule({id: 1, title: 'Error: Clapback not uploaded !'}));
      console.log('upload started');
      this.navCtrl.navigateRoot('/');
    } else {
      Object.assign(this.reaction, this.form.value);
      await this.reactionService.edit(this.reaction);
      return this.navCtrl.pop();
    }
  }

  async createReaction(filename: string) {
    this.reaction = new Reaction();
    this.reaction.video = filename;
    this.reaction.text = this.form.value.text;
    this.reaction.hashtags = this.form.value.hashtags;
    this.reaction.user = (this.authService.user._id as any);
    this.reaction.topic = this.topic._id;
    this.reaction.isPublic = true;

    return await this.reactionService.create(this.reaction);
  }
}
