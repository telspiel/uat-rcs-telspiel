import { Component } from '@angular/core';

import { NzDatePickerModule ,  } from 'ng-zorro-antd/date-picker';

import { FormsModule  } from '@angular/forms';


@Component({
  selector: 'app-error-report',
  templateUrl: './error-report.component.html',
  styleUrls: ['./error-report.component.scss']
})
export class ErrorReportComponent {

  value ? : string;

  // date = null;

  name ?:  string; 

  change(result : Date){
    console.log('change');

  }

  date:any
  total=1
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  onSubmit(){

  }


}
