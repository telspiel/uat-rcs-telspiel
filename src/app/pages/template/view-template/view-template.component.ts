import { Component } from '@angular/core';
import { BrandService } from 'src/app/service/brand.service';
import { ReportService } from 'src/app/service/report.service';
import { TemplateMessageService } from 'src/app/service/template-message.service';
import { TemplateService } from 'src/app/service/template-service.service';


@Component({
    selector: 'app-view-template',
    templateUrl: './view-template.component.html',
    styleUrls: ['./view-template.component.scss']
  })
export class ViewTemplateComponent {

  currentStep: number = 1;
  messageTemplates: any = [];
  newbot: any;
  botId:string=""
  loading: boolean = true;
  
 
  constructor(private reportService: ReportService, private template: TemplateMessageService , private brandservice : BrandService, private templateService: TemplateService,)  {

   }

    getTemplate(temp:any){
      this.template.setTemplate(temp)
    }
  ngOnInit() {
    let dt1 = {
      loggedInUserName: sessionStorage.getItem('USER_NAME'),
      
    }
    this.loading = true;
    this.templateService.getallbotdetail(dt1).subscribe(
      (response: any) => {
        if (response.data && response.data.bots) {
          this.newbot = response.data.bots; 
          this.loading = false;
        } else {
          console.error('Invalid API response:', response);
          this.loading = false;
        }
      },
      (error) => {
        console.error('Failed to fetch bot data:', error);
        this.loading = false;
      }
    );
    

    }

      getTemplates(botid:any){
        console.log(botid)
        this.messageTemplates =[]
        let dt = {
          "loggedInUserName":sessionStorage.getItem('USER_NAME'),
          "botId":botid
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


