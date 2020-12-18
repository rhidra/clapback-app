import { Component } from '@angular/core';

import { ModalController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {AuthService} from './auth/auth.service';
import {SplashComponent} from './utils/splash/splash.component'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {

  constructor(
    public platform: Platform,
    public splashScreen: SplashScreen,
    public statusBar: StatusBar,
    public authService: AuthService,
    public modalCtrl: ModalController,
  ) {
    this.platform.ready().then(async () => {
      this.statusBar.styleDefault();
      const splash = await modalCtrl.create({
        component: SplashComponent,
        cssClass: 'modal-wrapper',
      });
      splash.present();
    });
  }

}
