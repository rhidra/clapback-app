import {Component, OnInit} from '@angular/core';
import {NavController, ToastController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {environment as env} from '../../../environments/environment';
import * as firebase from "firebase";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  returnUrl: string = '/';
  delay = 0;

  // Delay for the user to enter the SMS code
  delaySize = 30;

  // Firebase functions
  recaptchaVerifier: any;
  verificationId: any;

  constructor(
    public navCtrl: NavController,
    public fb: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    public authService: AuthService,
    public toastController: ToastController,
  ) {}

  ngOnInit() {
    this.initForm();
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  ionViewDidEnter() {
    firebase.initializeApp(env.firebase);
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      size: 'invisible',
      callback: () => {
        this.sendCode();
      }
    });
  }

  initForm() {
    this.form = this.fb.group({
      // TODO: Fix validators when a proper authentication SMS code works
      phone: ['', [/*Validators.pattern('[0-9]{10,12}'), */Validators.required]],
      code: ['', [Validators.required]]
      // code: env.production ? ['', [Validators.pattern('[0-9]{6}'), Validators.required]] : [''],
    });
  }

  sendCode() {
    setTimeout(() => this.startTimer(), 1000);

    firebase.auth().signInWithPhoneNumber(this.form.value.phone, this.recaptchaVerifier)
      .then((confirmationResult) => {
        this.verificationId = confirmationResult.verificationId;
      }).catch((err) => {
        this.toastController.create({
          message: 'Too many requests ! Please wait a moment...',
          color: 'danger',
          duration: 1000,
        }).then(toast => toast.present());
        console.error(err);
      });
  }

  startTimer() {
    this.delay = this.delaySize;
    const timer = () => {
      this.delay--;
      if (this.delay > 0) {
        setTimeout(timer, 1000);
      }
    };
    timer();
  }

  async login() {
    await this.authService.login(this.form.value.phone, this.form.value.code, this.verificationId);
    this.delay = 0;
    await this.router.navigateByUrl(this.returnUrl);
    location.reload();
  }
}