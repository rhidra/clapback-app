import {Directive, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {MediaCapture, MediaFile} from '@ionic-native/media-capture/ngx';
import {environment as env} from '../../../environments/environment';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {AlertController, LoadingController} from '@ionic/angular';
import {FileChooser} from '@ionic-native/file-chooser/ngx';
import {FilePath} from '@ionic-native/file-path/ngx';
import {File} from '@ionic-native/file/ngx';
import { MediaService } from 'src/app/media/media.service';

@Directive({
  selector: '[appMediaUpload]'
})
export class MediaUploadDirective {

  @Input() title: string = 'Change profile picture';
  @Input() appMediaUpload: boolean = true;
  @Output() uploadDone = new EventEmitter();

  loading: any;

  constructor(
    private alertCtrl: AlertController,
    private mediaCapture: MediaCapture,
    private fileChooser: FileChooser,
    private filePath: FilePath,
    private file: File,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private mediaService: MediaService,
  ) { }

  @HostListener('click')
  async onClick() {
    if (!this.appMediaUpload) { return; }

    this.loading = await this.loadingCtrl.create({message: 'Please wait...'});

    const alert = await this.alertCtrl.create({
      header: this.title,
      buttons: [{
        text: 'Take photo',
        handler: () => {
          this.mediaCapture.captureImage()
            .then((data: Array<MediaFile>) => this.setNewProfilePic(data[0].fullPath));
        },
      }, {
        text: 'Search files',
        handler: () => {
          // TODO: Use another plugin for iOS (iOS Cordova File Picker)
          this.fileChooser.open()
            .then(uri => this.filePath.resolveNativePath(uri))
            .then(uri => this.setNewProfilePic(uri))
            .catch(err => console.error(err));
        },
      }]
    });

    await alert.present();
  }

  async setNewProfilePic(uri: string) {
    this.loading.present();
    const directory = uri.substring(0, uri.lastIndexOf('/'));
    const name = uri.substring(uri.lastIndexOf('/') + 1);
    const filename = await this.mediaService.allocateFilename(name);

    this.file.readAsArrayBuffer(directory, name)
      .then((data: ArrayBuffer) => new Promise(resolve => {
        const blob = new Blob([data], {type: 'image/jpeg'});
        const uploadData = new FormData();
        uploadData.append('media', blob, name);
        uploadData.append('filename', filename);
        this.http.post(env.apiUrl + 'media', uploadData, {reportProgress: true, observe: 'events'}).subscribe((r: any) => {
          if (r.type === HttpEventType.Response) {
            resolve(r.body.filename);
          }
        });
      }))
      .then((filename: string) => {
        this.uploadDone.emit(filename);
        this.loading.dismiss();
      });
  }
}
