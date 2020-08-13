import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {User} from '../../models/user.model';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
})
export class GridEditComponent implements OnInit {

  isLoading = true;
  form: FormGroup;
  user: User;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.authService.onAuthenticated(true)
      .then(() => this.userService.get(this.authService.user._id))
      .then(user => {
        this.user = user;
        this.initForm();
      });
  }

  initForm() {
    this.form = this.fb.group({
      image: [this.user.image || ''],
      description: [this.user.description || ''],
      name: [this.user.name || ''],
    });
    this.isLoading = false;
  }

  ionViewWillLeave() {
    Object.assign(this.user, this.form.value);
    this.userService.edit(this.user);
  }
}
