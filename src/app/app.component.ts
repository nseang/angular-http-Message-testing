import { Component } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { startWith, switchMap, takeUntil } from 'rxjs/operators';
import { AppService } from './app.service';

export interface Messages {
  id: number;
  message: string;
  time: number;
  username: string;
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  closeTimer$ = new Subject<any>();
  messages: Messages[];
  messageToPost: string = '';
  userName: string = '';
  messageError: boolean;
  userNameError: boolean;
  constructor(private service: AppService) {}

  ngOnInit() {
    timer(0, 5000)
      .pipe(
        switchMap(() => this.service.getMessages()),
        takeUntil(this.closeTimer$)
      )
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.messages = res;
          }
        },
        error: (error: any) => {
          console.log(error);
        },
      });
  }

  async getMessages() {
    this.service.getMessages().subscribe((data: Messages[]) => {
      this.messages = data;
    });
  }

  async postMessage() {
    console.log('post', this.messageToPost);
    if (!this.messageToPost) {
      this.messageError = true;
    } else if (!this.userName) {
      this.userNameError = true;
    } else {
      this.userNameError = false;
      this.messageError = false;
    }

    if (!this.messageError && !this.userNameError) {
      await this.service.postMessage(this.messageToPost, this.userName);
      await this.getMessages();
      this.messageToPost = '';
    }
  }

  ngOnDestroy() {
    this.closeTimer$.next('');
  }
}
