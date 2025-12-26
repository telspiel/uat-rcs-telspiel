import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

declare var $: any;

@Injectable({
  providedIn: 'root'
})

export class SpinnerService {

  private count = 0;
  private spinner$ = new BehaviorSubject<string>('');

  constructor() { }

  getSpinnerObserver(): Observable<string> {
    return this.spinner$.asObservable();
  }

  requestStarted() {
    if (++this.count === 1) {
      $('body').addClass('filterBlur');
      this.spinner$.next('start');
    }
  }

  requestEnded() {
    if (this.count === 0 || --this.count === 0) {
      $('body').removeClass('filterBlur');
      this.spinner$.next('stop');
    }
  }

  resetSpinner() {
    $('body').removeClass('filterBlur');
    this.count = 0;
    this.spinner$.next('stop');
  }
}
