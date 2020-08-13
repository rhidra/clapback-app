import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {AuthService} from './auth/auth.service';

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
  ) {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

}
