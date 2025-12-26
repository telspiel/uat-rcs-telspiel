import { Component } from '@angular/core';

@Component({
  selector: 'app-scheduling',
  templateUrl: './scheduling.component.html',
  styleUrls: ['./scheduling.component.scss']
})
export class SchedulingComponent {
  date = null;
  time: Date | null = null;
  weekDays: string[] = ['Monday', "Tuesday", "Wednesday", 'Thursday', 'Friday', 'Saturday', 'Sunday']
  onChange(result: Date): void {
    console.log('onChange: ', result);
  }
}
