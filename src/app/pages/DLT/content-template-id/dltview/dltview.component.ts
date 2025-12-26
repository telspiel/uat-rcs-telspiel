import { Component } from '@angular/core';

@Component({
  selector: 'app-dltview',
  templateUrl: './dltview.component.html',
  styleUrls: ['./dltview.component.scss']
})
export class DltviewComponent {
  date:any
  total=1
  loading = true;
  pageSize = 10;
  pageIndex = 1;

}
