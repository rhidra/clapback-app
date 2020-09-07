import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment as env} from '../../environments/environment';
import {Reaction} from '../models/reaction.model';
import {MediaCapture, MediaFile} from '@ionic-native/media-capture/ngx';
import {AlertController, NavController} from '@ionic/angular';
import {FileChooser} from '@ionic-native/file-chooser/ngx';
import {FilePath} from '@ionic-native/file-path/ngx';
import {AuthService} from '../auth/auth.service';
import {Query} from '../utils/query.service';
import {UserService} from '../grid/user.service';
import {User} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ReactionService {

  url: string;
  reactions: Array<Reaction> = [];

  constructor(
    private alertCtrl: AlertController,
    private http: HttpClient,
    private mediaCapture: MediaCapture,
    private fileChooser: FileChooser,
    private filePath: FilePath,
    private navCtrl: NavController,
    private authService: AuthService,
  ) { }

  async showDialogCreateCB(idTopic) {
    const alert = await this.alertCtrl.create({
      header: 'Clapback',
      message: 'How do you want to make a Clapback ?',
      buttons: [{
        text: 'Open camera',
        handler: () => {
          this.mediaCapture.captureVideo().then((data: Array<MediaFile>) => {
            this.setPendingMediaUrl(data[0].fullPath);
            this.navCtrl.navigateForward(['/', 'reaction', 'upload', idTopic]);
          });
        },
      }, {
        text: 'Search files',
        handler: () => {
          // TODO: Use another plugin for iOS (iOS Cordova File Picker)
          this.fileChooser.open({mime: 'video/mp4'})
            .then(uri => this.filePath.resolveNativePath(uri))
            .then(uri => {
              this.setPendingMediaUrl(uri);
              this.navCtrl.navigateForward(['/', 'reaction', 'upload', idTopic]);
            })
            .catch(err => console.error(err));
        },
      }]
    });

    await alert.present();
  }

  create(reaction: Reaction): Promise<Reaction> {
    return new Promise<Reaction>(resolve => {
      this.http.post(env.apiUrl + 'reaction/', reaction).subscribe((data: any) => resolve(data));
    });
  }

  edit(reaction: Reaction): Promise<void> {
    return new Promise(resolve => {
      this.http.post(env.apiUrl + 'reaction/' + reaction._id, reaction).subscribe((data: any) => resolve());
    });
  }

  searchByUser(user: User, includeProcessing: boolean = false): Promise<void> {
    return this.authService.getToken().then(() => {
      return new Promise<void>((resolve, reject) => {
        this.http.get(env.apiUrl + 'reaction', {params: {user: user._id, isProcessing: includeProcessing}} as any).subscribe((data: any) => {
          this.reactions = data;
          this.reactions.forEach(r => r.user = user);
          resolve();
        }, () => reject());
      });
    });
  }

  searchByUserFollow(userId: string): Promise<void> {
    return this.authService.getToken().then(() => {
      return new Promise<void>((resolve, reject) => {
        this.http.get(env.apiUrl + 'reaction', {params: {populate: true, userFollow: userId}} as any).subscribe((data: any) => {
          this.reactions = data;
          resolve();
        }, () => reject());
      });
    });
  }

  searchByQuery(query: Query): Promise<void> {
    return this.authService.getToken().then(() => {
      return new Promise<void>((resolve, reject) => {
        this.http.get(env.apiUrl + 'reaction', {params: {populate: true, tags: query.hashtags}} as any).subscribe((data: any) => {
          this.reactions = data;
          resolve();
        }, () => reject());
      });
    });
  }

  get(id: string): Promise<any> {
    return this.authService.getToken().then(() => {
      const reaction = this.reactions.find(r => r._id === id);

      if (reaction) {
        return Promise.resolve(reaction);
      } else {
        return new Promise(r => this.http.get(env.apiUrl + 'reaction/' + id).subscribe((data: any) => r(data)));
      }
    });
  }

  clear() {
    this.reactions = [];
  }

  checkLike(reaction: Reaction): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.http.get(env.apiUrl + 'like/reaction', {params: {reaction: reaction._id}}).subscribe((data: any) => {
        resolve(!!data);
      });
    });
  }

  like(reaction: Reaction): Promise<void> {
    return new Promise<void>(resolve => {
      this.http.post(env.apiUrl + 'like/reaction', {reaction: reaction._id}).subscribe((data: any) => {
        resolve();
      });
    });
  }

  unlike(reaction: Reaction): Promise<void> {
    return new Promise<void>(resolve => {
      this.http.delete(env.apiUrl + 'like/reaction', {body: {reaction: reaction._id}} as any).subscribe((data: any) => {
        resolve();
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
