import { Component, inject } from '@angular/core';
import { format } from 'date-fns';
import { MessageHistory } from 'src/app/models/dashboard-count';
import { MessageContent, SendMessageHistory } from 'src/app/models/send-message-hook';
import { ExtractTemplateBodyPipe } from 'src/app/pipes/extract-template-body.pipe';
import { CampaignService } from 'src/app/service/campaign.service';
import { DashboardService } from 'src/app/service/dashboard.service';
import { ReportService } from 'src/app/service/report.service';
import { UserCreationService } from 'src/app/service/user-creation.service';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-detailed-report',
  templateUrl: './detailed-report.component.html',
  styleUrls: ['./detailed-report.component.scss']
})
export class DetailedReportComponent {
  selectedCampaign:any
  mobileNumber: any;
  Admin: string | null = null; 
  Reseller: string | null = null;
  Seller: string | null = null;
  Client: string | null = null;
  userCreation = inject(UserCreationService)
  detailReport= inject(ReportService)
  messageHistory: MessageHistory[] = []
  role: string =sessionStorage.getItem('ROLE')||"";
  pageSize = 10;
  pageIndex = 1;
  totalRecords = 0;
  data:any
  status:any
  date: [Date, Date] = [new Date(), new Date()];
  source: any;
  isLoading=false
  // Admin=""

  userdt: { loggedInUsername: string | null; userId: string | null; } | undefined;
  SellerList: { label: string; value: unknown; }[] | undefined;
  Adminlist: { label: string; value: unknown; }[] | undefined;
  Clientlist: { label: string; value: unknown; }[] | undefined;
  ResllerList: { label: string; value: unknown; }[] | undefined;
  dt:any
  selectedBot:any
  selectedBrand: any;
  selectedTemplate: any;
  campList:any
  

  checkSelectsForNull() {
  if (!this.Admin || !this.Reseller || !this.Seller || !this.Client) {
    this.Admin = '';
    this.Reseller = '';
    this.Seller = '';
    this.Client = '';
  }
}
  
  
  constructor(
    private dashboardService: DashboardService,
    private extractBody: ExtractTemplateBodyPipe,
    private capmser : CampaignService
  ) {
    this.getOptions()
    console.log(this.selectedBot);
  }

  onChangeDate() {
    const formattedDate = new Date(this.date[0]).toISOString().split('T')[0];
    const fromDate = this.date[0]
    const toDate = this.date[1];
  
    const requestData = {
      loggedInUserName: sessionStorage.getItem('USER_NAME'),
      fromDate: fromDate,
      toDate: toDate
    };
    this.capmser.campaignReport(requestData).subscribe(
        (response: any) => {  
        
          if (response?.campaignInfoList && Array.isArray(response.campaignInfoList)) {
            this.campList= response.campaignInfoList
            console.log(response.campaignInfoList)
          } 
        },
        (error) => {
         
        }
      );
  }
  receiveDataBot(event: any) {
    this.selectedBot = event; 
  }

  receiveDataBrand(event: any) {
    this.selectedBrand=event
  }
  receiveDataTemplate(event: any) {
    this.selectedTemplate=event
  }

  expandSet = new Set<string>();
  sortByMessageId = (a: any, b: any) => a.messageId.localeCompare(b.messageId);
  sortByBotName = (a: any, b: any) => a.botName.localeCompare(b.botName);
  sortByUserName = (a: any, b: any) => a.userName.localeCompare(b.userName);
  sortByMobileNumber = (a: any, b: any) => a.mobileNumber.localeCompare(b.mobileNumber);
  sortByTemplateName = (a: any, b: any) => a.templateName.localeCompare(b.templateName);

  sortByDate = (a: any, b: any) => {
    return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
  }
  ngOnInit(): void {
    this.getdata()
    this.onChangeDate()
  }
  onExpandChange(id: string, checked: boolean): void {
    console.log(checked)
    if (checked) {
      console.log(this.expandSet)
      console.log(id)
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }
  

  onNextClick(){
    this.pageIndex++
    this.getdata()
    
  }
  onprevClick(){
    this.pageIndex--
    this.getdata()
    
  }
onChange(type: string) {
  // If the current dropdown is reset to "All", do not change anything
  if (
    (type === 'admin' && !this.Admin) ||
    (type === 'reseller' && !this.Reseller) ||
    (type === 'seller' && !this.Seller) ||
    (type === 'client' && !this.Client)
  ) {
    return;
  }

  // Reset other dropdowns to "All" (i.e., empty string)
  if (type === 'admin') {
    this.Reseller = '';
    this.Seller = '';
    this.Client = '';
  } else if (type === 'reseller') {
    this.Admin = '';
    this.Seller = '';
    this.Client = '';
  } else if (type === 'seller') {
    this.Admin = '';
    this.Reseller = '';
    this.Client = '';
  } else if (type === 'client') {
    this.Admin = '';
    this.Reseller = '';
    this.Seller = '';
  }
 
    else if (type === 'receiveDataBot') {
    this.selectedBot = '';

  }
}
handleSelection(event:any){
  console.log(event)
  if(event.admin){
    this.Admin = event.admin;
  }
  if(event.reseller){
    this.Reseller = event.reseller;
  }
  if(event.seller){
    this.Seller = event.seller;
  }
  if(event.client){
    this.Client = event.client;
  }

}


  getdata(){
    this.isLoading=true
    console.log(this.source)
        this.dt = {
          "loggedInUserName": sessionStorage.getItem('USER_NAME'),
          "resellerName": this.Reseller || null,
          "sellerName": this.Seller || null,
          "clientName":this.Client || null,
          "adminName":this.Admin || null,
          "fromDate": `${format(new Date(this.date[0]), 'yyyy-MM-dd')}`,
          "toDate": `${format(new Date(this.date[1]), 'yyyy-MM-dd')}`,
          "pageNumber": this.pageIndex,
          "mobileNumber": this.mobileNumber,
          "botName": this.selectedBot,
          "campaignName":this.selectedCampaign,
          "messageSource":this.source || undefined,
        }
        console.log("search payload"+JSON.stringify(this.dt))
        this.detailReport.getDetailReport(this.dt).subscribe(
          (res)=>{
            this.data= res
            this.isLoading=false
          }
         )
      }
     
      exportToExcel(jsonData: any[], fileName: string): void {
        // Convert JSON to worksheet
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
    
        // Create a new workbook and append the worksheet
        const workbook: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
        // Write the workbook and generate a Blob
        const excelBuffer: any = XLSX.write(workbook, {
          bookType: 'xlsx',
          type: 'array',
        });
    
        // Save the file
        const data: Blob = new Blob([excelBuffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
        });
        saveAs(data, `${fileName}.xlsx`);
      }
  
downloadReport() {
  this.detailReport.downloaddetailreport(this.dt).subscribe({
    next: (response: Blob) => {
      const blob = new Blob([response], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'detail_report.csv'; // name the file
      document.body.appendChild(a); // Firefox requires this
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
    error: (err) => {
      console.error('Download failed:', err);
      // this.toastService.publishNotification('Error', 'Failed to download report', 'error');
    }
  });
}





  getOptions() {
    this.userdt =
    {
      loggedInUsername: sessionStorage.getItem('USER_NAME'),
      userId: sessionStorage.getItem('USER_ID')

    }
    this.userCreation.getAllChildForUser(this.userdt).subscribe(
      (res) => {
        this.SellerList = [res.data.userAllChildMap.SELLER].flatMap((obj: any) => {
          return Object.entries(obj).map(([key, value]) => ({
            label: key,
            value: value
          }))
        }
        )
        this.Adminlist=[res.data.userAllChildMap.ADMIN].flatMap((obj: any) => {
          return Object.entries(obj).map(([key, value]) => ({
            label: key,
            value: value
          }))
        });
        this.Clientlist = [res.data.userAllChildMap.CLIENT].flatMap((obj: any) => {
          return Object.entries(obj).map(([key, value]) => ({
            label: key,
            value: value
          }))
        });
        this.ResllerList = [res.data.userAllChildMap.RESELLER].flatMap((obj: any) => {
          return Object.entries(obj).map(([key, value]) => ({
            label: key,
            value: value
          }))
        });

      }

    )
  }

  formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }
}
