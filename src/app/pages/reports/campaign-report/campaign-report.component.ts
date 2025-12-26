import { Component, ElementRef, ViewChild } from '@angular/core';
import { NzProgressFormatter } from 'ng-zorro-antd/progress';
import { ActivatedRoute } from '@angular/router';
import { CampaignReportService } from 'src/app/service/campaign-report.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CampaignService } from 'src/app/service/campaign.service';
import { interval, switchMap } from 'rxjs';

@Component({
  selector: 'app-campaign-report',
  templateUrl: './campaign-report.component.html',
  styleUrls: ['./campaign-report.component.scss'],
  // Removed 'imports' as it is only valid for standalone components
})
export class CampaignReportComponent {
  @ViewChild('content', { static: false }) content!: ElementRef;
  loading=false
  fullCampaignData: any;
  campaignName: string = '';
  campaignData: any;
  deliveryPercentage: number = 0;
  readPercentage: number = 0;
  failedPercentage:number=0
  complitionPercentage:any
  treeData: { title: string; key: string; expanded: boolean; children: { title: string; key: string; isLeaf: boolean; }[]; }[] = [];
  isLoading = false;
  DLRawaited: number = 0;
  constructor(private campaignReportService: CampaignReportService,  private route: ActivatedRoute, private capmser : CampaignService){

  }

  generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
  // downloadPDF() {
  //   const contentElement = this.content.nativeElement;

  //   html2canvas(contentElement).then(canvas => {
  //     const imgData = canvas.toDataURL('image/png');
  //     const pdf = new jsPDF('p', 'mm', 'a4');

  //     const imgWidth = 190; // Adjust width
  //     const pageHeight = 297; // A4 page height in mm
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

  //     pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
  //     pdf.save(`campaignReport-${this.campaignData.campaignName}-${this.generateRandomString(12)}.pdf`);
  //   });
  // }
  downloadPDF() {
  const contentElement = this.content.nativeElement;

  html2canvas(contentElement).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const imgWidth = 190;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const campaignName = this.campaignData?.campaignName || 'vtsdemoclient';
    const timestamp = new Date().toLocaleString().replace(/[/,: ]/g, '-');

    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    pdf.save(`campaignReport-${campaignName}-${timestamp}.pdf`);
  });
}


  processCampaignData(campaignInfoList: any): void {
    // Keep the original data
   
  
    // Create display data with formatted fields
    
    
  }

  ngOnInit() {
    this.campaignName = this.route.snapshot.paramMap.get('campaignName') || '';
    //console.log("Campaign Name:", this.campaignName);
    //this.reloadPage();
    this.isLoading = true;
    this.reloadPage();
    // this.isLoading = false;
    //this.campaignData = this.campaignReportService.getCampaignData();
    
    // this.campaignData.expiryDateTime = this.formatDate(this.campaignData?.campaignReport?.campaignStartDate);
    // this.campaignData.createdDate = this.formatDate(this.campaignData?.campaignReport?.campaignEndDate);
    // this.campaignData.campaignDate = new Date(this.campaignData.createdDate).toLocaleString();
   
    
  }
  reloadPage(){
   
    this.loading=true
    // this.isLoading = true;
    const requestData = {
      loggedInUserName: sessionStorage.getItem('USER_NAME'),
      campaignName: this.campaignName,
    };
    this.campaignReportService.getcampaignData(requestData).subscribe(
        (response: any) => {  
          console.log("API Response:", response);
          this.campaignData = response.campaignInfo;
          //this.campaignReportService.setCampaignData(response.campaignInfo); 
          console.log("Campaign Data:", this.campaignReportService.getCampaignData());
          const totalSubmitted = this.campaignData?.campaignReport?.totalSubmitted || 0;
          const totalDelivered = this.campaignData?.campaignReport?.totalDelivered || 0;
          const totalFailed = this.campaignData?.campaignReport?.totalFailed || 0;
          const totalRejected = this.campaignData?.campaignReport?.totalRejected || 0;
          //const totalQueued = this.campaignData?.campaignReport?.totalQueued || 0;
          const totalRequest = this.campaignData?.campaignReport?.totalRequest || 0;
          const operatorTotalSubmitted =this.campaignData?.campaignReport?.operatorTotalSubmitted || 0;
          const uploadedNumbers= this.campaignData?.campaignReport?.uploadedNumbers || 0;

          
         
            this.complitionPercentage = totalRequest > 0 
            ? Math.min(parseFloat(((totalSubmitted) /uploadedNumbers * 100).toFixed(2)), 100)
            : 0;
            const submitted = totalSubmitted ?? 0;
            const operator = operatorTotalSubmitted ?? 0;
            const failed = totalFailed ?? 0;

          this.DLRawaited = Math.max(0, submitted - (operator + failed));
          // this.DLRawaited = totalSubmitted - (operatorTotalSubmitted + totalFailed);
          console.log("Total Request:", totalRequest);
          console.log("Completion Percentage:", this.complitionPercentage);
          this.loadTreeData();
          this.calculateDeliveryPercentage();
          this.calculateReadPercentage();
          this.calculateFailedPercentage()
          this.isLoading = false;
          this.loading=false
        },
        (error:any) => {
          this.isLoading = false;
          this.loading=false
          console.error("API Error:", error);
        }
      );

    // setTimeout(() => {  
    //    this.campaignReportService.getcampaignData(requestData).subscribe(
    //     (response: any) => {  
          
          
    //       // this.campaignReportService.setCampaignData(response.campaignInfo); 
    //       this.campaignData = response.campaignInfo;
    //       this.loading=false

          
    //     },
    //     (error:any) => {
          
    //       this.loading=false
    //     }
    //   );
    // },2000) 
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

  calculateDeliveryPercentage() {
    const totalRequest = this.campaignData?.campaignReport?.totalRequest || 0;
    const totalDelivered = this.campaignData?.campaignReport?.totalDelivered || 0;
    const totalQueued = this.campaignData?.campaignReport?.totalQueued || 0;
    console.log("Total Submitted:", this.campaignData?.campaignReport?.totalSubmitted, totalRequest);
    const totalSubmitted = this.campaignData?.campaignReport?.totalSubmitted || 0;
    this.deliveryPercentage = totalRequest > 0 
      ? parseFloat((((totalDelivered) /totalRequest) * 100).toFixed(2)) 
      : 0; // Avoid division by zero
  }


  calculateReadPercentage() {
    const totalRequest = this.campaignData?.campaignReport?.totalRequest || 0;
    const totalRead = this.campaignData?.campaignReport?.rcsMessageRead || 0;
  
    this.readPercentage = totalRequest > 0 
      ? parseFloat(((totalRead / totalRequest) * 100).toFixed(2)) 
      : 0; // Avoid division by zero
  }
  calculateFailedPercentage() {
    const totalRequest = this.campaignData?.campaignReport?.totalRequest || 0;
    const totalfail = this.campaignData?.campaignReport?.totalFailed|| 0;
  
    this.failedPercentage = totalRequest > 0 
      ? parseFloat(((totalfail / totalRequest) * 100).toFixed(2)) 
      : 0; // Avoid division by zero
  }
  formatDelivered(percent: number): string {
    return `Delivered ${percent}%`;
  }

  formatRead(percent: number): string {
    return `Read ${percent}%`;
  }

  
  loadTreeData() {
    const totalSubmitted = this.campaignData?.campaignReport?.totalSubmitted || 0;
    const rcsMessageDelivered = this.campaignData?.campaignReport?.totalDelivered || 0;
    const rcsMessageFailed=this.campaignData?.campaignReport?.totalFailed|| 0;
    const rcsMessageRead = this.campaignData?.campaignReport?.rcsMessageRead || 0;
    const totalResponses = this.campaignData?.campaignReport?.totalUserResponseReceived || 0;

    const totalUrlClicked = this.campaignData?.campaignReport?.vtUserInteractionResponseSummary?.totalUrlClicked || 0;
    const totalUniqueDialerOpened = this.campaignData?.campaignReport?.vtUserInteractionResponseSummary?.totalDialerOpened || 0;
    const totalReply = this.campaignData?.campaignReport?.vtUserInteractionResponseSummary?.totalReply || 0;
    const totalUniqueShareLocationClicked = this.campaignData?.campaignReport?.vtUserInteractionResponseSummary?.totalUniqueShareLocationClicked || 0;
    const totalViewLocationClicked = this.campaignData?.campaignReport?.vtUserInteractionResponseSummary?.totalViewLocationClicked || 0;
  
    const deliveryPercentage = totalSubmitted > 0 ? ((rcsMessageDelivered / totalSubmitted) * 100).toFixed(2) : 0;
    const readPercentage = totalSubmitted > 0 ? ((rcsMessageRead / totalSubmitted) * 100).toFixed(2) : 0;
    const failedPercentage=this.failedPercentage = totalSubmitted > 0 
    ? parseFloat(((rcsMessageFailed / totalSubmitted) * 100).toFixed(2)) 
    : 0;
  
    this.treeData = [
      {
        title: 'Total Messages Sent',
        key: '1',
        expanded: true,
        children: [
          {
            title: `RCS Messages Sent: ${totalSubmitted}`,
            key: '1-1',
            isLeaf: true
          },
          {
            title: `RCS Messages Delivered: ${rcsMessageDelivered} (${deliveryPercentage}%)`,
            key: '1-2',
            isLeaf: true
          },
          {
            title: `RCS Messages Read: ${rcsMessageRead} (${readPercentage}%)`,
            key: '1-3',
            isLeaf: true
          },
          {
            title: `RCS Messages Failed: ${rcsMessageFailed} (${failedPercentage}%)`,
            key: '1-4',
            isLeaf: true
          }
        ]
      },
      {
        title: 'Total User Responses Received',
        key: '2',
        expanded: true,
        children: [
          {
            title: `RCS User Responses Received: ${totalResponses}`,
            key: '2-1',
            isLeaf: true
          }
        ]
      },
      {
        title: 'User Interactions',
        key: '3',
        expanded: true,
        children: [
          {
            title: `URL: ${totalUrlClicked}`,
            key: '3-1',
            isLeaf: true
          },
          {
            title: `Dialer: ${totalUniqueDialerOpened}`,
            key: '3-2',
            isLeaf: true
          },
          {
            title: `Reply: ${totalReply}`,
            key: '3-3',
            isLeaf: true
          },
          {
            title: `Share Location: ${totalUniqueShareLocationClicked}`,
            key: '3-4',
            isLeaf: true
          },
          {
            title: `View Location: ${totalViewLocationClicked}`,
            key: '3-5',
            isLeaf: true
          }
        ]
      }
    ];
    




}

}



