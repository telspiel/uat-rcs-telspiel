import { Component, EventEmitter, Output } from '@angular/core';
import { ReportService } from 'src/app/service/report.service';

@Component({
  selector: 'app-template-dropdown',
  templateUrl: './template-dropdown.component.html',
  styleUrls: ['./template-dropdown.component.scss']
})
export class TemplateDropdownComponent {
  messageTemplates: any;
  seletedTemplate: any;
  route:any
  @Output() templateEvent: EventEmitter<string> = new EventEmitter();

  onChange() {
    this.templateEvent.emit(this.seletedTemplate)
  }
  constructor(private reportService:ReportService) { 
    this.route=window.location.pathname
  }
  ngOnInit() {
    let dt = {
      loggedInUserName: sessionStorage.getItem('USER_NAME'),
    }
     this.reportService.templatelist(dt).subscribe((res: any) => {
       console.log(res);
       if (res.data && res.data.templateList) {
         this.messageTemplates = res.data.templateList;
         
       } else {
         this.messageTemplates = []; 
       }
     });
  }
}
