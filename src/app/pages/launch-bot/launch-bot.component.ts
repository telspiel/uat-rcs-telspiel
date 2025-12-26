import { Component, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-launch-bot',
  templateUrl: './launch-bot.component.html',
  styleUrls: ['./launch-bot.component.scss']
})
export class LaunchBotComponent {
  @ViewChild('carouselRef', { static: false }) carousel!: NzCarouselComponent;
  cards: { id: number; previewUrl: string | null }[] = [
  
  ];
  custom=false
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
  status=""
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



  getTemplate(temp:any){
    this.template.setTemplate(temp)
  }
  prevSlide(): void {
      this.carousel.pre();
  }

  nextSlide(): void {

      this.carousel.next();
    
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
       this.filteredData =[...this.messageTemplates]; 
     } else {
       this.messageTemplates = []; 
     }
   });
  }

  applyFilter(searchTerm: string) {
    if (!searchTerm) {
      this.filteredData = [...this.messageTemplates]; // Reset filtered data
      return;
    }
  
    const lowerCaseTerm = searchTerm.toLowerCase();
  
    this.filteredData = this.messageTemplates.filter((item: any) =>
      Object.values(item).some((value: any) =>
        value?.toString().toLowerCase().includes(lowerCaseTerm)
      )
    );
  }
  addTepmlate()
  {
    this.addPage=true

  }

  viewTemplate(){
    this.ViewPage=true
  }
  selectCard(index: number) {
    this.selectedCardIndex = this.selectedCardIndex === index ? null : index; 
    
    this.carousel.goTo(index)
    console.log(this.carouselList[index])
    
    // const cardDes = this.carouselList[index].cardDescription
    //const cardTitle = this.carouselList[index].cardTitle
    

    this.updateValue(index)

    
  }
  updateValue(i:number){
    
    this.templateForm.get('cardTitle')?.valueChanges.subscribe(value => {
      this.carouselList[i].cardTitle = value;
    });
    this.cardTitle=this.carouselList[i].cardTitle
    
    this.templateForm.patchValue({
      cardTitle:this.cardTitle
    })
  }
  addCard() {
    if (this.carouselList.length < 10) {
      //this.cards.push({ id: this.cards.length + 1, previewUrl: null });
      this.carouselList.push({
      id:this.carouselList.length,
      cardTitle:"",
      cardDescription:"",
      fileName:""
      })
      
    }
  }

  deleteCard(index: number) {
    this.cards.splice(index, 1);
    this.carouselList.splice(index,1)
  }

  constructor(
    private fb: FormBuilder, 
    private templateMessageService: TemplateMessageService,
    private toastService: ToastService,
    private templateService: TemplateService,
    private temped : TemplateService,
    private botService:BotServiceService,
    private reportService: ReportService, private template: TemplateMessageService
  ) {
    // this.suggestions = this.fb.array([]);
    
    this.templateForm = this.fb.group({
      botid:[''],
      type: ['rich_card', Validators.required],
      name: ['', Validators.required],
      fallbackText: ['', Validators.required],
      height:[''],
      width:[''],
      // fileName: [''],
      cardTitle: ['', Validators.required],
      messagecontent:[''],
      cardOrientation:[''],
      cardDescription: ['', Validators.required],
      standAloneFileName: [''],
      thumbnailFileName: [''],
      fallback: ['no', Validators.required],
      suggestions: this.fb.array([])
    });
  }





  ngOnInit() {

    this.searchControl.valueChanges
          .pipe(debounceTime(300), distinctUntilChanged()) // Prevents unnecessary API calls
          .subscribe((value:any) => this.applyFilter(value));

          
    this.loggedInUserName = sessionStorage.getItem('USER_NAME') || 'User';
    console.log(this.addPage)
    console.log(this.ViewPage)
  //   let dt5 = {
  //     "loggedInUserName":sessionStorage.getItem('USER_NAME'),
  //  }
  //  this.reportService.templatelist(dt5).subscribe((res: any) => {
  //    console.log(res);
  //    if (res.data && res.data.templateList) {
  //      this.messageTemplates = res.data.templateList; 
  //    } else {
  //      this.messageTemplates = []; 
  //    }
  //  });

   let dte = {
     "loggedInUserName":sessionStorage.getItem('USER_NAME'),
   }

   
   
    if (this.edit==false){
      this.templateForm.reset()
    }
    let data : any;
   
      const selectedtemplate = this.templateMessageService.getTemplateDetails(); 
      
      console.log(selectedtemplate);
      if (selectedtemplate ) { 
        console.log('Bot details on bot creation page:',selectedtemplate );
        this.edit=true;
        data = {
          loggedInUserName: sessionStorage.getItem('USER_NAME'),
          templateName :selectedtemplate
        };
    
        this.templateService.templateDetail(data).subscribe(
          (res) => {
            if (res) {
  
              // Initialize form with values
              this.templateForm.patchValue({
                botid:res.botId,
                type: res.type,
                name: res.name,
                fallbackText: res.fallbackText,
                height: res.height,
                width: res.width,
                cardTitle: res.standAlone.cardTitle,
                messagecontent: res.textMessageContent,
                cardOrientation: res.cardOrientation,
                cardDescription: res.standAlone.cardDescription,
                standAloneFileName: res.standAlone.fileName,
                thumbnailFileName: res.standAlone.thumbnailFileName,
                //fallback: ['no', Validators.required],
                suggestions: res.standAlone.suggestionTypeRich.map((s:any)=>{
                  type:s.suggestionType
                  text:s.displayText
                  postback:s.postback
                })
              });
    
              // console.log('Form patched successfully:', this.templateForm.value);
            } else {
              console.error('Invalid API response:', res);
            }
          },
          (error) => {
            console.error('Failed to fetch bot details:', error);
          }
        );
      } else {
        console.error('No bot details found.');
      }
    let dt = {
      loggedInUserName: sessionStorage.getItem('USER_NAME'),
    }
    this.temped.getallbotdetail(dt).subscribe(
      (response: any) => {
        if (response.data && response.data.bots) {
          this.newbot = response.data.bots; 
        } else {
          console.error('Invalid API response:', response);
        }
      },
      (error) => {
        console.error('Failed to fetch bot data:', error);
      }
    );

    this.templateForm.get('cardTitle')?.valueChanges.subscribe(value => {
      this.cardTitle = value;
    });
    this.templateForm.get('messagecontent')?.valueChanges.subscribe(value => {
      this.messagecontent = value;
    });
    this.templateForm.get('cardDescription')?.valueChanges.subscribe(value => {
      this.carddescription = value;
    });
    this.templateForm.get('Suggestiontext')?.valueChanges.subscribe(value => {
      this.Suggestiontext = value;
    });
    this.templateForm.get('fallback')?.valueChanges.subscribe(value => {
      if (value === 'yes') {
       
      } else {
       
      }
    });

    this.templateForm.get('messageBody')?.valueChanges.subscribe(value => {
      this.messageBody = value; 
    });
    
    
    
  }
  
  // Getter for suggestions FormArray
  get suggestions() {
    return this.templateForm.get('suggestions') as FormArray;
  }

  // Getter for fallback enabled
  get isFallbackEnabled() {
    return this.templateForm.get('fallback')?.value === 'yes';
  }

  // Add suggestion
  addSuggestion(): void {
    this.suggestions.push(
      this.fb.group({
        type: ['Reply', Validators.required],
        text: ['', [Validators.required, Validators.maxLength(25)]],
        postback: ['', [Validators.required, Validators.maxLength(120)]]
      })
    );
  }

  // Remove suggestion
  removeSuggestion(index: number): void {
    this.suggestions.removeAt(index);
  }
  
  // Transform suggestions to API format
  transformSuggestions(suggestions: any[]): any[] {
    return suggestions.map(suggestion => {
      switch (suggestion.type) {
        case 'urlaction':
          return {
            suggestionType: 'url_action',
            url: suggestion.text,
            displayText: suggestion.postback,
            postback: suggestion.postback
          };
        case 'dialer':
          return {
            suggestionType: 'dialer_action',
            phoneNumber: suggestion.text,
            displayText: suggestion.postback,
            postback: suggestion.postback
          };
        case 'Reply':
          return {
            suggestionType: 'reply',
            displayText: suggestion.text,
            postback: suggestion.postback
          };
        // Add other cases for different suggestion types
        default:
          return {
            suggestionType: suggestion.type,
            displayText: suggestion.text,
            postback: suggestion.postback
          };
      }
    });
    
   
    

  
    

    
    // messageBody
   
  }





  ontypeChange(value: string): void {
    console.log('Selected Template Type:', value);
    if (value === 'TextMessage') {
      this.templateForm.patchValue({
        cardOrientation: '',
        height: '',
        imagevideo: '',
        cardTitle: '',
        cardDescription: ''
      });
    }
  }
  onSubmit() {
    console.log("Form submitted"); // Check if function is triggered
  
    // if (!this.templateForm.valid) {
    //   console.error("Form validation failed:", this.templateForm.errors);
    //   console.log("Form controls status:", this.templateForm.controls);
    //   return; // Stop execution if form is invalid
    // }
  
    const formData = this.templateForm.value;
    console.log("Form data:", formData); // Log the entire form data
  
    let dt: any; // Declare dt once
  
    if (formData.type === 'rich_card') {
      console.log("Rich card condition met"); // Debug lo
      dt = {
        loggedInUserName: sessionStorage.getItem('USER_NAME'),
        botId:formData.botid,
        richTemplateData: {
          name: formData.name,
          fallbackText: formData.fallbackText,
          type: "rich_card",
          height: formData.height,
          width: formData.width,
          fileName: formData.fileName,
          standAlone: {
            cardTitle: formData.cardTitle,
            cardDescription: formData.cardDescription,
            fileName: formData.standAloneFileName,
            thumbnailFileName: formData.thumbnailFileName,
            suggestions: this.transformSuggestions(formData.suggestions)
          }
        }
      };
    } 
    else if (formData.type === 'TextMessage') {
      console.log("TextMessage condition met"); // Debug log
      dt = {
        loggedInUserName: sessionStorage.getItem('USER_NAME'),
        botId:formData.botid,
        richTemplateData: {
          name: formData.name,
          fallbackText: formData.fallbackText,
          type: "text_message",
          templateUseCase: "promo",
          height: formData.height,
          width: formData.width,
          textMessageContent: formData.messagecontent ?? '', // Default to empty string if undefined
          suggestions: this.transformSuggestions(formData.suggestions)
        }
      };
    } else {
      console.error("Invalid type:", formData.type); // Debug log for unexpected type
    }
  
    console.log("Final dt object:", dt); // Log final API payload before sending request
  
    if (dt && this.edit===false){
      this.templateService.addtemp(dt).subscribe({
        next: (res: any) => {
          console.log('API Response:', res);
          if (res.result?.toLowerCase() === 'success' && res.data) {
            window.location.reload(); 
            this.toastService.publishNotification('success', res.message, 'success');
          } else {
            console.warn('Unexpected API response:', res);
          }
        },
        error: (error) => {
          console.error('Error adding template:', error);
          this.toastService.publishNotification('error', 'Failed to add template', 'error');
        }
      });
    }
    else if(dt && this.edit===true){
      this.templateService.editTemplate(dt).subscribe({
        next: (res: any) => {
          console.log('API Response:', res);
          if (res.result?.toLowerCase() === 'success' && res.data) {
            window.location.reload(); 
            this.toastService.publishNotification('success', res.message, 'success');
          } else {
            console.warn('Unexpected API response:', res);
          }
        },
        error: (error) => {
          console.error('Error adding template:', error);
          this.toastService.publishNotification('error', 'Failed to add template', 'error');
        }
      });
    }
    else {
      console.error("dt is undefined, API call not made"); // Log if dt is empty
      this.toastService.publishNotification('error', 'Invalid template data', 'error');
    }
  }
  
  
  
  




  


  // onTemplateTypeChange(value: string): void {
  //   this.templateType = value;
  //   // Optionally reset the form controls here if needed, based on selected template type
  // }
  onFileChange(event: any): void {
    const file = event.file.originFileObj;
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  handlePreview = (file: any): Promise<string> => {
    return Promise.resolve(file.url || file.thumbUrl);
  };


  



  uploadImage(event: any, cardIndex: number) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.cards[cardIndex].previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
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
  
  showTestTemplate(template:any){
    this.isTestTemplate=true;
    this.templatename=template
    this.displayName="Test"+" "+template
    let data={
      loggedInUserName: sessionStorage.getItem('USER_NAME'),
      templateName : template
    }

    this.templateService.templateDetail(data).subscribe({
      next:(res)=>{console.log(res)
        if(res.customParams!=null)
        this.customParams = res.customParams;
        this.createForm();
        this.custom=true
      }
      
      ,
      error:(err) => { console.log(err) }
    })
    this.getBotDetails()
    

   
    
  }
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
          next:(res)=>{console.log(res);
             this.toastService.publishNotification('success', res.message, 'success')},
          error:(err)=>{console.log(err)}
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


  showModal(): void {
    this.isVisible = true;
    this.getBotDetails()
  }

  sendTestMessage(){
    let Mno = this.mobileNumber.split('+')[1];
    console.log(Mno)
    
    if (this.custom==true){
    let dt ={
      "loggedInUserName": sessionStorage.getItem('USER_NAME'),
      "mobileNumber": Mno,
      "botId": this.botId,
      "msgType": "text",
      "templateCode": this.templatename,
      "customParams":JSON.stringify(this.form.value)
  }
  this.templateService.testTemplate(dt).subscribe(
    {
      next:(res)=>{console.log(res)
        if (res.result?.toLowerCase() === 'success' && res) {
         
          this.toastService.publishNotification('success', res.message, 'success');
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
        next:(res)=>{console.log(res)
          if (res.result?.toLowerCase() === 'success' && res) {
           
            this.toastService.publishNotification('success', res.message, 'success');
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
    )}
  //console.log(this.form.value)
    
    this.isTestTemplate=false
  }
  handleOk(): void {
    console.log('Button ok clicked!');
    
    if(this.phNumber!="" && this.phNumber.length == 10){
      
    let dt = {
      "loggedInUserName":sessionStorage.getItem('USER_NAME'),
      "testNumbers" : [{"phoneNumber" : this.code+this.phNumber}],
      "botId":this.botId,
      "botName":this.botService.getBotDetails().botName
    }
    this.templateService.test(dt).subscribe(
      {
        next:(res)=>{console.log(res);
           this.toastService.publishNotification('success', res.message, 'success')},
        error:(err)=>{console.log(err)}
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
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
  getBotDetails(){
    let dt2={
      "loggedInUserName":sessionStorage.getItem('USER_NAME'),
      "botId":this.botId
    }
    this.templateService.editbotdetail(dt2).subscribe({
      next:(res)=>{
        console.log(res)
        this.testDevices = res.data.botData.testNumbers
        this.botName=res.data.botData.botName
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }
}