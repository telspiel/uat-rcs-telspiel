import { Component } from '@angular/core';

@Component({
  selector: 'app-sender-id-report',
  templateUrl: './sender-id-report.component.html',
  styleUrls: ['./sender-id-report.component.scss']
})
export class SenderIdReportComponent {
  date:any
  total=1
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  onSubmit(){

  }
}
