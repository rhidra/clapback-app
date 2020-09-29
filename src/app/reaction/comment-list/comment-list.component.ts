import {Component, Input, OnInit} from '@angular/core';
import {CommentService} from "../comment.service";

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss'],
})
export class ReactCommentListComponent implements OnInit {

  @Input() topic: string;
  @Input() reaction: string;

  page: number = 0;

  constructor(
    public commentService: CommentService,
  ) { }

  ngOnInit() {}

  async loadData(event?) {
    if (this.topic) {
      await this.commentService.searchByTopic(this.topic, this.page);
    } else if (this.reaction) {
      await this.commentService.searchByReaction(this.reaction, this.page);
    }
    this.page++;
    if (event) {
      event.target.complete();
    }
  }
}
