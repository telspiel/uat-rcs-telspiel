import { Component } from '@angular/core';

@Component({
  selector: 'app-latency-report',
  templateUrl: './latency-report.component.html',
  styleUrls: ['./latency-report.component.scss']
})
export class LatencyReportComponent {
  date: any;
  total=1
  loading = true;
  pageSize = 10;
  pageIndex = 1;
Reseller: any;
Seller: any;
client: any;
  onSubmit() {
  throw new Error('Method not implemented.');
  }

}
