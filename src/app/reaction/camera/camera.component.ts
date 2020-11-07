import { Component, OnInit } from '@angular/core';
import {CameraPreview} from "@ionic-native/camera-preview/ngx";
import {NavController, Platform} from "@ionic/angular";
import {ReactionService} from "../reaction.service";
import {ActivatedRoute} from "@angular/router";
import {FileChooser} from "@ionic-native/file-chooser/ngx";
import {FilePath} from "@ionic-native/file-path/ngx";
import { MediaService } from 'src/app/media/media.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
})
export class ReactCameraComponent implements OnInit {

  idTopic: string = '';
  isRecording = false;
  direction: string;

  constructor(
    private cameraPreview: CameraPreview,
    private platform: Platform,
    private mediaService: MediaService,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private fileChooser: FileChooser,
    private filePath: FilePath,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.idTopic = params.idTopic || '';
    });
  }

  ionViewWillEnter() {
    this.platform.ready().then(() => {
      this.isRecording = false;
      this.direction = this.cameraPreview.CAMERA_DIRECTION.FRONT;
      this.cameraPreview.startCamera({
        x: 0,
        y: 0,
        width: window.screen.width,
        height: window.screen.height,
        camera: this.direction,
        tapPhoto: false,
        tapFocus: true,
        previewDrag: true,
        toBack: true,
        alpha: 1
      }).then(
        (res) => {
          console.log(res)
        }).catch((err) => console.error(err));
    });
  }

  ionViewWillLeave() {
    this.cameraPreview.stopCamera();
  }

  startRecording() {
    this.isRecording = true;
    this.cameraPreview.startRecordVideo({
      cameraDirection: this.direction,
      width: (window.screen.width / 2),
      height: (window.screen.height / 2),
      quality: 60,
      withFlash: false,
    })
      .then(path => console.log('start', path))
      .catch(error => console.error(error));
  }

  stopRecording() {
    this.isRecording = false;
    this.cameraPreview.stopRecordVideo()
      .then(path => {
        this.mediaService.setPendingMediaUrl(path);
        this.navCtrl.navigateForward(['/', 'reaction', 'upload', this.idTopic]);
      })
      .catch(error => console.error(error));
  }

  async switch() {
    await this.cameraPreview.switchCamera();
    this.direction = this.direction === this.cameraPreview.CAMERA_DIRECTION.BACK
      ? this.cameraPreview.CAMERA_DIRECTION.FRONT : this.cameraPreview.CAMERA_DIRECTION.BACK;
  }

  chooseFile() {
    // TODO: Use another plugin for iOS (iOS Cordova File Picker)
    this.fileChooser.open({mime: 'video/mp4'})
      .then(uri => this.filePath.resolveNativePath(uri))
      .then(uri => {
        this.mediaService.setPendingMediaUrl(uri);
        this.navCtrl.navigateForward(['/', 'reaction', 'upload', this.idTopic]);
      })
      .catch(err => console.error(err));
  }
}
