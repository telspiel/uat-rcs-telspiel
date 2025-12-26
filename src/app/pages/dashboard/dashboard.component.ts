import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { DashboardStats, MessageHistory } from 'src/app/models/dashboard-count';
import { MessageContent, SendMessageHistory } from 'src/app/models/send-message-hook';
import { ExtractTemplateBodyPipe } from 'src/app/pipes/extract-template-body.pipe';
import { DashboardService } from 'src/app/service/dashboard.service';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { ReportService } from 'src/app/service/report.service';
import { BrandService } from 'src/app/service/brand.service';
import { TemplateService } from 'src/app/service/template-service.service';
import { CampaignService } from 'src/app/service/campaign.service';
import { BASE_URL } from 'src/app/config/app-config';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
 
  role: string =sessionStorage.getItem('ROLE')||"";

  selectedOption: string = 'brand'; 
  pageSize = 10;
  pageIndex = 1;
  campList:any
  totalRecords = 0;
  selectedCountry = "";
  selectedCarrier = "";
  // operatorTotalSubmitted = "";
  selectedBrand = "";
  selectedBotType = "";
  selectedBot = "All Bots";
  selectedTemplate = '';
  selectedCampaign = "";
  selectedListBy = "Date";
  selectedListBy1= "";
  startTime = new Date();
  endTime = new Date();
  listOfData: any
  data = []
  brand: any
  botSelected: any
  totalBasicMessages: any;
  totalRequest: any;
  totalReceived: any;
  totalSubmitted: any;
  totalRejected: any;
  totalDelivered: any;
  totalFailed: any;
  totalRead: any;
  totalExpired: any;
  deliveryRate: any;
  readRate: any;
  totalP2AMessages: any;
  operatorTotalSubmitted: any;
  totalAwaited: any;
  totalP2AResponses: any;
  p2AResponseRate: any;
  tableData: any[] = [];
  totalRichSms: any;
  totalRichOTP: any
  datesum: any;
  totalP2AConversation: any
  totalA2PConversation: any
  operatorfailed: any;
  totalA2PSingleMessages: any
  singleMessage: any;
  availableCredits: any;
  conversationMessage: any;
  allStatus: DashboardStats[] = []
  messageHistory: MessageHistory[] = []
  date = [new Date(), new Date()]
  bots: any
  timeRange: any;
  time: any
  totalQueued: any;
  loading = false;
  public pieChartData!: ChartData<'pie', number[], string | string[]>;
  public pieChartType: ChartType = 'pie';
  public pieChartPlugins = [DatalabelsPlugin];

  // Pie
  public pieChartOptions: any['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      datalabels: {
        formatter: (value: any, ctx: any) => {
          if (ctx.chart.data.labels) {
            return ctx.chart.data.labels[ctx.dataIndex];
          }
        },
      },
    },
  };

  constructor(private dashboardService: DashboardService,private capmser : CampaignService,
    private extractBody: ExtractTemplateBodyPipe, private reportService: ReportService, private brandservice: BrandService, private templateService: TemplateService) { 
      
    }

    receiveDataBot(event: any) {
      
      this.botSelected = event; // Receive data from child
    }
  
    receiveDataBrand(event: any) {
      this.selectedBrand=event
    }
    receiveDataTemplate(event: any) {
      this.selectedTemplate = event; // Receive data from child template dropdown
      console.log('Selected Template:', this.selectedTemplate);
    }
  ngOnInit() {

    this.onSearchClick();
     this.isGraphVisible = true;
    
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
    
    this.templateService.getallbotdetail({ "loggedInUserName": sessionStorage.getItem('USER_NAME') }).subscribe((res: any) => {
      this.bots = res.data.bots
    })
    this.brandservice.getAllbrandname({ "loggedInUserName": sessionStorage.getItem('USER_NAME') }).subscribe((res: any) => {
      this.brand = res.data.dataList
    })
    this.loading = true;
    let dt = {
      "loggedInUserName": sessionStorage.getItem('USER_NAME'),
      "fromDate": new Date(this.date[0]).toISOString().split('T')[0],
      "toDate": new Date(this.date[1]).toISOString().split('T')[0],
     
    }
    this.reportService.getSummaryReport(dt).subscribe((res: any) => {
      //console.log("xoxoxoxoxxoxoxox summary data", JSON.stringify(res.userSummaryReportList, null, 2));
      this.loading = false;
      // Map date properly
      this.tableData = res.userSummaryReportList.map((item: any) => {
        return {
          ...item,
          date: new Date(item.date)  // Convert timestamp to Date object
        };
        
      });
      
      // Now you can safely sum metrics etc
      this.totalRequest = this.sumMetric('totalRequest');
      this.totalQueued=this.sumMetric('countQueued');
      this.totalReceived = this.sumMetric('totalReceived');
      this.totalSubmitted = this.sumMetric('totalSubmitted');
      this.totalRejected = this.sumMetric('totalRejected');
      this.totalDelivered = this.sumMetric('totalDelivered');
      this.totalRichSms = this.sumMetric('totalRichSMS');
      this.totalFailed = this.sumMetric('totalFailed');
      this.totalRead = this.sumMetric('totalRead');
      this.totalExpired = this.sumMetric('totalExpired');
      this.deliveryRate = this.sumMetric('deliveryRate');
      this.readRate = this.sumMetric('readRate');
      this.totalP2AMessages = this.sumMetric('totalP2AMessages');
      this.operatorTotalSubmitted= this.sumMetric('operatorTotalSubmitted');
      this.totalAwaited = this.sumMetric('totalAwaited');
      this.totalP2AResponses = this.sumMetric('totalP2AResponses');
      this.p2AResponseRate = this.sumMetric('p2AResponseRate');
      this.totalBasicMessages = this.sumMetric('totalBasicMessages');
      this.totalA2PSingleMessages = this.sumMetric('totalA2PSingleMessages');
      this.totalA2PConversation = this.sumMetric('totalA2PConversation');
      this.totalP2AConversation = this.sumMetric('totalP2AConversation');
      this.totalRichOTP = this.sumMetric('totalRichOTP');
      this.datesum = this.sumMetric('datesum');
      
    });
    
  }

downloadCSV(): void {
  const loggedInUserName = sessionStorage.getItem("USER_NAME");
  const token = sessionStorage.getItem("TOKEN");
  const botName = this.botSelected;

  // Validate token
  if (!token) {
    console.error('No authentication token found in sessionStorage');
    return;
  }

  // Format dates to YYYY-MM-DD
  const formatDate = (date: Date | string): string => {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      throw new Error(`Invalid date: ${date}`);
    }
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  let fromDate, toDate;
  try {
    if (!this.date || !this.date[0] || !this.date[1]) {
      throw new Error('Date range is not defined');
    }
    fromDate = formatDate(this.date[0]);
    toDate = formatDate(this.date[1]);
  } catch (error) {
    console.error('Date formatting error:', error);
    return;
  }

  // Construct URL with encoded parameters
  const url = `${BASE_URL}/rcs-reseller-service/downloadBillingReport?fromDate=${fromDate}&toDate=${toDate}&botName=${encodeURIComponent(botName)}&listBy=${this.selectedOption}&loggedInUserName=${encodeURIComponent(loggedInUserName || '')}`;

  fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'text/csv',
      'Authorization': `${token}`
    }
  })
    .then(response => {
      // Log headers using forEach (TypeScript-safe)
      console.log('Response Headers:');
      response.headers.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      // Log status and check if response is OK
      console.log('Response Status:', response.status, response.statusText);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Get the filename from Content-Disposition header, if available
      let filename = 'Billing_Report.csv';
      const disposition = response.headers.get('Content-Disposition');
      if (disposition && disposition.includes('attachment')) {
        const matches = disposition.match(/filename="([^"]+)"/);
        if (matches && matches[1]) {
          filename = matches[1];
        }
      }

      // Return the response body as a blob and the filename
      return response.blob().then(blob => ({ blob, filename }));
    })
    .then(({ blob, filename }) => {
      console.log('Response Blob:', blob);
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    })
    .catch(error => {
      console.error('Error downloading CSV:', error);
    });
}

// Downloadtraffic(): void {
//   const loggedInUserName = sessionStorage.getItem("USER_NAME");
//   const token = sessionStorage.getItem("TOKEN");
//   const botName = this.botSelected;

//   // Validate token
//   if (!token) {
//     console.error('No authentication token found in sessionStorage');
//     return;
//   }

//   // Format dates to YYYY-MM-DD
//   const formatDate = (date: Date | string): string => {
//     const d = new Date(date);
//     if (isNaN(d.getTime())) {
//       throw new Error(`Invalid date: ${date}`);
//     }
//     const year = d.getFullYear();
//     const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
//     const day = String(d.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   };

//   let fromDate, toDate;
//   try {
//     if (!this.date || !this.date[0] || !this.date[1]) {
//       throw new Error('Date range is not defined');
//     }
//     fromDate = formatDate(this.date[0]);
//     toDate = formatDate(this.date[1]);
//   } catch (error) {
//     console.error('Date formatting error:', error);
//     return;
//   }

//   // Construct URL with encoded parameters
//   let queryParams = `?fromDate=${fromDate}&toDate=${toDate}&botName=${encodeURIComponent(botName)}&listBy=${this.selectedOption}&loggedInUserName=${encodeURIComponent(loggedInUserName || '')}`;
//   if (this.selectedCampaign) {
//     queryParams += `&campaignName=${encodeURIComponent(this.selectedCampaign)}`;
//   }
//   if (this.selectedTemplate) {
//     queryParams += `&templateName=${encodeURIComponent(this.selectedTemplate)}`;
//   }
//   if (this.selectedListBy1) {
//     queryParams += `&messageType=${encodeURIComponent(this.selectedListBy1)}`;
//   }

//   const url = `${BASE_URL}/rcs-reseller-service/downloadTrafficReport${queryParams}`;

//   fetch(url, {
//     method: 'GET',
//     headers: {
//       'Accept': 'text/csv',
//       'Authorization': `${token}`
//     }
//   })
//     .then(response => {
//       // Log headers using forEach (TypeScript-safe)
//       console.log('Response Headers:');
//       response.headers.forEach((value, key) => {
//         console.log(`${key}: ${value}`);
//       });

//       // Log status and check if response is OK
//       console.log('Response Status:', response.status, response.statusText);
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       // Get the filename from Content-Disposition header, if available
//       let filename = 'Traffic_Report.csv';
//       const disposition = response.headers.get('Content-Disposition');
//       if (disposition && disposition.includes('attachment')) {
//         const matches = disposition.match(/filename="([^"]+)"/);
//         if (matches && matches[1]) {
//           filename = matches[1];
//         }
//       }

//       // Return the response body as a blob and the filename
//       return response.blob().then(blob => ({ blob, filename }));
//     })
//     .then(({ blob, filename }) => {
//       console.log('Response Blob:', blob);
//       const blobUrl = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = blobUrl;
//       a.download = filename;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       window.URL.revokeObjectURL(blobUrl);
//     })
//     .catch(error => {
//       console.error('Error downloading CSV:', error);
//     });
// }

Downloadtraffic(): void {
  if (!this.tableData || this.tableData.length === 0) {
    alert("No Data Available For Download");
    return;
  }

  // Convert table data to CSV
  const csvRows: string[] = [];

  // Prepare headings dynamically
  const headers = [];

  if (this.selectedOption === 'bot') headers.push('Bot');
  if (this.selectedOption === 'brand') headers.push('Brand Name');
  if (this.selectedOption === 'template') headers.push('Template Name');
  if (this.selectedOption === 'campaign') headers.push('Campaign Name');

  if (this.role === 'admin' || this.role === 'reseller') headers.push('User Name');

  headers.push(
    'Summary Date',
    'Total Request',
    'Message Submitted',
    'Messages Delivered',
    'Messages Read',
    'Failed/RCS Disabled',
    'Revoked/Expired',
    'Messages Awaited'
  );

  csvRows.push(headers.join(','));

  // Iterate over table data
  this.tableData.forEach(item => {
    const awaited =
      ((item.totalSubmitted || 0) -
        ((item.totalDelivered || 0) + (item.totalFailed || 0))) > 0
        ? ((item.totalSubmitted || 0) -
          ((item.totalDelivered || 0) + (item.totalFailed || 0)))
        : 0;

    let row = [];

    if (this.selectedOption === 'bot') row.push(item.botName);
    if (this.selectedOption === 'brand') row.push(item.brandName);
    if (this.selectedOption === 'template') row.push(item.templateName);
    if (this.selectedOption === 'campaign') row.push(item.campaignName);

    if (this.role === 'admin' || this.role === 'reseller') row.push(item.userName || '-');

    row.push(
      item.summaryDate || '0',
      item.totalRequest || '0',
      item.totalSubmitted || '0',
      item.totalDelivered || '0',
      item.totalRead || '0',
      item.totalFailed || '0',
      item.totalExpired || '0',
      awaited
    );

    csvRows.push(row.join(','));
  });

  // Convert CSV array to string
  const csvString = csvRows.join('\n');

  // Convert to blob for download
  const blob = new Blob([csvString], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);

  // Trigger download
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Traffic_Report.csv';
  a.click();

  window.URL.revokeObjectURL(url);
}


// ===========================================================================

  onChange() {
    
    const fromDate = this.date[0];
    const toDate = this.date[1];
  
    const requestData = {
      loggedInUserName: sessionStorage.getItem('USER_NAME'),
      fromDate: fromDate,
      toDate: toDate
    };
  
    this.capmser.campaignReport(requestData).subscribe(
      (response: any) => {
        if (response?.campaignInfoList && Array.isArray(response.campaignInfoList)) {
          // Format the dates here for display
          this.campList = response.campaignInfoList.map((item: any) => ({
            ...item,
            formattedDate: new Date(item.date).toLocaleString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })
          }));
          console.log(this.campList);
        }
      },
      (error) => {
        // handle error if needed
      }
    );
  }
  
  onListByChange() {
    this.onSearchClick()
  }

  onSearchClick() {
    this.loading = true;
    let dt = {
      "loggedInUserName": sessionStorage.getItem('USER_NAME'),
      "fromDate": new Date(this.date[0]).toISOString().split('T')[0],
      "toDate": new Date(this.date[1]).toISOString().split('T')[0],
      "botName": this.botSelected,
      "templateName":this.selectedTemplate,
      "campaignName":this.selectedCampaign,
      "listBy": this.selectedOption
      // "brandName":this.selectedBrand,

    }
    this.reportService.getSummaryReport(dt).subscribe((res: any) => {
      this.loading = false;
      //const data=res.userSummaryReportList
      this.tableData = res.userSummaryReportList;
      this.totalRequest = this.sumMetric('totalRequest');
      this.totalQueued=this.sumMetric('countQueued');
      this.totalReceived = this.sumMetric('totalReceived');
      this.totalSubmitted = this.sumMetric('totalSubmitted');
      this.totalRejected = this.sumMetric('totalRejected');
      this.totalDelivered = this.sumMetric('totalDelivered');
      this.totalRichSms = this.sumMetric('totalRichSMS');
      this.totalFailed = this.sumMetric('totalFailed')
      this.totalRead = this.sumMetric('totalRead');
      this.totalExpired = this.sumMetric('totalExpired');
      this.deliveryRate = this.sumMetric('deliveryRate');
      this.readRate = this.sumMetric('readRate');
      this.totalP2AMessages = this.sumMetric('totalP2AMessages');
      this.operatorTotalSubmitted = this.sumMetric('operatorTotalSubmitted');
      this.totalAwaited = this.sumMetric('totalAwaited');
      this.totalP2AResponses = this.sumMetric('totalP2AResponses');
      this.p2AResponseRate = this.sumMetric('p2AResponseRate');
      this.totalBasicMessages = this.sumMetric('totalBasicMessages');
      this.totalA2PSingleMessages = this.sumMetric('totalA2PSingleMessages');
      this.totalA2PConversation = this.sumMetric('totalA2PConversation');
      this.totalP2AConversation = this.sumMetric('totalP2AConversation');
      this.totalRichOTP = this.sumMetric('totalRichOTP');
      this.operatorfailed = this.sumMetric('operatorfailed')

      if (this.isGraphVisible) {
        setTimeout(() => this.initChart(), 0);
      } 

    }); 
  }

  private sumMetric(metricName: string): number {
    return this.tableData?.reduce((sum, item) => sum + (Number(item[metricName]) || 0), 0) || 0;
  }
  convertTimestampToTime(timestamp: number): string {

    const date = new Date(timestamp); // Assuming the timestamp is already in milliseconds
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const amPm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12; // Convert 24h to 12h format

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }
sortFnDateTime = (a: any, b: any) => new Date(a.id.date).getTime() - new Date(b.id.date).getTime();
sortFnMessagesSubmitted = (a: any, b: any) => (a.userName || 0) - (b.userName || 0);
sortFnUserName = (a: any, b: any) => (a.totalSubmitted || 0) - (b.totalSubmitted || 0);
sortFnMessagesDelivered = (a: any, b: any) => (a.totalDelivered || 0) - (b.totalDelivered || 0);
sortFnMessagesRead = (a: any, b: any) => (a.totalRead || 0) - (b.totalRead || 0);
sortFnMessagesFailed = (a: any, b: any) => (a.totalFailed || 0) - (b.totalFailed || 0);
sortFnRevokedExpired = (a: any, b: any) => (a.totalExpired || 0) - (b.totalExpired || 0);
sortFnDeliveryRate = (a: any, b: any) => (a.deliveryRate || 0) - (b.deliveryRate || 0);
sortFnReadRate = (a: any, b: any) => (a.readRate || 0) - (b.readRate || 0);
sortFnP2AResponses = (a: any, b: any) => (a.totalP2AResponses || 0) - (b.totalP2AResponses || 0);
sortFnP2AResponseRate = (a: any, b: any) => (a.p2AResponseRate || 0) - (b.p2AResponseRate || 0);
sortFnP2AMessages = (a: any, b: any) => (a.totalP2AMessages || 0) - (b.totalP2AMessages || 0);
sortFnP2operator= (a: any, b: any) => (a.operatorTotalSubmitted || 0) - (b.operatorTotalSubmitted || 0);

sortFnP2Awaited = (a: any, b: any): number => {
  const getAwaited = (row: any) => {
    const total = row.totalSubmitted || 0;
    const operator = row.operatorTotalSubmitted || 0;
    const failed = row.totalFailed || 0;
    return Math.max(0, total - (operator + failed));
  };
  return getAwaited(a) - getAwaited(b);
};


getDLRAwaited(): number {
  if (!this.tableData || this.tableData.length === 0) return 0;

  let totalSubmitted = 0;
  let totalFailed = 0;
  let totalOperatorSubmitted = 0;

  this.tableData.forEach(row => {
    totalSubmitted += row.totalSubmitted || 0;
    totalFailed += row.totalFailed || 0;
    totalOperatorSubmitted += row.operatorTotalSubmitted || 0;
  });

  const awaited = totalSubmitted - (totalFailed + totalOperatorSubmitted);
  return awaited > 0 ? awaited : 0;
}

// =============================================================================================

isGraphVisible = true;
isDashboardVisible = false;
isDashboardTableVisible = false;
 

chart: any;

ngAfterViewInit() {
  this.initChart();
}

showGraph() {
  this.isGraphVisible = true;
  this.isDashboardVisible = false;
  this.isDashboardTableVisible = false;
  setTimeout(() => {
    this.initChart(); 
  }, 0);
}

showDashboard() {
  this.isGraphVisible = false;
  this.isDashboardVisible = true;
  this.isDashboardTableVisible = false;
}

showDashboardTable() {
  this.isGraphVisible = false;
  this.isDashboardVisible = false;
  this.isDashboardTableVisible = true;
}

initChart() {
  const ctx: any = document.getElementById('summaryBarChart');
  if (!ctx) return;

  if (this.chart) this.chart.destroy();

  this.chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [
        'Basic Message',
        'Rich SMS',
        'A2P Single Message',
        'A2P Conversation',
        'P2A Conversation',
        'Rich OTP',
      ],
      datasets: [
        {
          label: 'Count',
          data: [
            this.totalBasicMessages,
            this.totalRichSms,
            this.totalA2PSingleMessages,
            this.totalA2PConversation,
            this.totalP2AConversation,
            this.totalRichOTP,
          ],
          backgroundColor: [
            '#13c2c2',
            '#1890ff',
            '#52c41a',
            '#faad14',
            '#eb2f96',
            '#722ed1',
          ]
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}


// ==============================================================================================






}

