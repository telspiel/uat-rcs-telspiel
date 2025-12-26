import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  error(arg0: any) {
    throw new Error('Method not implemented.');
  }
  success(arg0: any) {
    throw new Error('Method not implemented.');
  }

  constructor(private notification: NzNotificationService) { }

  publishNotification(title: string, message: string, type: string = 'success'): void {
    this.notification.create(type, title, message);
  }

}
