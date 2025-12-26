import { Component } from '@angular/core';

@Component({
  selector: 'app-client-report',
  templateUrl: './client-report.component.html',
  styleUrls: ['./client-report.component.scss']
})
export class ClientReportComponent {
date: any;
total=1
loading = true;
pageSize = 10;
pageIndex = 1;
onSubmit() {
throw new Error('Method not implemented.');
}

}
