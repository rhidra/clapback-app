import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Topic} from '../models/topic.model';
import {environment as env} from '../../environments/environment';
import {AuthService} from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NewsFeedService {

  topics: Array<Topic> = [];
  page: number = 0;
  pageSize: number = 5;

  reqPending: boolean = false;

  constructor(
      private http: HttpClient,
      private authService: AuthService,
  ) { }

  loadMore(): Promise<void> {
    if (this.reqPending) { return; }
    this.reqPending = true;
    return this.authService.getToken().then(() => new Promise((resolve, reject) =>
      this.http.get(env.apiUrl + 'topic/', {params: {populate: true, isPublic: true, page: this.page, pageSize: this.pageSize}} as any).subscribe((data: any) => {
        data.forEach(elem => {
          if (!this.topics.find(e => e._id === elem._id)) {
            this.topics.push(elem);
          }
        });
        if (data.length !== 0) {
          this.page++;
          this.reqPending = false;
        }
        resolve();
      }, () => reject())
    ));
  }

  getTopic(id: string): Promise<Topic> {
    return this.authService.getToken().then(() => {
      const topic = this.topics.find(t => t._id === id);
      if (topic) {
        return Promise.resolve(topic);
      } else {
        return new Promise(r => this.http.get(env.apiUrl + 'topic/' + id).subscribe((data: Topic) => r(data)));
      }
    });
  }

  checkLike(topic: Topic): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.http.get(env.apiUrl + 'like/topic', {params: {topic: topic._id}}).subscribe((data: any) => {
        resolve(!!data);
      });
    });
  }

  like(topic: Topic): Promise<void> {
    return new Promise(resolve => {
      this.http.post(env.apiUrl + 'like/topic', {topic: topic._id}).subscribe((data: any) => {
        resolve();
      });
    });
  }

  unlike(topic: Topic): Promise<void> {
    return new Promise(resolve => {
      this.http.delete(env.apiUrl + 'like/topic', {body: {topic: topic._id}} as any).subscribe((data: any) => {
        resolve();
      });
    });
  }
}
