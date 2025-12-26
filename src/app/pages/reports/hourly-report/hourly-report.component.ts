import { Component } from '@angular/core';

@Component({
  selector: 'app-hourly-report',
  templateUrl: './hourly-report.component.html',
  styleUrls: ['./hourly-report.component.scss']
})
export class HourlyReportComponent {
  date: any;
  total=1
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  onSubmit() {
  throw new Error('Method not implemented.');
  }
}
