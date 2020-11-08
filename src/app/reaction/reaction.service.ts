import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment as env} from '../../environments/environment';
import {Reaction} from '../models/reaction.model';
import {AuthService} from '../auth/auth.service';
import {Query} from '../utils/query.service';
import {User} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ReactionService {

  reactions: Array<Reaction> = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  create(reaction: Reaction): Promise<Reaction> {
    return new Promise<Reaction>(resolve => {
      this.http.post(env.apiUrl + 'reaction/', reaction).subscribe((data: any) => resolve(data));
    });
  }

  edit(reaction: Reaction): Promise<void> {
    return new Promise(resolve => {
      this.http.post(env.apiUrl + 'reaction/' + reaction._id, reaction).subscribe((data: any) => resolve());
    });
  }

  searchByUser(user: User, includeProcessing: boolean = false, page: number = 0, pageSize: number = 12): Promise<void> {
    return this.authService.getToken().then(() => {
      return new Promise<void>((resolve, reject) => {
        this.http.get(env.apiUrl + 'reaction', {params: {user: user._id, isProcessing: includeProcessing, page, pageSize, sort: -1}} as any).subscribe((data: any) => {
          if (page === 0 || this.reactions.length === 0) {
            this.reactions = data;
          } else {
            data.forEach(react => !this.reactions.find(r => react._id === r._id) ? this.reactions.push(react) : null);
          }
          this.reactions.forEach(r => r.user = user);
          resolve();
        }, () => reject());
      });
    });
  }

  searchByUserFollow(userId: string, page: number, pageSize: number = 10): Promise<void> {
    return this.authService.getToken().then(() => {
      return new Promise<void>((resolve, reject) => {
        this.http.get(env.apiUrl + 'reaction', {params: {populate: true, userFollow: userId, page, pageSize}} as any).subscribe((data: any) => {
          if (page === 0 || this.reactions.length === 0) {
            this.reactions = data;
          } else {
            data.forEach(react => !this.reactions.find(r => react._id === r._id) ? this.reactions.push(react) : null);
          }
          resolve();
        }, () => reject());
      });
    });
  }

  searchByQuery(query: Query, page: number, pageSize: number = 10): Promise<void> {
    return this.authService.getToken().then(() => {
      return new Promise<void>((resolve, reject) => {
        this.http.get(env.apiUrl + 'reaction', {params: {populate: true, tags: query.hashtags, page, pageSize}} as any).subscribe((data: any) => {
          if (page === 0 || this.reactions.length === 0) {
            this.reactions = data;
          } else {
            data.forEach(react => !this.reactions.find(r => react._id === r._id) ? this.reactions.push(react) : null);
          }
          resolve();
        }, () => reject());
      });
    });
  }

  get(id: string): Promise<any> {
    return this.authService.getToken().then(() => {
      const reaction = this.reactions.find(r => r._id === id);

      if (reaction) {
        return Promise.resolve(reaction);
      } else {
        return new Promise(r => this.http.get(env.apiUrl + 'reaction/' + id).subscribe((data: any) => r(data)));
      }
    });
  }

  clear() {
    this.reactions = [];
  }

  checkLike(reaction: Reaction): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.http.get(env.apiUrl + 'like/reaction', {params: {reaction: reaction._id}}).subscribe((data: any) => {
        resolve(!!data);
      });
    });
  }

  like(reaction: Reaction): Promise<void> {
    return new Promise<void>(resolve => {
      this.http.post(env.apiUrl + 'like/reaction', {reaction: reaction._id}).subscribe((data: any) => {
        resolve();
      });
    });
  }

  unlike(reaction: Reaction): Promise<void> {
    return new Promise<void>(resolve => {
      this.http.delete(env.apiUrl + 'like/reaction', {body: {reaction: reaction._id}} as any).subscribe((data: any) => {
        resolve();
      });
    });
  }

  delete(id: string): Promise<void> {
    return new Promise<void>(resolve => {
      this.http.delete(env.apiUrl + 'reaction/' + id).subscribe(() => {
        this.reactions = this.reactions.filter(r => r._id !== id);
        resolve();
      });
    })
  }
}
