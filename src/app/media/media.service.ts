import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment as env} from '../../environments/environment';
declare var FileTransferManager: any;
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import { AuthService } from '../auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class MediaService {
  url: string;

  constructor(
    private http: HttpClient,
    private notifications: LocalNotifications,
    private authService: AuthService,
  ) { }

  // Use POST /media/alloc/:filename to retrieve the file ID used to reference the future uploaded file
  async allocateFilename(mediaURL: string): Promise<string> {
    return new Promise<string>(resolve => {
      const filename = mediaURL.substring(mediaURL.lastIndexOf('/') + 1);
      this.http.post(env.apiUrl + `media/alloc/${filename}`, {}).subscribe(({filename}: any) => resolve(filename));
    });
  }

  uploadVideo(filename, mediaUrl) {
    return new Promise((resolve, reject) => {
      const uploader = FileTransferManager.init();

      uploader.on('success', (upload) => {
        if (upload.state === 'UPLOADED') {
          resolve();
        }
      });

      uploader.on('error', (uploadException) => {
        console.error(uploadException);
        reject();
      });

      uploader.startUpload({
        id: filename,
        filePath: mediaUrl,
        fileKey: 'media',
        serverUrl: env.apiUrl + 'media',
        showNotification: true,
        notificationTitle: 'Uploading clapback ...',
        headers: {
          Authorization: `Bearer ${this.authService.accessToken}`,
        },
        parameters: {filename},
      });

    });
  }

  setPendingMediaUrl(url: string) {
    this.url = url;
  }

  getPendingMediaUrl(): string {
    const u: string = this.url;
    this.url = null;
    return u;
  }
}
