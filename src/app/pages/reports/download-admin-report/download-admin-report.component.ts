import { Component } from '@angular/core';

@Component({
  selector: 'app-download-admin-report',
  templateUrl: './download-admin-report.component.html',
  styleUrls: ['./download-admin-report.component.scss']
})
export class DownloadAdminReportComponent {
  date:any
  total=1
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  onSubmit(){

  }

}
