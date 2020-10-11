import { Component, OnInit } from '@angular/core';
import {CameraPreview} from "@ionic-native/camera-preview/ngx";
import {NavController, Platform} from "@ionic/angular";
import {ReactionService} from "../reaction.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
})
export class ReactCameraComponent implements OnInit {

  idTopic: string = '';
  isRecording = false;

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
  }

  ionViewWillEnter() {
    this.platform.ready().then(() => {
      this.isRecording = false;
      this.cameraPreview.startCamera({
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
      cameraDirection: this.cameraPreview.CAMERA_DIRECTION.BACK,
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
        this.reactionService.setPendingMediaUrl(path);
        this.navCtrl.navigateForward(['/', 'reaction', 'upload', this.idTopic]);
      })
      .catch(error => console.error(error));
  }

  switch() {
    this.cameraPreview.switchCamera();
  }
}
