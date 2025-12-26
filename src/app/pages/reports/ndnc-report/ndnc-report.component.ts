import { Component } from '@angular/core';

@Component({
  selector: 'app-ndnc-report',
  templateUrl: './ndnc-report.component.html',
  styleUrls: ['./ndnc-report.component.scss']
})
export class NDNCReportComponent {
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
