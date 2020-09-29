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

  async ngOnInit() {
    this.activatedRoute.params.subscribe(async params => {
      if (params.userId) {
        await this.authService.getToken();
        this.user = await this.userService.get(params.userId);
        this.isOwn = this.authService.user ? this.authService.user._id === this.user._id : false;
        this.isLoading = false;
      } else {
        await this.authService.onAuthenticated(true);
        this.user = await this.userService.get(this.authService.user._id);
        await this.authService.editUser(this.user);
        this.isOwn = true;
        this.isLoading = false;
      }

      await this.reactionService.searchByUser(this.user, this.isOwn);
      this.isLoadingReactions = false;
    });
  }

  uploadNewProfilePic(image: any) {
    this.user.image = image;
    this.userService.edit(this.user);
  }
}
