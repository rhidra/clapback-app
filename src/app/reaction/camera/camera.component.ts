import { Component, OnInit } from '@angular/core';
import {CameraPreview, CameraPreviewOptions} from "@ionic-native/camera-preview/ngx";
import {NavController, Platform} from "@ionic/angular";
import {ReactionService} from "../reaction.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
})
export class ReactCameraComponent implements OnInit {

  idTopic: string = '';

  constructor(
    private cameraPreview: CameraPreview,
    private platform: Platform,
    private reactionService: ReactionService,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.idTopic = params.idTopic || '';
    });

    const cameraPreviewOpts: CameraPreviewOptions = {
      x: 0,
      y: 0,
      width: window.screen.width,
      height: window.screen.height,
      camera: this.cameraPreview.CAMERA_DIRECTION.BACK,
      tapPhoto: false,
      tapFocus: true,
      previewDrag: true,
      toBack: true,
      alpha: 1
    }

    this.platform.ready().then(() => {
      this.cameraPreview.startCamera(cameraPreviewOpts).then(
      (res) => {
        console.log(res)
      }).catch((err) => console.error(err));
    });
  }

  startRecording() {
    this.cameraPreview.startRecordVideo({
      cameraDirection: this.cameraPreview.CAMERA_DIRECTION.BACK,
      width: (window.screen.width / 2),
      height: (window.screen.height / 2),
      quality: 60,
      withFlash: false,
    })
      .then(path => console.log('start', path))
      .catch(error => console.error('start error', error));
  }

  stopRecording() {
    this.cameraPreview.stopRecordVideo()
      .then(path => {
        this.reactionService.setPendingMediaUrl(path);
        this.navCtrl.navigateForward(['/', 'reaction', 'upload', this.idTopic]);
      })
      .catch(error => console.error('stop error', error));
  }
}
