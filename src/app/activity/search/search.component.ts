import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {ReactionService} from "../../reaction/reaction.service";
import {environment as env} from "../../../environments/environment";

@Component({
  selector: 'app-activity-search',
  templateUrl: './search.component.html',
})
export class ActivitySearchComponent implements OnInit {

  isLoading: boolean = true;
  host = env.mediaHost;

  constructor(
    private authService: AuthService,
    public reactionService: ReactionService,
  ) {}

  async ngOnInit() {
    await this.authService.onAuthenticated(true);
    this.isLoading = true;
    await this.reactionService.searchByUserFollow(this.authService.user._id);
    this.isLoading = false;
  }

}
