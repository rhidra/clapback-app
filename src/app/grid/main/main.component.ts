import { Component, OnInit } from '@angular/core';
import {User} from '../../models/user.model';
import {AuthService} from '../../auth/auth.service';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../user.service';
import {ReactionService} from '../../reaction/reaction.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
})
export class GridMainComponent implements OnInit {

  isLoading = true;
  isLoadingReactions = true;
  isOwn = false;
  user: User;

  constructor(
    public authService: AuthService,
    public activatedRoute: ActivatedRoute,
    public userService: UserService,
    public reactionService: ReactionService,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      let p: Promise<any>;
      if (params.userId) {
        p = this.authService.getToken()
          .then(() => this.userService.get(params.userId))
          .then(user => {
            this.user = user;
            this.isOwn = this.authService.user ? this.authService.user._id === this.user._id : false;
            this.isLoading = false;
            return Promise.resolve();
          });
      } else {
        p = this.authService.onAuthenticated(true)
          .then(() => this.userService.get(this.authService.user._id))
          .then(user => {
            this.authService.editUser(user);
            this.user = user;
            this.isOwn = true;
            this.isLoading = false;
            return Promise.resolve();
          });
      }

      p.then(() => this.reactionService.searchByUser(this.user))
        .then(() => this.isLoadingReactions = false);
    });
  }

  uploadNewProfilePic(image: any) {
    this.user.image = image;
    this.userService.edit(this.user);
  }
}
