import {User} from './user.model';
import {Topic} from './topic.model';
import {Reaction} from './reaction.model';

export class Comment {
  _id?: string;

  topic?: string | Topic;
  reaction?: string | Reaction;

  user: User;
  date?: string;

  text: string;

  likesCounter?: number;
  hasLiked?: boolean = false;
}
