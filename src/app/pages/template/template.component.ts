import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ToastService } from 'src/app/shared/toast-service.service';
import { TemplateMessageService } from 'src/app/service/template-message.service';
import { TemplateService } from 'src/app/service/template-service.service';
import { SEND_TEMPLATE_MODEL, TEMPLATES, TEMPLATE_RESPONSE } from 'src/app/models/templateModel';
import { NzCarouselComponent } from 'ng-zorro-antd/carousel';
import { ReportService } from 'src/app/service/report.service';
import { BrandService } from 'src/app/service/brand.service';
import { BotServiceService } from 'src/app/service/bot-service.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';


interface Suggestion {
  type: string;
  text: string;
  postback: string;
}

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})


export class TemplateComponent {
  @ViewChild('carouselRef', { static: false }) carousel!: NzCarouselComponent;
  cards: { id: number; previewUrl: string | null }[] = [
  
  ];
  botid=''
  custom=false
  selectedFilter: string = 'Active';
 templateList: any[] = []; // full list from API
 filteredTemplateList: any[] = []; // data shown in table
  currentStep: number = 1;
  messageTemplates: any = [];
  bot: any;
  botId: any;
  botName: any;
  botStatus: any;
  testDevices: any[] = [];
  code='+91'
  isVisible = false;
  phNumber=""
  customParams:any
  mobileNumber=""
  err=""
  status="Active"
  isTestTemplate=false
  templatename=''
  addPage:boolean=true
  ViewPage:boolean=false
  imageHeight = 120;
  orientation = 'vertical';
  selectedCardIndex: number | null = null;
  templateType: string = ''; 
  displayName=""
  templateForm!: FormGroup;
  loggedInUserName: string = '';
  role: string =sessionStorage.getItem('ROLE')||"";
  cardTitle: string = '';
  templateData:any
  carouselList:{ id:number,cardTitle: string;cardDescription:string;fileName:string | null; }[] =[
    {
      id:0,
      cardTitle:"",
      cardDescription:"",
      fileName:""
    }
  ];
  carouseldetails:{ cardTitle: string;}[] =[
    
  ];
  form!: FormGroup;
  // suggestions: FormArray = this.fb.array([]);
  type: string = '';
  text: string = '';
  postback: string = '';
  // isFallbackEnabled: boolean = false;
  messageBody: boolean = true;
  TextMessage: boolean = true;
  fallbackSmsContent: string = ''; 
  carddescription: string = '';
  Suggestiontext: string = '';
  messagecontent: string = '';
  previewUrl: string | null = null;
  uploadedFileSize: string | null = null;
  uploadedFileUrl: string | null = null;
  newbot: any;
  edit:boolean=false
  filteredData: any[]= []
  searchControl = new FormControl('');
  logedinuser=sessionStorage.getItem('USER_NAME') 
  payload={}

  shortByTemplateName=(a: any, b: any) => a.templateTitle.localeCompare(b.templateTitle);
  sortByDate = (a: any, b: any) => {
    return new Date(this.convertDate(a.createadDate)).getTime() - new Date(this.convertDate(b.createadDate)).getTime();
  }

  convertDate(inputDate: string): string {
    
    const months: { [key: string]: number } = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };
  
    // Split the input string
    const parts = inputDate.split(' ');
    
    const day = parts[2]; // Day
    const month = months[parts[1]]; // Convert month name to number
    const year = parts[5]; // Year
    const timeParts = parts[3].split(':'); // Split time into hours, minutes, seconds
  
    // Create a Date object without relying on the incorrect timezone
    const dateObj = new Date(Number(year), month, Number(day), Number(timeParts[0]), Number(timeParts[1]), Number(timeParts[2]));
  
    // Format the date as dd-mm-yyyy hh:mm:ss
    const formattedDay = String(dateObj.getDate()).padStart(2, '0');
    const formattedMonth = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const formattedYear = dateObj.getFullYear();
  
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getSeconds()).padStart(2, '0');
  
    return `${formattedDay}-${formattedMonth}-${formattedYear} ${hours}:${minutes}:${seconds}`;
  }
  getTemplate(temp:any){
    this.template.setTemplate(temp)
  }
  prevSlide(): void {
      this.carousel.pre();
  }

  nextSlide(): void {
      this.carousel.next();
  }
getTemplates(botid: any): void {
  this.messageTemplates = [];
  this.filteredData = [];

  const dt = {
    loggedInUserName: sessionStorage.getItem('USER_NAME'),
    botId: botid
  };

  this.reportService.templatelist(dt).subscribe(
    (res: any) => {
      if (res.data?.templateList) {
        this.templateList = [...res.data.templateList].reverse();
        this.messageTemplates = [...this.templateList];
        this.filteredData = [...res.data.templateList].reverse();
        // ✅ Re-apply the currently selected filter
        this.applyFilteractive();
      } else {
        this.templateList = [];
        this.filteredTemplateList = [];
        this.messageTemplates = [];
        this.filteredData = [];
      }
    },
    (error) => {
      console.error('Failed to fetch template list:', error);
      this.templateList = [];
      this.filteredTemplateList = [];
      this.messageTemplates = [];
      this.filteredData = [];
    }
  );
}


applyFilteractive(): void {
  if (!this.templateList) return;

  switch (this.selectedFilter) {
    case 'Active':
      this.filteredTemplateList = this.templateList.filter(
        (t: any) => t.template?.isActive === true
      );
      break;
    case 'Inactive':
      this.filteredTemplateList = this.templateList.filter(
        (t: any) => t.template?.isActive === false
      );
      break;
    default:
      this.filteredTemplateList = [...this.templateList];
  }
  this.filteredData = [...this.filteredTemplateList]; // Reset filtered data
  this.cdr.detectChanges();
}





  applyFilter(searchTerm: string) {
    if (!searchTerm) {
      this.filteredData = [...this.filteredTemplateList]; 
      return;
    }
  
    const lowerCaseTerm = searchTerm.toLowerCase();
  
    this.filteredData = this.filteredTemplateList.filter((item: any) =>
      Object.values(item).some((value: any) =>
        value?.toString().toLowerCase().includes(lowerCaseTerm)
      )
    );
  }
  
  


  deleteCard(index: number) {
    this.cards.splice(index, 1);
    this.carouselList.splice(index,1)
  }

  constructor(
    private fb: FormBuilder, 
    private toastService: ToastService,
    private templateService: TemplateService,
    private botService:BotServiceService,
    private reportService: ReportService, private template: TemplateMessageService,  private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      status: ['Active'] // Set default value to 'Active'
    });
  }



  getTemplateList(){
     let dt = {
      loggedInUserName: sessionStorage.getItem('USER_NAME'),
    };

  this.reportService.templatelist(dt).subscribe((res: any) => {
  if (res.data && res.data.templateList) {
    this.templateList = [...res.data.templateList].reverse(); // full list
    this.messageTemplates = [...this.templateList];
    this.templateData = res.data.templateDataList;
    this.applyFilteractive();
  } else {
    this.templateList = [];
    this.filteredTemplateList = [];
    this.messageTemplates = [];
    this.filteredData = [];
  }
}, (error) => {
  console.error('Failed to fetch template list:', error);
  this.templateList = [];
  this.filteredTemplateList = [];
  this.messageTemplates = [];
  this.filteredData = [];
});

  }



  ngOnInit() {
    this.messageTemplates = [];
    this.form.get('status')?.valueChanges.subscribe(() => {
      this.applyFilteractive();
    });
    this.filteredData = [];
    let dt = {
      loggedInUserName: sessionStorage.getItem('USER_NAME'),
    };

  this.reportService.templatelist(dt).subscribe((res: any) => {
  if (res.data && res.data.templateList) {
    this.templateList = [...res.data.templateList].reverse(); // full list
    this.messageTemplates = [...this.templateList];
    this.templateData = res.data.templateDataList;
    this.applyFilteractive();
  } else {
    this.templateList = [];
    this.filteredTemplateList = [];
    this.messageTemplates = [];
    this.filteredData = [];
  }
}, (error) => {
  console.error('Failed to fetch template list:', error);
  this.templateList = [];
  this.filteredTemplateList = [];
  this.messageTemplates = [];
  this.filteredData = [];
});


    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value: any) => this.applyFilter(value));

    this.templateService.getallbotdetail(dt).subscribe(
      (response: any) => {
        if (response.data && response.data.bots) {
          this.newbot = response.data.bots;
        } else {
          console.error('Invalid API response:', response);
        }
      },
      (error) => {
        // this.toastService.publishNotification("Failed", "Failed to fetch bot data", "error");
      }
    );
  }
  

  get suggestions() {
    return this.templateForm.get('suggestions') as FormArray;
  }

  // Getter for fallback enabled
  get isFallbackEnabled() {
    return this.templateForm.get('fallback')?.value === 'yes';
  }

  // Add suggestion
 

  // Remove suggestion

  
  // Transform suggestions to API format

    
   
    

  
    

    
  
  
  
  
  




  


  // onTemplateTypeChange(value: string): void {
  //   this.templateType = value;
  //   // Optionally reset the form controls here if needed, based on selected template type
  // }
  

  








  
    
    onOrientationChange(selectedOrientation: string): void {
      this.orientation = selectedOrientation;
    }

    navigateLeft() {
      const carousel = document.querySelector('.ant-carousel .slick-prev') as HTMLElement;
      if (carousel) carousel.click();
    }

    onHeightChange(selectedHeight: string): void {
      if (selectedHeight === 'SHORT_HEIGHT') {
        this.imageHeight = 100; // Reset to default or desired "SHORT" height
      } else if (selectedHeight === 'MEDIUM_HEIGHT') {
        this.imageHeight = 140; // Increase by 10px for "MEDIUM" height
      }
    }
  
    navigateRight() {
      const carousel = document.querySelector('.ant-carousel .slick-next') as HTMLElement;
      if (carousel) carousel.click();
    }
    
    
    

  beforeUpload = (file: File): boolean => {
    // Validate file type or size if needed
    this.templateForm.patchValue({ pdfFile: file });
    this.uploadedFileSize = file.name;
    return false;
  };

  // handleFileChange(event: any): void {
  //   // Handle any file change logic if required
  //   console.log('File uploaded:', event.file);
  // }

  handleFileChange(event: any): void {
    const file = event.file?.originFileObj;
    if (file) {
      this.uploadedFileSize = file.name;
      this.uploadedFileUrl = 'URL_TO_DOWNLOADED_FILE'; // Set dynamically
      this.uploadedFileSize = (file.size / 1024).toFixed(2) + ' KB'; // Convert size to KB
    }
  }
  
  showTestTemplate(template:any,botId:any){
    this.botid=botId
    this.isTestTemplate=true;
    this.templatename=template
    this.displayName="Test"+" "+template
    let data={
      loggedInUserName: sessionStorage.getItem('USER_NAME'),
      templateName : template
    }

    this.templateService.templateDetail(data).subscribe({
      next:(res)=>{
        if(res.customParams!=null)
        this.customParams = res.customParams?.filter(
         (param : any) => param !== "conversation_id" && param !== "message_id" && param !=="PhoneNo"
         ); 
        this.createForm();
        this.custom=true
      }
      
      ,
      error:(err) => {
        this.toastService.publishNotification('error', 'Something went wrong.', 'error');
      }
    })
    this.getBotDetails()
   
  }

  // ======================================================

  configureTemplate(templateName: string): void {
    console.log("Configuring template ID", templateName);
    // this.payload= {...this.configForm.value, richrichTemplateData: { name:templateName }};
    // Reset form with default values
    this.configForm.reset({
      loggedInUserName: sessionStorage.getItem('USER_NAME'),
      isSmsFallback: 'N', // SMS fallback = No by default
      fallbackSms: '',
      smsApiEndpoint: '',
      isWhatsappFallback: 'N', // WhatsApp fallback = No by default
      fallbackWhatsapp: '',
      whatsappApiEndpoint: ''
    });
    this.selectedTemplate = templateName;
    console.log("Selected Template:", this.templateData.find((t: any) => t.name === templateName));
    const data = this.templateData.find((t: any) => t.name === templateName);
    if (data) {
    this.configForm.patchValue({
      loggedInUserName: sessionStorage.getItem('USER_NAME'),
      isSmsFallback: data.isFallbackSms || "N", // SMS fallback = No by default
      fallbackSms: data.fallbackSms,
      smsApiEndpoint: data.smsApiEndpoint,
      isWhatsappFallback: data.isFallbackWhatsapp || "N", // WhatsApp fallback = No by default
      fallbackWhatsapp: data.fallbackWhatsapp,
      whatsappApiEndpoint: data.whatsappApiEndpoint
    });
  }
    // Open the modal
    this.isConfigModalVisible = true;
  }
  

isConfigModalVisible = false;
selectedTemplate: any = null;


configForm: FormGroup = this.fb.group({
  loggedInUserName: [sessionStorage.getItem('USER_NAME')],
  isSmsFallback: ['N'],
  fallbackSms: [''],
  smsApiEndpoint: [''],
  isWhatsappFallback: ['N'],
  fallbackWhatsapp: [''],
  whatsappApiEndpoint: [''],
});

ngAfterViewInit() {
  // Listen for changes to isSmsfallback and update validators accordingly
  this.configForm.get('isSmsFallback')?.valueChanges.subscribe((val) => {
    const fallbackSmsControl = this.configForm.get('fallbackSms');
    const fallbackApiControl = this.configForm.get('smsApiEndpoint');
    if (val && val.toLowerCase() === 'y') {
      fallbackSmsControl?.setValidators([Validators.required]);
      fallbackApiControl?.setValidators([Validators.required]);
    } else {
      fallbackSmsControl?.clearValidators();
      fallbackApiControl?.clearValidators();
    }
    fallbackSmsControl?.updateValueAndValidity();
    fallbackApiControl?.updateValueAndValidity();
  });
  this.configForm.get('isWhatsappFallback')?.valueChanges.subscribe((val) => {
    const fallbackWhatsappControl = this.configForm.get('fallbackWhatsapp');
    const fallbackWhatsappApiControl = this.configForm.get('whatsappApiEndpoint');
    if (val && val.toLowerCase() === 'y') {
      fallbackWhatsappControl?.setValidators([Validators.required]);
      fallbackWhatsappApiControl?.setValidators([Validators.required]);
    } else {
      fallbackWhatsappControl?.clearValidators();
      fallbackWhatsappApiControl?.clearValidators();
    }
    fallbackWhatsappControl?.updateValueAndValidity();
    fallbackWhatsappApiControl?.updateValueAndValidity();
  });
}

get isFallbackEnabledSms(): boolean {
  return this.configForm.get('isSmsFallback')?.value === 'Y';
}

get isFallbackEnabledWhatsapp(): boolean {
  return this.configForm.get('isWhatsappFallback')?.value === 'Y';
}


  handleConfigOk(): void {
    
    const payload= {...this.configForm.value, richTemplateData: { name: this.selectedTemplate }};
    if (this.configForm.invalid) {
      this.configForm.markAllAsTouched();
      this.configForm.updateValueAndValidity();
      this.toastService.publishNotification('error', 'Please fill all required fields.', 'error');
      return;
    }
    this.templateService.addFallback(payload).subscribe({
      next:(res)=>{
        this.toastService.publishNotification('success', res.message, 'success')
        this.getTemplateList()
      },
      error:(err)=>{
        this.toastService.publishNotification('error',"Something went wrong",'error')
      }
    })
    this.isConfigModalVisible=false
  }
  
  handleConfigCancel(){
    this.isConfigModalVisible=false
  }

// ======================================================

  createForm() {
    const formControls: any = {};
    
    this.customParams.forEach((param:any) => {
      formControls[param] = ['']; // Initialize with empty value
    });

    this.form = this.fb.group(formControls);
  }

  addNumber(){
    if(this.phNumber!="" && this.phNumber.length == 10){
      let dt = {
        "loggedInUserName":sessionStorage.getItem('USER_NAME'),
        "testNumbers" : [{"phoneNumber" : this.code+this.phNumber}],
        "botId":this.botId,
        "botName":this.botName
      }
      this.templateService.test(dt).subscribe(
        {
          next:(res)=>{
             this.toastService.publishNotification('success', res.message, 'success')},
          error:(err)=>{
            this.toastService.publishNotification('error',"Something went wrong",'error')
          }
        }
      )
      this.phNumber=""
    }
    else{
      if(this.phNumber.length != 10){
        this.err="*enter a valid number"
  
      }
      if(this.phNumber==""){
        this.err="*field can't be blank"
      }
    }
    //this.getBotDetails()
  }

  handleSubmit(){
    this.isTestTemplate=false
  }

  handleClose(){
    this.isTestTemplate=false
  }

  // handleConfigOk(){
  //   this.isConfigModalVisible=false
  // }

  // handleConfigCancel(){
  //   this.isConfigModalVisible=false
  // }


  showModal(): void {
    this.isVisible = true;
    this.getBotDetails()
  }

  sendTestMessage(){
    let Mno = this.mobileNumber.split('+')[1];
    //console.log(Mno)
    
    if (this.custom==true){
    let dt ={
      "loggedInUserName": sessionStorage.getItem('USER_NAME'),
      "mobileNumber": Mno,
      "botId": this.botid,
      "msgType": "text",
      "templateCode": this.templatename,
      "customParams":JSON.stringify(this.form.value)
  }
  
  this.templateService.testTemplate(dt).subscribe(
    {
      next:(res)=>{
        //console.log(res)
        if (res.result?.toLowerCase() === 'success' && res) {
         
          this.toastService.publishNotification('success', res.message, 'success');
          this.mobileNumber=""
        } else {
          console.warn('Unexpected API response:', res);
          this.toastService.publishNotification('error', res.message, 'error');
        }
      },
      error: (error) => {
        console.error('Error adding template:', error);
        this.toastService.publishNotification('error', 'Failed to test template', 'error');
      }
      }
  )
}
else{

  let dt ={
    "loggedInUserName": sessionStorage.getItem('USER_NAME'),
    "mobileNumber": Mno,
    "botId": this.botId,
    "msgType": "text",
    "templateCode": this.templatename
  }
  this.templateService.testTemplate(dt).subscribe(
      {
        next:(res)=>{
          //console.log(res)
          if (res.result?.toLowerCase() === 'success' && res) {
           
            this.toastService.publishNotification('success', res.message, 'success');
          } else {
            //console.warn('Unexpected API response:', res);
            this.toastService.publishNotification('error', res.message, 'error');
          }
        },
        error: (error) => {
          //console.error('Error adding template:', error);
          this.toastService.publishNotification('error', 'Failed to test template', 'error');
        }
        }
    )}
  //console.log(this.form.value)
    
    this.isTestTemplate=false
  }
  handleOk(): void {
    //console.log('Button ok clicked!');
    
    if(this.phNumber!="" && this.phNumber.length == 10){
      
    let dt = {
      "loggedInUserName":sessionStorage.getItem('USER_NAME'),
      "testNumbers" : [{"phoneNumber" : this.code+this.phNumber}],
      "botId":this.botId,
      "botName":this.botService.getBotDetails().botName
    }
    this.templateService.test(dt).subscribe(
      {
        next:(res)=>{
          //console.log(res);
           this.toastService.publishNotification('success', res.message, 'success')},
        error:(err)=>{
          //console.log(err)
          }
      }
    )
    this.phNumber=""
    this.isVisible = false;
  }
  else{
    if(this.phNumber.length != 10){
      this.err="*enter a valid number"

    }
    if(this.phNumber==""){
      this.err="*field can't be blank"
    }
   this.isVisible=true
  }
  //this.getBotDetails()
  }

  handleCancel(): void {
    ///console.log('Button cancel clicked!');
    this.isVisible = false;
  }
  getBotDetails(){
    let dt2={
      "loggedInUserName":sessionStorage.getItem('USER_NAME'),
      "botId":this.botid
    }
    this.templateService.editbotdetail(dt2).subscribe({
      next:(res)=>{
        //console.log(res)
        this.testDevices = res.data.botData.testNumbers
        this.botName=res.data.botData.botName
      },
      error:(err)=>{
        //console.log(err)
      }
    })
  }


updatetemplate(templateId: any, isActive: boolean) {
  const payload = {
    templateId: templateId,
    loggedInUserName: sessionStorage.getItem('USER_NAME'),
    isActive: isActive
  };
  this.templateService.updateactive(payload).subscribe(
    (response) => {
      this.toastService.publishNotification('success', 'Template updated successfully');
       this.filteredData = [];
      this.cdr.detectChanges();
      this.applyFilteractive(); // Refresh the list
    },
    (error) => {
      this.toastService.publishNotification('error', 'Failed to update template');
      console.error('Error updating template:', error);
    }
  );
}
cancel(){

}

}