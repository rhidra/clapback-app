import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment as env} from '../../environments/environment';
import {Comment} from '../models/comment.model';
import {AuthService} from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  topicsComments = new Map<string, Array<Comment>>();
  reactionsComments = new Map<string, Array<Comment>>();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  create(comment: Comment): Promise<Comment> {
    return new Promise<Comment>(resolve => {
      this.http.post(env.apiUrl + 'comment/', comment).subscribe((data: Comment) => {
        if (data.topic) {
          (this.topicsComments.get(data.topic as string) || []).push(data);
        }
        if (data.reaction) {
          (this.reactionsComments.get(data.reaction as string) || []).push(data);
        }
        data.user = this.authService.user;
        resolve(data);
      });
    });
  }

  searchByTopic(idTopic: string, page: number = 0, pageSize: number = 10): Promise<void> {
    return this.authService.getToken().then(() => {
      return new Promise<void>(resolve => {
        this.http.get(env.apiUrl + 'comment', {params: {populate: true, topic: idTopic, page, pageSize}} as any).subscribe((data: any) => {
          const oldData = this.topicsComments.get(idTopic) || [];
          data.forEach(c => !oldData.find(e => e._id === c._id) ? oldData.push(c) : null);
          this.topicsComments.set(idTopic, oldData);
          resolve();
        });
      });
    }).catch(() => {});
  }

  searchByReaction(idReaction: string, page: number = 0, pageSize: number = 10): Promise<void> {
    return this.authService.getToken().then(() => {
      return new Promise<void>(resolve => {
        this.http.get(env.apiUrl + 'comment', {params: {populate: true, reaction: idReaction, page, pageSize}} as any).subscribe((data: any) => {
          const oldData = this.reactionsComments.get(idReaction) || [];
          data.forEach(c => !oldData.find(e => e._id === c._id) ? oldData.push(c) : null);
          this.reactionsComments.set(idReaction, oldData);
          resolve();
        });
      });
    });
  }

  async get(id: string) {
    await this.authService.getToken();

    for (const map of [this.topicsComments, this.reactionsComments]) {
      for (const [_, comments] of map.entries()) {
        const result = comments.find(r => r._id === id);
        if (result) {
          return result;
        }
      }
    }

    return new Promise<Comment>(r =>
      this.http.get(env.apiUrl + 'comment/' + id).subscribe((data: any) => {
        r(data);
      })
    );
  }

  checkLike(comment: Comment): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.http.get(env.apiUrl + 'like/comment', {params: {comment: comment._id}}).subscribe((data: any) => {
        resolve(!!data);
      });
    });
  }

  like(comment: Comment): Promise<void> {
    return new Promise<void>(resolve => {
      this.http.post(env.apiUrl + 'like/comment', {comment: comment._id}).subscribe((data: any) => {
        resolve();
      });
    });
  }

  unlike(comment: Comment): Promise<void> {
    return new Promise<void>(resolve => {
      this.http.delete(env.apiUrl + 'like/comment', {body: {comment: comment._id}} as any).subscribe((data: any) => {
        resolve();
      });
    });
  }
}
