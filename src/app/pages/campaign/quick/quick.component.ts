import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { error, get } from 'jquery';
import { differenceInCalendarDays } from 'date-fns';
import { Router } from '@angular/router';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { CampaignService } from 'src/app/service/campaign.service';
import { ReportService } from 'src/app/service/report.service';
import { TemplateService } from 'src/app/service/template-service.service';
import { ToastService } from 'src/app/shared/toast-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { from } from 'rxjs';
import { CampaignReportService } from 'src/app/service/campaign-report.service';
import { UserCreationService } from 'src/app/service/user-creation.service';


@Component({
  selector: 'app-quick',
  templateUrl: './quick.component.html',
  styleUrls: ['./quick.component.scss']
})
export class QuickComponent {
dateRange: string[] = [this.formatDate(new Date()), this.formatDate(new Date())];

role: string = (sessionStorage.getItem('ROLE') || '');
pageTitle: string = '';
campaignRunningStatus: string = 'COMPLETE';
today = new Date();
day = this.today.getDate();
month = this.today.getMonth() + 1;
year = this.today.getFullYear();
botss : any;
 Reseller=""
  Seller=""
   Admin=""
  Client=""
  SellerList: { label: string; value: unknown; }[] | undefined;
  Adminlist: { label: string; value: unknown; }[] | undefined;
  Clientlist: { label: string; value: unknown; }[] | undefined;
  ResllerList: { label: string; value: unknown; }[] | undefined;
botId:string =""
messageTemplate : any;
selectedBotId12: boolean = false;
selecttemplate:boolean = false;
pageSize = 10;
pageIndex = 1;
totalRecords = 0;
// listOfData: any[] = [];
selectedbotid : any ;
messagetype="transactional";
fileList: any[] = [];
originalCampaignList: any[] = [];
uploading = false;
shortUrlSelected="N"
visible = false;
shortuploadss = "no";
quickObj : any;
  userCreation = inject(UserCreationService)
  userdt: { loggedInUsername: string | null; userId: string | null; } | undefined;
bulkCampaignObj : any;
date: any;
columnHeaders : any ;
quickUpload : any;
scheduleMessage = "no";
splitFile = "no";
numberprivew : any ;
capabilities: any[] = [];
mssageprivew : any;
previewUrl: string | null = null;
imageUrl: SafeUrl | null = null;
backgroundUrl: SafeUrl | null = null;
uploadedFileSize: string | null = null;
uploadedFileUrl: string | null = null;
orientation = 'vertical';
listOfData: any[] = [];
filteredData: any[] = [];
campaignInfoList: any[] = [];
isLoading: boolean = false;
imageHeight = 120;
loadingCampaignName=''

transformedData: any;

phoneControl = new FormControl('');

templateForm = this.fb.group({
  name: [''],
  templateContentType: [''],
  type: ['rich_card'],
  cardOrientation: [''],
  height: ['short'],
  imagevideo: [''],
  cardTitle: [''],
  cardDescription: [''],
  fallback: ['no'],
  sugesstiontype: ['Reply'],
  Suggestiontext: [''],
  SuggestionPostback: [''],
  fallbackText: [''],
  messagecontent: [''],
  messageOrder: ['textTop'],
  messageBody: [null, [Validators.required, Validators.maxLength(2000)]],
  pdfFile: [null, Validators.required],
  width: ['short'],
  selectcardallignment: ['short'],
  URL:[''],
  query:[''],
  Longitude:[''],
  Latitude:[''],
  Label:[''],
  phonenumberdial:[''],
  date:[''],
  event:[''],
  Description:[''],
});
checkcapabilityform = this.fb.group({
  Mobile_Number: [''],
});
selectedFile: File | null = null;
quickCampaign: FormGroup;
cardTitle: any;
dates: Date[] = [];
carddescription: any;
Suggestiontext: any;
messagecontent: any;
searchValue: any;
// uploading =false
splitPartForm:FormGroup;
// filteredData = [...this.listOfData];
  fileType: any;

  uploadCampaignForm: any;
  sessionStorage: any;
  uploadedFileName: any;
  bulkupload:any =[]
  listOfCampaigns: any[] = [];
  minutesList: string[]=[];
disabledDate: ((d: Date) => boolean)|undefined;
timeDefaultValue: Date|undefined;




   constructor(private fb: FormBuilder ,
    private http: HttpClient,
    private capmser : CampaignService,
    private toastService: ToastService ,  
    private temp : TemplateService ,
    private reportService: ReportService,
    private campaignReportService: CampaignReportService,
     private cdr: ChangeDetectorRef,
    private router: Router)  {
    // this.myForm = this.fb.group({
    //   timeSlots: this.fb.array([]) 
    // });

 
    this.splitPartForm = this.fb.group({
      splitPart: this.fb.array([])
    });
    
    this.addSplitPart(true)
     
     this.quickCampaign=this.fb.group({
      campaignName:[""],
      mobilenumbers:["" ] ,
      newmobilenumbers : [""],
      shortupload:[this.shortuploadss],
      messageType:[this.messagetype , [Validators.required] ],
      fileType:[""],
      uploadfile:[""],
      serviceType:[""],
      forMobilenumbers : [""],
      senderId:[""],
      botIds:[""],
      templateName:[""],
      messageEncoding:["plainText"],
      messagePart:["singlePart"],
      messageText:[""],
      shortUrlSelected:[this.shortUrlSelected],
      shortURLName:[""],
      entityID:[""],
      scheduleMessage:[this.scheduleMessage],
      splitFile :[this.splitFile],
      operatorTemplateId:[""],
      datepicker:[""],
      selectedTemplate:[""],  
     })
   }



   get splitPartArray(): FormArray {
    return this.splitPartForm.get('splitPart') as FormArray;
  }
  


  createSplitPart(): FormGroup {
    return this.fb.group({
      id: [this.splitPartArray.length, Validators.required], // Assigns dynamic ID
      from: ['', Validators.required],
      to: ['', Validators.required],
      hh: ['', Validators.required],
      mm: ['', Validators.required]
    });
  }

  addSplitPart(isDefault = false) {
    if (isDefault && this.splitPartArray.length === 0) {
      this.splitPartArray.push(this.createSplitPart()); // Add first entry
    } else {
      this.splitPartArray.push(this.createSplitPart()); // Add new entry
    }
  }

  removeSplitPart(index: number) {
    this.splitPartArray.removeAt(index);
    this.updateIds(); // ✅ Ensure IDs are updated after removal
  }

  // ✅ Update IDs dynamically after deletion
  updateIds() {
    this.splitPartArray.controls.forEach((control, index) => {
      control.get('id')?.setValue(index + 1);
    });
  }


    onChange(type:string){
    if(type=='reseller')
      {
        this.Admin=""
        this.Seller = ""
        this.Client = ""
        
      }
      else if(type=='seller'){
        this.Reseller = ""
        this.Client = ""
        this.Admin=""
        
      }
      else if (type=='client'){
        this.Reseller = ""
        this.Seller = ""
        this.Admin=""
        
      }
      else if (type=='admin'){
        this.Reseller = ""
        this.Seller = ""
        this.Client = ""
        
      }
     
  }
  onDateChange(dates: Date[]): void {
  this.dates = dates;  
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
search() {
  const today = this.formatDate(new Date());
  const fromDate = this.dates?.[0] ? this.formatDate(this.dates[0]) : today;
  const toDate = this.dates?.[1] ? this.formatDate(this.dates[1]) : today;

  let adminName = "";
  let clientName = "";
  let resellerName = "";
  let sellerName = "";

  // Determine label names for UI, fallback to ID for API
  if (this.role === 'admin' && this.Admin && this.Adminlist?.length) {
    const admin = this.Adminlist.find(x => x.value === this.Admin);
    adminName = admin?.label || "";
  }

  if (this.role === 'client' && this.Client && this.Clientlist?.length) {
    const client = this.Clientlist.find(x => x.value === this.Client);
    clientName = client?.label || "";
  }

  if (this.role === 'reseller' && this.Reseller && this.ResllerList?.length) {
    const reseller = this.ResllerList.find(x => x.value === this.Reseller);
    resellerName = reseller?.label || "";
  }

  if (this.role === 'seller' && this.Seller && this.SellerList?.length) {
    const seller = this.SellerList.find(x => x.value === this.Seller);
    sellerName = seller?.label || "";
  }

  const requestData: any = {
    loggedInUserName: sessionStorage.getItem('USER_NAME'),
    fromDate,
    toDate,
    adminName,
    clientName,
    resellerName,
    sellerName,
   campaignRunningStatus: this.campaignRunningStatus,
    pageNumber: this.pageIndex // pass correct page number
  };

  // Send IDs to backend
  if (this.Admin) requestData.adminName = this.Admin;
  if (this.Client) requestData.clientName = this.Client;
  if (this.Reseller) requestData.resellerName = this.Reseller;
  if (this.Seller) requestData.sellerName = this.Seller;

  console.log("API Request:", requestData);

  this.capmser.getstatusreport(requestData).subscribe(
    (response: any) => {
      console.log("API Response:", response);
      this.campaignReportService.setCampaignData(response);

      if (response?.campaignInfoList && Array.isArray(response.campaignInfoList)) {
        this.processCampaignData(response.campaignInfoList);
      } else {
        this.processCampaignData([]);
      }
    },
    (error) => {
      console.error("API Error:", error);
    }
  );
}


downloadallreport() {
  const today = this.formatDate(new Date());
  const fromDate = this.dates?.[0] ? this.formatDate(this.dates[0]) : today;
  const toDate = this.dates?.[1] ? this.formatDate(this.dates[1]) : today;

  let adminName = "";
  let clientName = "";
  let resellerName = "";
  let sellerName = "";

  if (this.role === 'admin' && this.Admin && this.Adminlist?.length) {
    const admin = this.Adminlist.find(x => x.value === this.Admin);
    adminName = admin?.label || "";
  }
  if (this.role === 'client' && this.Client && this.Clientlist?.length) {
    const client = this.Clientlist.find(x => x.value === this.Client);
    clientName = client?.label || "";
  }
  if (this.role === 'reseller' && this.Reseller && this.ResllerList?.length) {
    const reseller = this.ResllerList.find(x => x.value === this.Reseller);
    resellerName = reseller?.label || "";
  }
  if (this.role === 'seller' && this.Seller && this.SellerList?.length) {
    const seller = this.SellerList.find(x => x.value === this.Seller);
    sellerName = seller?.label || "";
  }

  const requestData: any = {
    loggedInUserName: sessionStorage.getItem('USER_NAME'),
    fromDate,
    toDate,
    adminName,
    clientName,
    resellerName,
    sellerName
  };

  if (this.Admin) requestData.adminName = this.Admin;
  if (this.Client) requestData.clientName = this.Client;
  if (this.Reseller) requestData.resellerName = this.Reseller;
  if (this.Seller) requestData.sellerName = this.Seller;

  console.log("API Request:", requestData);

  this.capmser.downlodallrepot(requestData).subscribe(
    (response: Blob) => {
      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Campaign_Report_${this.formatDate(new Date())}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
    error => {
      console.error("Download failed:", error);
    }
  );
}




  downloadReport(campaignName: string,time:string){
    this.isLoading=true
    this.loadingCampaignName=campaignName
    this.capmser.downlodrepot(campaignName).subscribe(
      (response: Blob) => {
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${campaignName}-${time}-Detail_Report.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.isLoading=false
      }
    )
  }
   ngOnInit() {
    this.campreport();
const role: string = (sessionStorage.getItem('ROLE') || '').toLowerCase();

  if (role === 'client') {
    this.pageTitle = 'Campaign';
  } else if (['admin', 'seller', 'reseller'].includes(role)) {
    this.pageTitle = 'Campaign-Report';
  } else {
    this.pageTitle = 'Campaign'; // default fallback
  }

    this.getOptions();

    
    //this.loadCampaignData();
    //this.listOfCampaigns = this.campaignReportService.getAllCampaigns(); 

  
  
  }
   sortByuserName = (a: any, b: any) => a.userName.localeCompare(b.userName);
  sortByCampaignName = (a: any, b: any) => a.campaignName.localeCompare(b.campaignName);
  sortByRunTime = (a: any, b: any) => new Date(a.runTime).getTime() - new Date(b.runTime).getTime();
  sortByBotName = (a: any, b: any) => a.botName.localeCompare(b.botName);
  sortByTemplateCode = (a: any, b: any) => a.templateCode.localeCompare(b.templateCode);
  sortByTargetAudience = (a: any, b: any) => a.targetAudience - b.targetAudience;
  sortByUploadedNumbers= (a: any, b: any)=> a.uploadedNumbers - b.uploadedNumbers;


campreport(){
      const fromDate = this.dateRange[0]
    const toDate = this.dateRange[1];
    const requestData = {
      loggedInUserName: sessionStorage.getItem('USER_NAME'),
      fromDate: fromDate,
      toDate: toDate
    };
    this.capmser.campaignReport(requestData).subscribe(
        (response: any) => {  
          console.log("API Response:", response);
          this.campaignReportService.setCampaignData(response); 
          if (response?.campaignInfoList && Array.isArray(response.campaignInfoList)) {
            this.processCampaignData(response.campaignInfoList);
          } else {
            console.warn("No valid campaignInfoList found in response");
            this.processCampaignData([]); 
          }
        },
        (error) => {
          console.error("API Error:", error);
        }
      );
}


  loadCampaignData(): void {
    const storedData = this.campaignReportService.getCampaignData();
    if (storedData && storedData.campaignInfoList) {
      this.processCampaignData(storedData.campaignInfoList);
    }
  }
  handleSelection(event: any) {
    this.Admin = event.admin || '';
    this.Client = event.client || '';
    this.Reseller = event.reseller || '';
    this.Seller = event.seller || '';
  }
  processCampaignData(campaignInfoList: any): void {
    // Keep the original data
    this.originalCampaignList = campaignInfoList;
  
    // Create display data with formatted fields
    this.listOfData = campaignInfoList.map((campaign:any) => ({
      ...campaign, // Spread original campaign object
      runTime: campaign.campaignDate,
      templateCode: campaign.templateName || "N/A",
      status: campaign.campaignReport?.campaignStatus || "Pending",
      targetAudience: campaign.campaignReport?.uploadedNumbers || 0,
      uploadedNumbers: campaign.campaignReport?.uploadedNumbers || 0,

    }));
  
    this.filteredData = [...this.listOfData];
  }
  
  viewReport(selectedCampaign: any, event: Event): void {
    // event.preventDefault();
  
    // // Find the full campaign in the ORIGINAL data list
    // const specificCampaign = this.originalCampaignList.find(
    //   (campaign) => campaign.campaignName === selectedCampaign.campaignName
    // );
  
    // if (specificCampaign) {
    //   // Clear previous data before storing the new one
    //   this.campaignReportService.clearCampaignData();
  
    //   // Store new campaign data
    //   //this.campaignReportService.setCampaignData(specificCampaign);
  
    //   // Navigate to campreport
    //   console.log("Sending to report:", specificCampaign);
    //   this.router.navigate(['/campreport', specificCampaign.campaignName]);
    // } else {
    //   console.error("Campaign not found in original data");
    // }
  }
  
  
  





  formatDateTime(timestamp: number): string {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }


  private formatDate(date: Date): string {
    return date.getFullYear() + '-' + 
           ('0' + (date.getMonth() + 1)).slice(-2) + '-' + 
           ('0' + date.getDate()).slice(-2);
  }



  searchTable() {
    this.filteredData = this.listOfData.filter(item =>
      item.campaignName.toLowerCase().includes(this.searchValue.toLowerCase())
    );
  }

  onBotSelect(id:any){
    this.selectedBotId12= true;
    const boted = this.botss.find((bot:any)=>bot.id === this.selectedbotid)
    console.log(id);
    let dte= {
      "loggedInUserName":sessionStorage.getItem('USER_NAME'),
      "botId":id

   }
   this.reportService.templatelist(dte).subscribe({
     //console.log(res);
      next:(res)=>{
        this.messageTemplate = res.data.templateList
      },
      error:(err)=>this.messageTemplate = []
    //  if (res.data && res.data.templateList) {
    //    this.messageTemplate = res.data.templateList; 
    //  } else {
    //    this.messageTemplate = []; 
    //  }
   });
  
  }


onNextClick() {
  this.pageIndex++;
  this.search(); // renamed from getdata() to search() for clarity
}

onPrevClick() {
  if (this.pageIndex > 1) {
    this.pageIndex--;
    this.search();
  }
}

  

   getStatus(controlName: string): 'error' | 'success'|  null {
    const control = this.quickCampaign.get(controlName);
    if (control?.touched && control?.invalid) {
      return 'error';
    }
    if (control?.valid) {
      return 'success';
    }
    return null;
  }

  selecttemp(event: any){
this.selecttemplate = true;
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };
  
  handleUpload(): void {
    let files = this.fileList?.[0];  
    if (!files) {
      console.log('No file selected.');
      return;
    }
    
    let formData: FormData = new FormData();
    formData.append('file', files);
    
    formData.append ('userName', sessionStorage.getItem('USER_NAME') || '');
    formData.append("fileType", this.quickCampaign.value.fileType);

    console.log('Calling API with formData:', formData);

    this.capmser.imUpload(formData).subscribe(
      (data : any) => {
        console.log('API Response:', data);
        if (data) {
          this.bulkupload=data.data.uploadedBulkfileName
          this.toastService.publishNotification("File Upload", "Successfully")
         
        }
  },
  (error: any) => {
      console.error('API Error:', error);
        
      
      }
    );
}













  
 






 
  onSubmit() {
   
    if(this.quickCampaign.value.shortupload==='no'  ){
    
    this.quickObj = 
    
      {
        loggedInUserName: sessionStorage.getItem('USER_NAME'),
    // //     // mobileNumber: "9818681689",
        mobileNumber : this.quickCampaign.value.mobilenumbers,
        botId: "1x0kiKmR0Sd1WJuU",
  
        msgType : this.quickCampaign.value.messageType,
  
        // templateCode: "TemplatePromo1",
        templateCode : this.quickCampaign.value.selectedTemplate,
        msgText:"Welcome to RCS chat!",
        // msgText :this.quickCampaign.value.messageText,
      }
      if(this.quickCampaign.valid)
        {
          console.log('sucess',this.quickCampaign.value)
          this.capmser.getCampaign(this.quickObj).subscribe(
           { next:(res)=>{this.toastService.publishNotification("success", res.message, "success")
            this.quickCampaign.reset();
           },
           error:(err)=>this.toastService.publishNotification("error",(err.error), "error")
          }
          )
          
        
         
        }
      
        else{
          console.log(this.quickCampaign.errors);
          this.quickCampaign.markAllAsTouched()
        }
      }
      



     else{
 
    {
      const selectedTemplate = this.quickCampaign.value.selectedTemplate || {};  // Ensure it's always an object

     

      {
      this.bulkCampaignObj = {
      // entityId :this.quickCampaign.value.entityID,
      // username: sessionStorage.getItem('USER_NAME'),
      // botId : this.quickCampaign.value.botIds,
      // templateCode: selectedTemplate.templateTitle || "",
      // campaignName : this.quickCampaign.value.campaignName,
      // serviceType : this.quickCampaign.value.serviceType,
      // dltTemplateId : selectedTemplate.templateId,
      // isShortUrlSelected : this.quickCampaign.value.shortUrlSelected,
      // msgPart : this.quickCampaign.value.messagePart,
      // msgText : this.quickCampaign.value.messageText,
      // msgType : this.quickCampaign.value.messageType,
      // perMsgCredit: 1 ,
      // shortUrlName : [this.quickCampaign.value.shortURLName],
      // scheduleMessage : this.quickCampaign.value.scheduleMessage,
      // uploadedBulkfileName: this.bulkupload,
      // // uploadedBulkfileName: [""],

      // scheduleInfo: this.splitPartForm.value,
      // splitFile: this.splitFile, 
        entityId:this.quickCampaign.value.entityID,
        username: sessionStorage.getItem('USER_NAME'),
        botId: this.quickCampaign.value.botIds,
        templateCode: selectedTemplate.templateTitle || "",
        campaignName: this.quickCampaign.value.campaignName,
        serviceType: this.quickCampaign.value.serviceType,
        dltTemplateId: selectedTemplate.templateId,
        isShortUrlSelected: this.quickCampaign.value.shortUrlSelected,
        msgPart: this.quickCampaign.value.messagePart,
        msgText: this.quickCampaign.value.messageText,
        msgType: this.quickCampaign.value.messageType,
        perMsgCredit: 1,
        shortUrlName: [this.quickCampaign.value.shortURLName],
        scheduleMessage: this.quickCampaign.value.scheduleMessage,
        uploadedBulkfileName: this.bulkupload,
        scheduleInfo: this.splitPartForm.value,
        splitFile: this.splitFile
    
      


    }
  }

    
    // if(this.quickCampaign.valid)
    {
      console.log('sucess',this.bulkCampaignObj)
      this.capmser.bulkCampaign(this.bulkCampaignObj).subscribe(
       { next:(res)=>{this.toastService.publishNotification("success", res.message, "success")
        this.quickCampaign.reset();
       },
       error:(err)=>this.toastService.publishNotification("Something Wrong",(err.error), "Try After Some time")
      }
      )
      
    
     
    // }
  
    // else{
    //   console.log(this.quickCampaign.errors);
    //   this.quickCampaign.markAllAsTouched()
    // }
  }
 
  }
 
  }
  
 
  }


  textData(event : any){
    this.numberprivew = event.target.value; 
  }
  messageData(events : any){
    this.mssageprivew = events.target.value;


  }
  
  formatMessageBody(text: string, limit: number = 26): string[] {
    if (!text) return [];
    
    // Split text into chunks of 'limit' characters, without breaking words
    const result: string[] = [];
    let index = 0;
    
    // Continue until all characters are processed
    while (index < text.length) {
      // Slice the string from the current index to the next 'limit' number of characters
      result.push(text.slice(index, index + limit));
      index += limit;
    }
    
    return result;
  }

  getBotId(){

  }

  checkcapability(){
    let dt = {
      loggedInUserName: sessionStorage.getItem('USER_NAME'),
      number:this.checkcapabilityform.value.Mobile_Number,
      botId :"1x0kiKmR0Sd1WJuU"
  
    }
    this.capmser.checkcapability(dt).subscribe({
      next: (res) => {
        this.toastService.publishNotification("success", res.message, "success");
        this.quickCampaign.reset();
  
        // Initialize capabilities array
        this.capabilities = [];
  
        // Check if response contains data
        if (res.data && res.data.response) {
          try {
            // Fix the incorrectly formatted JSON string
            let fixedJsonString = res.data.response.replace(/"{/g, '{').replace(/}"/g, '}').replace(/\\"/g, '"');
  
            // Parse JSON correctly
            let parsedResponse = JSON.parse(fixedJsonString);
  
            // Extract features array
            this.capabilities = parsedResponse.features || [];
          } catch (e) {
            console.error("Error parsing response:", e);
          }
        }
      },
      error: (err) =>
        this.toastService.publishNotification("error", err.error.error, "error")
    });
  }
  
  
  // disabledDate = (current: Date): boolean => differenceInCalendarDays(current, this.today) <= 0;
  //   get timeSlots(): FormArray {
  //     return this.myForm.get('timeSlots') as FormArray;
  //   }
  



isMoreThanFiveMinutesFromNow(campaignDate: number): boolean {
  if (!campaignDate) return false;

  const now = Date.now(); // current time in milliseconds
  const fiveMinutesLater = now + 5 * 60 * 1000;

  return campaignDate >= fiveMinutesLater;
}


  updatetemplate( campaignName: any){
  console.log("Update for campaign name :"+campaignName);
  const payload = {
    campaignName: campaignName,
    username: sessionStorage.getItem('USER_NAME'),
  };
  this.capmser.deletecampaign(payload).subscribe(
    (response) => {
      console.log("Update campaign response", response);
      this.toastService.publishNotification('success', response.message, 'success');
      this.cdr.detectChanges();
      this.campreport();
    },
    (error) => {
      this.toastService.publishNotification('error', 'Failed to update template');
      console.error('Error updating template:', error);
    }
  );
  }

cancel(){

}

applyFilteractive(): void {
  if (!this.filteredData) return;

  switch (this.campaignRunningStatus) {
    case 'Active':
      this.filteredData = this.filteredData.filter(
        (t: any) => t.template?.isActive === true
      );
      break;
    case 'Inactive':
      this.filteredData = this.filteredData.filter(
        (t: any) => t.template?.isActive === false
      );
      break;
    default:
      this.filteredData = [...this.filteredData];
  }

  this.cdr.detectChanges();
}

}