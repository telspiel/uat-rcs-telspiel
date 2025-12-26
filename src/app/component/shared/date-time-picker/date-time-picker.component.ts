import { Component } from '@angular/core';
import { differenceInCalendarDays, setHours, getHours, getMinutes } from 'date-fns';
import { DisabledTimeFn, DisabledTimePartial } from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.scss']
})
export class DateTimePickerComponent {

  today = new Date();

  range(start: number, end: number): number[] {
    const result: number[] = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  disabledDate = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(current, this.today) < 0;


  disabledRangeTime: DisabledTimeFn = (_value, type?: DisabledTimePartial) => {
    console.log(_value)
    const isToday = new Date() === _value;
    return {
      nzDisabledHours: () => this.range(0, 60).slice(0, getHours(_value as Date)),
      nzDisabledMinutes: () => this.range(0, 60).slice(0, getMinutes(_value as Date)),
      nzDisabledSeconds: () => [55, 56]
    };
  };

  onOk(result: Date | Date[] | null): void {
    console.log('onOk', result);
  }

}
