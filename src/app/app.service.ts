import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Messages } from './app.component';

@Injectable()
export class AppService {
  constructor(private http: HttpClient) {}

  getMessages(): Observable<Messages[]> {
    console.log('getting messages');
    let url = 'https://f6c1-92-119-19-150.ngrok.io/messages';
    return this.http.get<Messages[]>(url);
  }

  postMessage(message: string, userName: string) {
    const d = new Date();
    let time = d.getTime();
    let url = 'https://f6c1-92-119-19-150.ngrok.io/messages';
    let postMessage = {
      username: userName,
      message: message,
      time: time,
    };
    if (message) {
      console.log(postMessage);
      this.http.post(url, postMessage).subscribe((data) => {
        console.log('tried to post', data);
      });
    }
  }
}
