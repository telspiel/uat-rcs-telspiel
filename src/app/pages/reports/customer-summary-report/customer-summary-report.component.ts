import { Component } from '@angular/core';

@Component({
  selector: 'app-customer-summary-report',
  templateUrl: './customer-summary-report.component.html',
  styleUrls: ['./customer-summary-report.component.scss']
})
export class CustomerSummaryReportComponent {
  date:any
  total=1
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  onSubmit(){

  }

}
