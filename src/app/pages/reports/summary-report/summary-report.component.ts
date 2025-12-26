import { Component } from '@angular/core';

@Component({
  selector: 'app-summary-report',
  templateUrl: './summary-report.component.html',
  styleUrls: ['./summary-report.component.scss']
})
export class SummaryReportComponent {
  date:any
  total=1
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  onSubmit(){

  }
}
