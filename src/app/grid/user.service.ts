import { Injectable } from '@angular/core';
import {User} from '../models/user.model';
import {HttpClient} from '@angular/common/http';
import {environment as env} from '../../environments/environment';
import {AuthService} from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  get(id: string): Promise<User> {
    return new Promise<User>(resolve => {
      this.http.get(env.apiUrl + 'user/' + id).subscribe((data: any) => resolve(data));
    });
  }

  edit(user: User): Promise<void> {
    return new Promise<void>(resolve => {
      this.http.post(env.apiUrl + 'user/' + user._id, user).subscribe(() => {
        this.authService.editUser(user).then(resolve);
      });
    });
  }

  follow(user: User): Promise<void> {
    return new Promise<void>(resolve => {
      this.http.post(env.apiUrl + 'follow', {following: user._id}).subscribe(() => {
        user.isFollowing = true;
        resolve();
      });
    });
  }

  unfollow(user: User): Promise<void> {
    return new Promise<void>(resolve => {
      this.http.delete(env.apiUrl + 'follow/' + user._id).subscribe(() => {
        user.isFollowing = false;
        resolve();
      });
    });
  }
}
