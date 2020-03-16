import { Component, OnInit } from '@angular/core';
import { MediaCapture, MediaFile } from '@ionic-native/media-capture/ngx';
import {FileChooser} from '@ionic-native/file-chooser/ngx';
import {NewsFeedService} from '../../news/feed.service';
import {ActivatedRoute} from '@angular/router';
import {Topic} from '../../models/topic.model';
import {ReactionService} from '../reaction.service';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-video-create',
  templateUrl: './video-create.component.html',
  styleUrls: ['./video-create.component.scss'],
})
export class ReactVideoCreateComponent implements OnInit {

  /**
   * For docs about the cordova media capture plugin, see :
   * https://github.com/apache/cordova-plugin-media-capture
   *
   * TODO: Improve the camera user experience
   * To have more freedom in customizing the camera view,
   * we can use the cordova camera preview plugin.
   * But this plugin cannot record videos.
   * Maybe a customization can be done through modifying the cordova media capture plugin.
   */

  constructor(
    private mediaCapture: MediaCapture,
    private fileChooser: FileChooser,
    private feedService: NewsFeedService,
    private reactionService: ReactionService,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {}

  startVideo() {
    this.mediaCapture.captureVideo().then((data: Array<MediaFile>) => {
      this.reactionService.setPendingMedia(data[0]);
      this.navCtrl.navigateForward(['/', 'reaction', 'edit', this.activatedRoute.snapshot.parent.params.idTopic]);
    });
  }

  pickVideo() {
    // TODO: Use another plugin for iOS (iOS Cordova File Picker)
    this.fileChooser.open({mime: 'video/mp4'})
      .then(data => console.log(data))
      .catch(err => console.error(err));
  }
}