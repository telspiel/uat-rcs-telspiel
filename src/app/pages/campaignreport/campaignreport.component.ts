import { Component } from '@angular/core';
import { NzProgressFormatter } from 'ng-zorro-antd/progress';
import { ActivatedRoute } from '@angular/router';
import { CampaignReportService } from 'src/app/service/campaign-report.service';


@Component({
  selector: 'app-campaignreport',
  templateUrl: './campaignreport.component.html',
  styleUrls: ['./campaignreport.component.scss']
})
export class CampaignreportComponent {
  fullCampaignData: any;
  campaignData: any;
  deliveryPercentage: number = 0;
  readPercentage: number = 0;
  treeData: { title: string; key: string; expanded: boolean; children: { title: string; key: string; isLeaf: boolean; }[]; }[] = [];

  // campaign = {
  //   name: '',
  //   templateName: '',
  //   botName: '',
  //   schedule: '',
  //   startDate: '',
  //   endDate: '',
  //   uploadedNumbers: '',
  //   validNumbers: '',
  //   invalidNumbers: '',
  //   duplicateNumbers: '',
  //   rcsDisabledNumbers: '',
  //   status: '',
  //   completionPercentage: '',
  //   messagesSent: '',
  //   delivered: '',
  //   read: '',
  // };

  // treeData = [
  //   {
  //     title: 'Total Messages Sent',
  //     key: '1',
  //     expanded: true,
  //     children: [
  //       {
  //         title: 'RCS Messages Sent: 3',
  //         key: '1-1',
  //         isLeaf: true
  //       },
  //       {
  //         title: 'RCS Messages Delivered: 3 (100%)',
  //         key: '1-2',
  //         isLeaf: true
  //       },
  //       {
  //         title: 'RCS Messages Read: 3 (100%)',
  //         key: '1-3',
  //         isLeaf: true
  //       }
  //     ]
  //   },
  //   {
  //     title: 'Total User Responses Received',
  //     key: '2',
  //     expanded: true,
  //     children: [
  //       {
  //         title: 'RCS User Responses Received: 0',
  //         key: '2-1',
  //         isLeaf: true
  //       }
  //     ]
  //   },
  //   {
  //     title: 'User Interactions',
  //     key: '3',
  //     expanded: true,
  //     children: [
  //       {
  //         title: 'URL: 0',
  //         key: '3-1',
  //         isLeaf: true
  //       },
  //       {
  //         title: 'Dialer: 0',
  //         key: '3-2',
  //         isLeaf: true
  //       },
  //       {
  //         title: 'Reply: 0',
  //         key: '3-3',
  //         isLeaf: true
  //       },
  //       {
  //         title: 'Share Location: 0',
  //         key: '3-4',
  //         isLeaf: true
  //       },
  //       {
  //         title: 'View Location: 0',
  //         key: '3-5',
  //         isLeaf: true
  //       }
  //     ]
  //   }
  // ];

  constructor(private campaignReportService: CampaignReportService,  private route: ActivatedRoute){

  }


  ngOnInit() {
    // Get data from the service
    this.campaignData = this.campaignReportService.getCampaignData();
  
    // If data is null, try to retrieve it from sessionStorage
    if (!this.campaignData) {
      const storedData = sessionStorage.getItem('campaignData');
      if (storedData) {
        this.campaignData = JSON.parse(storedData);
      } else {
        console.error("No campaign data available!");
        return; // Exit the function if no data is available
      }
    }
  
    console.log("Received in report component:", this.campaignData);
  
    // Convert date fields only if they exist
    if (this.campaignData.expiryDateTime) {
      this.campaignData.expiryDateTime = new Date(this.campaignData.expiryDateTime).toLocaleString();
    }
    if (this.campaignData.createdDate) {
      this.campaignData.createdDate = new Date(this.campaignData.createdDate).toLocaleString();
    }
    if (this.campaignData.campaignDate) {
      this.campaignData.campaignDate = new Date(this.campaignData.campaignDate).toLocaleString();
    }
  
    this.loadTreeData();
    this.calculateDeliveryPercentage();
    this.calculateReadPercentage();
  }
  

  calculateDeliveryPercentage() {
    const totalSubmitted = this.campaignData?.campaignReport?.totalSubmitted || 0;
    const totalDelivered = this.campaignData?.campaignReport?.totalDelivered || 0;
  
    this.deliveryPercentage = totalSubmitted > 0 
      ? (totalDelivered / totalSubmitted) * 100 
      : 0; // Avoid division by zero
  }


  calculateReadPercentage() {
    const totalSubmitted = this.campaignData?.campaignReport?.totalSubmitted || 0;
    const totalRead = this.campaignData?.campaignReport?.rcsMessageRead || 0;
  
    this.readPercentage = totalSubmitted > 0 
      ? (totalRead / totalSubmitted) * 100 
      : 0; // Avoid division by zero
  }
  

  // formatDelivered(): NzProgressFormatter {
  //   return (percent: number) => `Delivered: ${percent}%`;
  // }

  // formatRead(): NzProgressFormatter {
  //   return (percent: number) => `Delivered: ${percent}%`;
  // }

  formatDelivered(percent: number): string {
    return `Delivered ${percent}%`;
  }

  formatRead(percent: number): string {
    return `Read ${percent}%`;
  }


  loadTreeData() {
    const totalSubmitted = this.campaignData?.campaignReport?.totalSubmitted || 0;
    const rcsMessageDelivered = this.campaignData?.campaignReport?.totalDelivered || 0;
    const rcsMessageRead = this.campaignData?.campaignReport?.rcsMessageRead || 0;
    const totalResponses = this.campaignData?.campaignReport?.totalUserResponseReceived || 0;
    const totalUrlClicked = this.campaignData?.campaignReport?.vtUserInteractionResponseSummary?.totalUrlClicked || 0;
    const totalUniqueDialerOpened = this.campaignData?.campaignReport?.vtUserInteractionResponseSummary?.totalUniqueDialerOpened || 0;
    const totalReply = this.campaignData?.campaignReport?.vtUserInteractionResponseSummary?.totalReply || 0;
    const totalUniqueShareLocationClicked = this.campaignData?.campaignReport?.vtUserInteractionResponseSummary?.totalUniqueShareLocationClicked || 0;
    const totalViewLocationClicked = this.campaignData?.campaignReport?.vtUserInteractionResponseSummary?.totalViewLocationClicked || 0;
  
    const deliveryPercentage = totalSubmitted > 0 ? ((rcsMessageDelivered / totalSubmitted) * 100).toFixed(2) : 0;
    const readPercentage = totalSubmitted > 0 ? ((rcsMessageRead / totalSubmitted) * 100).toFixed(2) : 0;
  
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



