import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ToastService } from 'src/app/shared/toast-service.service';
import { TemplateMessageService } from 'src/app/service/template-message.service';
import { TemplateService } from 'src/app/service/template-service.service';
import { SEND_TEMPLATE_MODEL, TEMPLATES, TEMPLATE_RESPONSE } from 'src/app/models/templateModel';
import { NzCarouselComponent } from 'ng-zorro-antd/carousel';
import { ReportService } from 'src/app/service/report.service';
import { BrandService } from 'src/app/service/brand.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { DomSanitizer } from '@angular/platform-browser';

interface Suggestion {
  type: string;
  text: string;
  postback: string;
}

interface Bot {
  botId: string;
  botName: string;
}
@Component({
  selector: 'app-view-template-ditails',
  templateUrl: './view-template-ditails.component.html',
  styleUrls: ['./view-template-ditails.component.scss']
})
export class ViewTemplateDitailsComponent {
  @ViewChild('carouselRef', { static: false }) carousel!: NzCarouselComponent;
  cards: { id: number; previewUrl: string | null }[] = [
  
  ];
  valueChangesSubscriptionSussutions:any
  fileList=[]
  err="";
  isVideo=false
  addPage:boolean=true
  ViewPage:boolean=false
  imageHeight = 120;
  orientation = 'vertical';
  selectedCardIndex: any;
  templateType: string = 'rich_card'; 
  templateForm!: FormGroup;
  alignmenttype: string = 'LEFT'; 
  date: any;
  cardTitle: string = '';
  cardDescription:string =''
  suggestionsArray: any[] = [];
  carouselList:{ cardTitle: string;cardDescription:string; mediaUrl:string | null; suggestions:any[]; thumbnailFileName: string| null;thumbnailUrl: string| null }[] =[
    {  cardTitle: '', cardDescription: '',  mediaUrl:"",suggestions:[], thumbnailFileName: '',thumbnailUrl: ''},
    {  cardTitle: '', cardDescription: '', mediaUrl:"",suggestions:[],thumbnailFileName: '',thumbnailUrl: ''},
  ];
  carouseldetails:{ cardTitle: string;}[] =[
    
  ];
  validateForm!: FormGroup;
  botName:any;
  // suggestions: FormArray = this.fb.array([]);
  type: string = 'rich_card';
  alignment: string = 'LEFT'; 
  text: string[] = [];
  postback: string = '';
  newbot: Bot[] = [];
  selectedActionType: string = ''; // Default empty
  currentStep: number = 1;
  messageTemplates: any = [];
  // isFallbackEnabled: boolean = false;
  messageBody: boolean = true;
  TextMessage: boolean = true;
  bot: any
  fallbackSmsContent: string = ''; 
  carddescription: string = '';
  textValues: { [key: number]: string } = {};
  suggestionTexts: { [key: number]: string } = {};
  Suggestiontext: string = '';
  selectedBotName: string = 'VTS'; // Default value
  messagecontent: string = '';
  previewUrl: string | null = null;
  uploadedFileSize: string | null = null;
  uploadedFileUrl: string | null = null;
  edit:boolean=false
  data:any
  thumbnailUrl:any
  imageUrl:any
  backgroundUrl:any
  // selectedCardIndex: number | null = null;
  valueChangesSubscription: any; // Store subscription to unsubscribe late
  isVisible = false;  
  isConfirmLoading = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  isCropperVisible = false;
  selectedFile: NzUploadFile | null = null;
  file: File | null = null;
  formData: FormData | undefined;
  filename:string =""
  fileUrl:string=""
  fileType:string=""
i: any;
  
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    
    this.filename=event.target.files[0].name
    this.fileType=event.target.files[0].type.split('/')[1]
    console.log(this.fileType);
}
imageCropped(event: ImageCroppedEvent) {
    if (event.objectUrl) {
      this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
    }
    if (event.blob){
    this.file = new File([event.blob], this.filename, { type: event.blob.type, lastModified: Date.now() });

    }
    console.log(event);
}
imageLoaded() {
    // show cropper
}
cropperReady() {
    // cropper ready
}
loadImageFailed() {
    // show message
}
  
  showModal(): void {
    this.isVisible = true;
  }

  handleOk(){
    this.isConfirmLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isConfirmLoading = false;
    
    //this.onFileChange()
    

    if(this.file){
    const formData = new FormData();
    formData.append('file', this.file! as Blob, this.filename);
    const userName = sessionStorage.getItem('USER_NAME');
    if (userName) {
      formData.append('userName', userName);
    }
    

    this.templateService.uploadFile(formData).subscribe(
      (res)=>{
        console.log(res)
        this.fileUrl=res.fileUploadLocation
        this.carouselList[this.selectedCardIndex].mediaUrl = this.fileUrl;
      }
    )
  }}, 1000);
  this.previewUrl = this.croppedImage ;
  
  }
  handleCancel(): void {
    this.isVisible = false;
    this.croppedImage=""
    this.previewUrl=""
  }
  addVariable(type:string): void {
    if (type=='currentDescription')
    {
      const currentDescription = this.templateForm.get('cardDescription')?.value || '';
      this.templateForm.patchValue({
      cardDescription: currentDescription + '[custom_var]'
    });
    }
    if (type=='cardTitle')
      {
        const cardTitle = this.templateForm.get('cardTitle')?.value || '';
        this.templateForm.patchValue({
          cardTitle:cardTitle + '[custom_var]'
      });
      }
      if (type=='mess'){
        const mess= this.templateForm.get('messagecontent')?.value || ''
        this.templateForm.patchValue({
          messagecontent: mess+ '[custom_var]'
      });
      }
   
  }

  addVariableToSuggestion(type:string, i:number){
    const arr =this.templateForm.get('suggestions') as FormArray
    if(type=='SuggestionText'){
      const suggestion=this.templateForm.get('suggestions')?.value[i].text
      
      arr.at(i).patchValue({
        text:suggestion + '[custom_var]'
      })
    }
    if(type=='SuggestionPostBack'){
      const postback=this.templateForm.get('suggestions')?.value[i].postback
      arr.at(i).patchValue({
        postback:postback + '[custom_var]'
      })
    }
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
  addTepmlate()
  {
    this.addPage=true

  }

  viewTemplate(){
    this.ViewPage=true
  }
  selectCard(index: number) {
    this.selectedCardIndex = index 
    console.log(this.carouselList[index])
    this.templateForm.patchValue({
      cardTitle: this.carouselList[index].cardTitle,
      cardDescription :this.carouselList[index].cardDescription,

    })
    this.updateValue(index)
  }
  updateValue(i: number) {
    const selectedCard = i<=0 ?this.carouselList[i] : this.carouselList[this.selectedCardIndex];
  
    // Update the selected card index
    this.selectedCardIndex = i;
  
    // Unsubscribe from the previous valueChanges subscription (if exists)
    if (this.valueChangesSubscription) {
      this.valueChangesSubscription.unsubscribe();
    }
  
    // Clear and populate the suggestionsFormArray dynamically
    this.suggestionsFormArray.clear();
    selectedCard.suggestions.forEach(suggestion => {
      this.suggestionsFormArray.push(
        this.fb.group({
          type: [{ value: suggestion.suggestionType, disabled: true }],
          text: [{ value: suggestion.displayText, disabled: true }],
          postback: [{ value: suggestion.postback, disabled: true }],
          url: [{ value: suggestion.url, disabled: true }],
          phoneNumber: [{ value: suggestion.phoneNumber, disabled: true }],
          latitude: [{ value: suggestion.latitude, disabled: true }],
          longitude: [{ value: suggestion.longitude, disabled: true }],
          label: [{ value: suggestion.label, disabled: true }],
          query: [{ value: suggestion.query, disabled: true }],
          title: [{ value: suggestion.title, disabled: true }],
          description: [{ value: suggestion.description, disabled: true }],
          date: [{ value: suggestion.date, disabled: true }],
          startTime: [{ value: suggestion.startTime, disabled: true }],
          endTime: [{ value: suggestion.endTime, disabled: true }],
          timeZone: [{ value: suggestion.timeZone, disabled: true }]
        })

      );
    });
  
    // Patch the form with selected card data
    this.templateForm.patchValue({
      cardTitle: selectedCard.cardTitle,
      cardDescription: selectedCard.cardDescription
    });
  
    // Subscribe to form changes dynamically and update the corresponding card
    this.valueChangesSubscription = this.templateForm.valueChanges.subscribe(values => {
      if (this.selectedCardIndex !== null) {
        // const updatedSuggestions = this.suggestionsFormArray.getRawValue();
        // console.log(updatedSuggestions)
        // Update the selected card in the carousel list
        this.carouselList[this.selectedCardIndex] = {
          ...this.carouselList[this.selectedCardIndex],
          cardTitle: values.cardTitle,
          cardDescription: values.cardDescription,
          suggestions: this.transformSuggestions(this.suggestionsFormArray.getRawValue())
        };
      }
    });
  }
  
  

  onBotSelect(id: string): void {
    
     console.log('Selected Bot ID:', id);

    let dte = {
      "loggedInUserName": sessionStorage.getItem('USER_NAME'),
      "botId": id
    };

    this.templateService.editbotdetail(dte).subscribe({
      next: (response: any) => {
        if (response.result === 'Success' && response.data?.botData) {
          const botData = response.data.botData;
          const creationData = botData.creationData.data;


      

          // Set other properties
          this.imageUrl = creationData.botLogoUrl || '';
          this.backgroundUrl = creationData.bannerLogoUrl || '';

          const botSummary = creationData.botDescription?.[0]?.botSummary || '';

          // Prepare complete form data with all fields
          const formData = {
            botName: botData.botName,
            messageType: botData.botType,
            brandName: creationData.brandDetails?.brandName || '',
            
            primaryphone: creationData.bot?.phoneList?.[0]?.value || '',
            labelphone: creationData.bot?.phoneList?.[0]?.label || '',
            primarywebsite: creationData.bot?.websiteList?.[0]?.value || '',
            labelwebsite: creationData.bot?.websiteList?.[0]?.label || '',
            primaryemail: creationData.bot?.emailList?.[0]?.value || '',
            emailLabel: creationData.bot?.emailList?.[0]?.label || '',
            region: botData.creationData.region || '',
            chatbotwebhook: creationData.rcsBot?.webhookUrl || '',
            privacypolicyurl: creationData.bot?.privacyUrl || '',
            Url: creationData.bot?.termsAndConditionsUrl || '',
            botSummary: botSummary,
            language: creationData.rcsBot?.languageSupported || '',
            // Store additional UI-related properties
            
          };

          // Store complete data in sessionStorage
          sessionStorage.setItem('botFormData', JSON.stringify(formData));

          // Patch the form with complete data
          this.validateForm.patchValue(formData);

          // Apply icon color after form is updated
          //setTimeout(() => this.applyIconColor(), 0);

          //console.log('Form patched successfully:', this.validateForm.value);
        } else {
          console.error('Invalid API response:', response);
        }
      },
      error: (error:any) => {
        console.error('Failed to fetch bot details:', error);
      }
    });

  }
  
  

  addCard() {
    if (this.carouselList.length < 10) {
      //this.cards.push({ id: this.cards.length + 1, previewUrl: null });
      this.carouselList.push({
      cardTitle:"",
      cardDescription:"",
      mediaUrl:"",
      suggestions:[],
      thumbnailFileName:"",
      thumbnailUrl:""
      })
      
    }
  }

  

  deleteCard(index: number) {
    this.cards.splice(index, 1);
    this.carouselList.splice(index,1)
  }

  constructor(
    private fb: FormBuilder, 
    private sanitizer: DomSanitizer,
    private templateMessageService: TemplateMessageService,
    private toastService: ToastService,
    private templateService: TemplateService,
     private template: TemplateMessageService , 
  ) {
    // this.suggestions = this.fb.array([]);
    this.validateForm = this.fb.group({
      botName: [{ value: '', disabled: 'true' }],
      brandName: [{ value: '', disabled: 'true' }],

      //to: ['', [Validators.required]],
      color: [{ value: '', disabled: 'true' }],
      primaryphone: [{ value: '', disabled: 'true' }],
      labelphone: [{ value: '', disabled: 'true' }],
      primarywebsite: [{ value: '', disabled: 'true' }],
      labelwebsite: [{ value: '', disabled: 'true' }],
      primaryemail: [{ value: '', disabled: 'true' }],
      emailLabel: [{ value: '', disabled: 'true' }],
      region: [{ value: '', disabled: 'true' }],
      messageType: [{ value: '', disabled: 'true' }],
      billingCategory: [{ value: '', disabled: 'true' }],
      bannerimage: [{ value: '', disabled: 'true' }],
      language: [{ value: '', disabled: 'true' }],
      botlogo: [{ value: '', disabled: 'true' }],
      Url: [{ value: '', disabled: 'true' }],
      privacypolicyurl: [{ value: '', disabled: 'true' }],
      chatbotwebhook: [{ value: '', disabled: 'true' }],
      botSummary: [{ value: '', disabled: 'true' }],
      scheduleMessage: [{ value: '', disabled: 'true' }]
    });
    this.templateForm = this.fb.group({
      botid:[{value:'',disabled:true}],
      type: [{value: this.templateType, disabled: true}, Validators.required],
      name: [{value: '', disabled: true}, Validators.required],
      fallbackText: [{value: '', disabled: true}, Validators.required],
      height:[{value: '', disabled: true}],
      width:[{value: '', disabled: true}],
      alignment: [{value: this.alignmenttype, disabled: true}, Validators.required],
      cardTitle: [{value: '', disabled: true}, [Validators.required, Validators.maxLength(200)]],
      messagecontent:[{value: '', disabled: true}, [Validators.required, Validators.maxLength(2500)]],
      messageBody:[{value: '', disabled: true}, [Validators.required, Validators.maxLength(2000)]],
      cardOrientation:[{value: '', disabled: true}],
      cardDescription: [{value: '', disabled: true}, [Validators.required, Validators.maxLength(2000)]],
      standAloneFileName: [{value: '', disabled: true}],
      thumbnailFileName: [{value: '', disabled: true}],
      urlopen: [{value: '', disabled: true}, [Validators.required, Validators.maxLength(120)]],
      phonenumberdial:[{value: '', disabled: true}],
      fallback: [{value: 'no', disabled: true}, Validators.required],
      suggestions: this.fb.array([]),
      messageOrder:[{value: 'textTop', disabled: true}],
      documentFileName: [{value: '', disabled: true}],
      //messageBody: [{value: '', disabled: true}, [Validators.required, Validators.maxLength(2000)]],
    });
  }





  ngOnInit() {
    this.templateForm.get('alignment')?.valueChanges.subscribe(value => {
      this.alignment = value;
    });
    
    
    console.log(this.addPage)
    console.log(this.ViewPage)
  
    if (this.edit==false){
      this.templateForm.reset()
    }
    let data : any;
   
      const selectedtemplate = sessionStorage.getItem('template') 
      
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
              this.bot=res.botId
               this.onBotSelect(this.bot)

              this.data=res
              this.selectedBotName=res.botName
              const type=res.type
              // Initialize form with values
              if (type === 'rich_card'){
              this.fileUrl=res.standAlone.mediaUrl
              let isVideo = false;
              if (res.standAlone.mediaUrl) {
                const mediaUrl = res.standAlone.mediaUrl.toLowerCase();
                isVideo = mediaUrl.endsWith('.mp4') || mediaUrl.endsWith('.mov') || mediaUrl.endsWith('.avi') || mediaUrl.endsWith('.webm');
              }

              this.templateForm.patchValue({
                type: res.type,
                name: res.name,
                height: res.height,
                alignment: res.alignment,
                width: res.width,
                cardTitle: res.standAlone.cardTitle,
                messagecontent: res.textMessageContent,
                cardOrientation: res.orientation,
                cardDescription: res.standAlone.cardDescription,
                standAloneFileName: isVideo ?res.standAlone.thumbnailUrl : res.standAlone.mediaUrl,
                thumbnailFileName: res.standAlone.thumbnailFileName,
              });
              if (res.standAlone.suggestions) {
                const suggestionsArray = this.templateForm.get('suggestions') as FormArray;
                suggestionsArray.clear();
                res.standAlone.suggestions.forEach((suggestion: any) => {
                    suggestionsArray.push(
                    this.fb.group({
                      type: [{ value: suggestion.suggestionType, disabled: true }],
                      text: [{ value: suggestion.displayText, disabled: true }],
                      postback: [{ value: suggestion.postback, disabled: true }],
                      url: [{ value: suggestion.url, disabled: true }],
                      phoneNumber: [{ value: suggestion.phoneNumber, disabled: true }],
                      latitude: [{ value: suggestion.latitude, disabled: true }],
                      longitude: [{ value: suggestion.longitude, disabled: true }],
                      label: [{ value: suggestion.label, disabled: true }],
                      query: [{ value: suggestion.query, disabled: true }],
                      title: [{ value: suggestion.title, disabled: true }],
                      description: [{ value: suggestion.description, disabled: true }],
                      date: [{ value: suggestion.date, disabled: true }]
                    })
                    );
                });
              }
              }
            if(type==='carousel'){
                this.templateForm.patchValue({
               
                  type: res.type,
                  name: res.name,
                  height: res.height,
                  alignment: res.alignment,
                  width: res.width,
                  
                  
                });
                this.selectedCardIndex=0
                
                this.suggestionsFormArray.clear();
                this.carouselList = res.carouselList.map((item: any) => ({
                cardTitle: item.cardTitle || "",
                cardDescription: item.cardDescription || "",
                mediaUrl: item.mediaUrl || "",
                suggestions:
                  item.suggestions?.map((suggestion: any) => ({
                    suggestionType: suggestion.suggestionType || "",
                    displayText: suggestion.displayText || "",
                    postback: suggestion.postback || "",
                    url: suggestion.url || "",
                    phoneNumber: suggestion.phoneNumber || "",
                    latitude: suggestion.latitude || null,
                    longitude: suggestion.longitude || null,
                    label: suggestion.label || "",
                    query: suggestion.query || "",
                    title: suggestion.title || "",
                    description: suggestion.description || "",
                    date: suggestion.date || "",
                  })) || [],
              }));
              this.updateValue(this.selectedCardIndex)
              }
            if(type === 'text_message'){
              this.templateForm.patchValue({
               
                type: 'TextMessage',
                name: res.name,
                messagecontent: res.textMessageContent
                
              });
              if (res.suggestion) {
                const suggestionsArray = this.templateForm.get('suggestions') as FormArray;
                suggestionsArray.clear();
                res.suggestion.forEach((suggestion: any) => {
                    suggestionsArray.push(
                    this.fb.group({
                      type: [{ value: suggestion.suggestionType, disabled: true }],
                      text: [{ value: suggestion.displayText, disabled: true }],
                      postback: [{ value: suggestion.postback, disabled: true }],
                      url: [{ value: suggestion.url, disabled: true }],
                      phoneNumber: [{ value: suggestion.phoneNumber, disabled: true }],
                      latitude: [{ value: suggestion.latitude, disabled: true }],
                      longitude: [{ value: suggestion.longitude, disabled: true }],
                      label: [{ value: suggestion.label, disabled: true }],
                      query: [{ value: suggestion.query, disabled: true }],
                      title: [{ value: suggestion.title, disabled: true }],
                      description: [{ value: suggestion.description, disabled: true }],
                      date: [{ value: suggestion.date, disabled: true }]
                    })
                    );
                });
              }


            }
            if(type === 'text_message_with_pdf'){
              this.templateForm.patchValue({
                type: 'TextMessagewithpdf',
                name: res.name,
                messageBody: res.textMessageContent,
                documentFileName: res.documentFileName,
                messageOrder: res.messageOrder==='text_message_at_top' ? 'textTop' : 'textBottom',
              });
            }
              
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
        console.error('No bot template found.');
      }
    let dt = {
      loggedInUserName: sessionStorage.getItem('USER_NAME'),
    }
    this.templateService.getallbotdetail(dt).subscribe(
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
  get suggestionsFormArray(): FormArray {
    return this.templateForm.get('suggestions') as FormArray;
  }

  addSuggestion(): void {
    console.log(this.suggestionsFormArray.length)
    if (this.suggestionsFormArray.length <= 3) {

      this.suggestionsFormArray.push(
        this.fb.group({
          type: [{ value: 'reply', disabled: true }, Validators.required],
          text: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(25)]],
          postback: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(120)]],
          url: [{ value: '', disabled: true }, [Validators.maxLength(120)]],
          phoneNumber: [{ value: '', disabled: true }],
          latitude: [{ value: '', disabled: true }],
          longitude: [{ value: '', disabled: true }],
          label: [{ value: '', disabled: true }],
          query: [{ value: '', disabled: true }],
          title: [{ value: '', disabled: true }],
          description: [{ value: '', disabled: true }],
          date: [{ value: '', disabled: true }],
          startTime: [{ value: '', disabled: true }],
          endTime: [{ value: '', disabled: true }],
          timeZone: [{ value: '', disabled: true }]
        })
      );
      // Show an error message or disable the button
      
    }
    else{
      this.err=('*You can only add up to 4 suggestions.');
      return;
    }
    
  }
  // Remove suggestion
  removeSuggestion(index: number): void {
    this.suggestionsFormArray.removeAt(index);
  }

  // Getter for fallback enabled
  get isFallbackEnabled() {
    return this.templateForm.get('fallback')?.value === 'yes';
  }

  updateSuggestionText(index: number, text: string): void {
    this.Suggestiontext = text; // Update global variable
  }
  


  // Add suggestion




onActionTypeChange(value: string) {
  this.selectedActionType = value;
  // const typeValue = this.suggestionsFormArray.at(i).get('type')?.value;
  // console.log(typeValue);

  // Reset URL input when other than 'urlaction' is selected
  if (value !== 'url_action') {
    this.templateForm.patchValue({ urlopen: null });
  }
  if (value !== 'dialer_action') {
    this.templateForm.patchValue({ phonenumberdial: null });
  }

 }

  // Remove suggestion
  formatDate(isoDate: string): string {
    let date = new Date(isoDate);
  
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  
  // Transform suggestions to API format
  transformSuggestions(suggestions: any[]): any[] {
    return suggestions.map(suggestion => {
      switch (suggestion.type) {
        case 'url_action':
          return {
            suggestionType: 'url_action',
            url: suggestion.url,
            displayText: suggestion.text,
            postback: suggestion.postback,
 
          };
        case 'dialer_action':
          return {
            suggestionType: 'dialer_action',
            phoneNumber: suggestion.phoneNumber,
            displayText: suggestion.text,
            postback: suggestion.postback,
          };

          case 'view_location_latlong':
            return {
              suggestionType: 'view_location_latlong',
              latitude: suggestion.latitude,
              longitude: suggestion.longitude,
              postback: suggestion.postback,
              displayText: suggestion.text,
              label: suggestion.Label
            };

        case 'reply':
          return {
            suggestionType: 'reply',
            displayText: suggestion.text,
            postback: suggestion.postback,
            //Query: suggestion.Query
          };
        case "view_location_query":
          return{
            suggestionType: "view_location_query",
            displayText: suggestion.text,
            postback: suggestion.postback,
            query: suggestion.query
          }

        case 'share_location':
          return{
            suggestionType: "share_location",
            displayText: suggestion.text,
            postback: suggestion.postback
          }
        case 'calendar_event':
          let date=suggestion.date
          console.log(date)
          return{
            suggestionType: "calendar_event",
            displayText: suggestion.text,
            postback: suggestion.postback,
            startTime: this.formatDate(suggestion.startTime),
            endTime: this.formatDate(suggestion.endTime),
            title: suggestion.title,
            description: suggestion.description,
            timeZone: suggestion.timeZone
          }
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
  
  onCropImaeg(){
    const img =this.croppedImage
    
  }

  handlePreview = (file: any): Promise<string> => {
    return Promise.resolve(file.url || file.thumbUrl);
  };


  uploadImage(event: any, cardIndex: number) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.carouselList[cardIndex].mediaUrl = e.target.result;
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
    
    
    

  // beforeUpload = (file: File): boolean => {
  //   // Validate file type or size if needed
  //   this.templateForm.patchValue({ pdfFile: file });
  //   this.uploadedFileSize = file.name;
  //   return false;
  // };

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
  


}