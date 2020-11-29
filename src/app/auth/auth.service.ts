import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../models/user.model';
import * as jwt_decode from 'jwt-decode';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {NavController, Platform} from '@ionic/angular';
import {environment as env} from '../../environments/environment';
import {LOCAL_STORAGE, WebStorageService} from 'ngx-webstorage-service';
import {Location} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  pendingId: string;
  user: User;
  refreshToken: string;
  accessToken: string;

  getToken(): Promise<any> {
    return new Promise<string>(resolve => {
      if (!this.isTokenExpired()) { return resolve(this.accessToken); }
      if (!this.user || !this.refreshToken) { return resolve(null); }

      this.http.post(env.apiUrl + 'auth/token', {id: this.user._id, refreshToken: this.refreshToken})
          .subscribe((res: any) => {
            this.accessToken = res.token;
            resolve(this.accessToken);
          }, () => resolve(null));
    });
  }

  constructor(
    private http: HttpClient,
    private storage: NativeStorage,
    private platform: Platform,
    private navCtrl: NavController,
    private location: Location,
    @Inject(LOCAL_STORAGE) private storageDev: WebStorageService,
  ) {
    this.platform.ready().then(() => this.loadFromStorage());
  }

  loadFromStorage(): Promise<any> {
    const p = [];
    if (this.platform.is('hybrid')) {
      p.push(new Promise(r => this.storage.getItem('refreshToken').then(t => this.refreshToken = t as any).catch(null).finally(r)));
      p.push(new Promise(r => this.storage.getItem('user').then(u => this.user = u as any).catch(null).finally(r)));
    } else if (!env.production) {
      this.refreshToken = this.storageDev.get('refreshToken');
      this.user = this.storageDev.get('user');
    }
    return Promise.all(p);
  }

  saveInStorage(): Promise<any> {
    const promises = [];
    if (this.platform.is('hybrid')) {
      promises.push(this.storage.setItem('refreshToken', this.refreshToken));
      promises.push(this.storage.setItem('user', this.user));
    } else if (!env.production) {
      this.storageDev.set('refreshToken', this.refreshToken);
      this.storageDev.set('user', this.user);
    }

    return Promise.all(promises);
  }

  isTokenExpired(): boolean {
    if (!this.accessToken) { return true; }
    const decoded = jwt_decode(this.accessToken);
    if (decoded.exp === undefined) { return false; }
    const date = new Date(0).setUTCSeconds(decoded.exp);
    return !(date.valueOf() > new Date().valueOf());
  }

  onAuthenticated(redirectLogin: boolean = false): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.getToken().then(token => {
        if (token) {
          resolve();
        } else if (redirectLogin) {
          this.navCtrl.navigateForward(['/auth']);
        } else {
          reject();
        }
      });
    });
  }

  editUser(user: User): Promise<any> {
    Object.assign(this.user, user);
    if (this.platform.is('hybrid')) {
      return this.storage.setItem('user', user);
    } else {
      this.storageDev.set('user', this.user);
      return Promise.resolve();
    }
  }

  login(phone: string, code: string, verificationId: string) {
    return new Promise((resolve, reject) => {
      this.http.post(env.apiUrl + 'auth/phone/login', {phone, code, verificationId}).subscribe((res: any) => {
        this.pendingId = '';
        this.refreshToken = res.refreshToken;
        this.user = new User();
        Object.assign(this.user, res.user);
        this.accessToken = res.token;
        this.saveInStorage().then(resolve).catch(reject);
      });
    });
  }

  loginEmail(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.http.post(env.apiUrl + 'auth/login/check', {email})
        .subscribe(() => {
          // Login
          this.http.post(env.apiUrl + 'auth/login', {email, password}).subscribe((res: any) => {
            this.refreshToken = res.refreshToken;
            this.user = new User();
            Object.assign(this.user, res.user);
            this.accessToken = res.token;
            this.saveInStorage().then(resolve).catch(reject);
          });
        }, () => {
          // Registration
          this.http.post(env.apiUrl + 'auth/register', {email, password}).subscribe((res: any) => {
            this.refreshToken = res.refreshToken;
            this.user = new User();
            Object.assign(this.user, res.user);
            this.accessToken = res.token;
            this.saveInStorage().then(resolve).catch(reject);
          });
        })
    });
  }

  logout() {
    const p = [];
    if (this.platform.is('hybrid')) {
      p.push(this.storage.remove('refreshToken'));
      p.push(this.storage.remove('user'));
    } else if (!env.production) {
      this.storageDev.remove('refreshToken');
      this.storageDev.remove('user');
    }

    Promise.all(p).then(() => location.reload());
  }
}
