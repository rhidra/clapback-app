import {Injectable, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {NewsModule} from './news/news.module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthInterceptor} from './auth/auth.interceptor';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
// import {MediaCapture} from '@ionic-native/media-capture/ngx';
// import {MediaCaptureMock} from '../mocks/media-capture';
import {FileChooser} from '@ionic-native/file-chooser/ngx';
import {File} from '@ionic-native/file/ngx';
import {FilePath} from '@ionic-native/file-path/ngx';
import {ReactionService} from './reaction/reaction.service';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HAMMER_GESTURE_CONFIG, HammerGestureConfig} from '@angular/platform-browser';
import {UtilsModule} from "./utils/utils.module";

@Injectable()
export class CustomHammerConfig extends HammerGestureConfig {
  overrides = {
    press: {time: 250},
    pinch: {enable: false},
    rotate: {enable: false},
  };
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    NewsModule,
    FontAwesomeModule,
    UtilsModule,
  ],
  providers: [
    ReactionService,
    StatusBar,
    SplashScreen,
    NativeStorage,
    File, // TODO: Make a mock for File plugin
    FileChooser, // TODO: Make a mock for FileChooser plugin
    FilePath, // TODO: Make a mock for FilePath plugin
    LocalNotifications,
    // { provide: MediaCapture, useClass: window.hasOwnProperty('cordova') ? MediaCapture : MediaCaptureMock },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    library.add(fas);
  }
}
