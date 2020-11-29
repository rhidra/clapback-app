import {Component, OnInit} from '@angular/core';
import {NavController, ToastController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-login-email',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginEmailComponent implements OnInit {

  form: FormGroup;
  returnUrl: string = '/';

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

  ionViewDidEnter() {}

  initForm() {
    this.form = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  async login() {
    await this.authService.loginEmail(this.form.value.email, this.form.value.password);
    await this.router.navigateByUrl(this.returnUrl);
    location.reload();
  }
}