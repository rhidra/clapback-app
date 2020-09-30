import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {ReactionService} from "../../reaction/reaction.service";

@Component({
  selector: 'app-activity-search',
  templateUrl: './search.component.html',
})
export class ActivitySearchComponent implements OnInit {

  isLoading: boolean = true;
  page = 0;

  constructor(
    private authService: AuthService,
    public reactionService: ReactionService,
  ) {}

  async ngOnInit() {
    await this.authService.onAuthenticated(true);
    this.isLoading = true;
    await this.loadMoreReactions();
    this.isLoading = false;
  }

  async loadMoreReactions(event?) {
    const oldLength = this.reactionService.reactions.length;
    await this.reactionService.searchByUserFollow(this.authService.user._id, this.page);
    if (oldLength !== this.reactionService.reactions.length) {
      this.page++;
    }
    if (event) {
      event.target.complete();
    }
  }
}
