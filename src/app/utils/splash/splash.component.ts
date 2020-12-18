import { Component, OnInit } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
})
export class SplashComponent implements OnInit {

  constructor(
    public modalCtrl: ModalController,
    public splashScreen: SplashScreen,
  ) { }

  ngOnInit() {}

  ionViewDidEnter() {
    this.splashScreen.hide();
    setTimeout(() => {
      this.modalCtrl.dismiss();
    }, 4000); 
  }

}
