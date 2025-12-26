import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ToastService } from 'src/app/shared/toast-service.service';
import { TemplateMessageService } from 'src/app/service/template-message.service';
import { TemplateService } from 'src/app/service/template-service.service';

import { NzCarouselComponent } from 'ng-zorro-antd/carousel';

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
  selector: 'app-update-template',
  templateUrl: './update-template.component.html',
  styleUrls: ['./update-template.component.scss']
})
export class UpdateTemplateComponent {
  @ViewChild('carouselRef', { static: false }) carousel!: NzCarouselComponent;
  cards: { id: number; previewUrl: string | null }[] = [
  
  ];
  fileList = [];
  error=true
  err = "";
  addPage: boolean = true;
  ViewPage: boolean = false;
  imageHeight = 120;
  orientation = 'vertical';
  selectedCardIndex: any;
  templateType: string = 'rich_card'; 
  templateForm!: FormGroup;
  alignmenttype: string = 'LEFT'; 
  cardTitle: string = '';
  cardDescription: string = '';
  carouselList: { cardTitle: string; cardDescription: string; mediaUrl: string | null; suggestions: any[] }[] = [
    { cardTitle: '', cardDescription: '', mediaUrl: "", suggestions: [] },
    { cardTitle: '', cardDescription: '', mediaUrl: "", suggestions: [] },
  ];
  type: string = 'rich_card';
  alignment: string = 'LEFT'; 
  newbot: Bot[] = [];
  selectedActionType: string = ''; // Default empty
  messageTemplates: any = [];
  messageBody: boolean = true;
  TextMessage: boolean = true;
  bot: any;
  fallbackSmsContent: string = ''; 
  carddescription: string = '';
  Suggestiontext: string = '';
  selectedBotName: string = ''; // Default value
  messagecontent: string = '';
  previewUrl: string | null = null;
  uploadedFileSize: string | null = null;
  uploadedFileUrl: string | null = null;
  edit: boolean = false;
  data: any;
  valueChangesSubscription: any; // Store subscription to unsubscribe later
  isVisible = false;  
  isConfirmLoading = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  selectedFile: NzUploadFile | null = null;
  file: File | null = null;
  filename: string = "";
  fileUrl: string = "";
  fileType: string = "";
  
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
    this.error=false
    this.selectedCardIndex = index 
    this.carousel.goTo(index)
    console.log(this.carouselList[index])
    this.updateValue(index)
  }
  updateValue(i: number) {
    const selectedCard = this.carouselList[i];
  
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
          type: [suggestion.suggestionType],
          text: [suggestion.displayText],
          postback: [suggestion.postback],
          url: [suggestion.url],
          phoneNumber: [suggestion.phoneNumber],
          latitude: [suggestion.latitude],
          longitude: [suggestion.longitude],
          label: [suggestion.label],
          query: [suggestion.query],
          title: [suggestion.title],
          description: [suggestion.description],
          date: [suggestion.date]
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
  
  

  onBotSelect(botId: string): void {
    const selectedBot: Bot | undefined = this.newbot.find((bot: Bot) => bot.botId === botId);
    this.selectedBotName = selectedBot ? selectedBot.botName : 'VTS';
  }
  
  

  addCard() {
    if (this.carouselList.length < 10) {
      //this.cards.push({ id: this.cards.length + 1, previewUrl: null });
      this.carouselList.push({
      cardTitle:"",
      cardDescription:"",
      mediaUrl:"",
      suggestions:[]
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
    
    this.templateForm = this.fb.group({
      botid:[''],
      type: [this.templateType, Validators.required],
      name: ['', Validators.required],
      fallbackText: ['', Validators.required],
      height:[''],
      width:[''],
      alignment: [this.alignmenttype, Validators.required],
      //fileName: [],
      cardTitle: ['', Validators.required],
      messagecontent:[''],
      cardOrientation:[''],
      cardDescription: ['', [Validators.required, Validators.maxLength(200)]],
      standAloneFileName: [''],
      thumbnailFileName: [''],
      urlopen: ['', [Validators.required, Validators.maxLength(120)]],
      phonenumberdial:['',],
      // Latitude:     ['',],
      // Longitude:     ['',],
      // Label:    [''],
      //fallback: ['no', Validators.required],
      suggestions: this.fb.array([])
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
              this.data=res
              const type= res.type
              this.selectedBotName=res.botName
              // Initialize form with values
              if (type === 'rich_card'){
                this.previewUrl=res.standAlone.mediaUrl
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
                  standAloneFileName: res.standAlone.mediaUrl,
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
  
                  
                  this.suggestionsFormArray.clear();
                  res.carouselList.forEach((item: any, index: number) => {
                    this.carouselList[index].cardTitle=item.cardTitle
                    this.carouselList[index].cardDescription=item.cardDescription
                    this.carouselList[index].mediaUrl=item.mediaUrl
                    this.carouselList[index].suggestions = item.suggestions.map((suggestion: any) => ({
                      suggestionType: suggestion.suggestionType,
                      displayText: suggestion.displayText,
                      postback: suggestion.postback,
                      url: suggestion.url,
                      phoneNumber: suggestion.phoneNumber,
                      latitude: suggestion.latitude,
                      longitude: suggestion.longitude,
                      label: suggestion.label,
                      query: suggestion.query,
                      title: suggestion.title,
                      description: suggestion.description,
                      date: suggestion.date
                    }));
                  });
  
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
                            type: [suggestion.suggestionType],
                            text: [suggestion.displayText],
                            postback: [suggestion.postback],
                            url: [suggestion.url],
                            phoneNumber: [suggestion.phoneNumber],
                            latitude: [suggestion.latitude],
                            longitude: [suggestion.longitude],
                            label: [suggestion.label],
                            query: [suggestion.query],
                            title: [suggestion.title],
                            description: [suggestion.description],
                            date: [suggestion.date]
                          })
                        );
                    });
                  }
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
        console.error('No bot details found.');
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
          type: ['reply', Validators.required],
          text: ['', [Validators.required, Validators.maxLength(25)]],
          postback: ['', [Validators.required, Validators.maxLength(120)]],
          url: ['', [Validators.maxLength(2000)]],
          phoneNumber: [''],
          latitude: [''],
          longitude: [''],
          label: [''],
          query: [''],
          title: [''],
          description: [''],
          date: [''],
          startTime: [''],
          endTime: [''],
          timeZone: ['']
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
  onSubmit() {
    console.log("Form submitted"); // Check if function is triggered
  
  
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
          // fallbackText: formData.fallbackText,
          type: "rich_card",
          height: formData.height,
          alignment: formData.alignment,
          orientation:formData.cardOrientation,
          // width: formData.width,
          //mediaUrl: this.fileUrl,
          standAlone: {
            cardTitle: formData.cardTitle,
            cardDescription: formData.cardDescription,
            mediaUrl: this.fileUrl,
            thumbnailFileName: this.filename,
            suggestions: this.transformSuggestions(formData.suggestions)
          }
        }
      };
    } 

    else if(formData.type === "carousel"){
      dt = {
        loggedInUserName: sessionStorage.getItem('USER_NAME'),
        botId:formData.botid,
        richTemplateData: {
          name: formData.name,
          type: "carousel",
          height: formData.height,
          width: formData.width,
          carouselList:this.carouselList
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
  
    if (dt){
      this.templateService.editTemplate(dt).subscribe({
        next: (res: any) => {
          console.log('API Response:', res);
          if (res.result?.toLowerCase() === 'success' && res.data) {
            window.location.reload(); 
            this.toastService.publishNotification('success', res.message, 'success');
          } else {
            this.toastService.publishNotification('error', res.message, 'error');
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
  
  onCropImaeg(){
    const img =this.croppedImage
    
  }
  onFileChange(): void {
    //const file = event.file.originFileObj;
    const file= this.imageChangedEvent;
    const reader = new FileReader();
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const maxImageSize = 2 * 1024 * 1024; // 2MB
    const maxVideoSize = 10 * 1024 * 1024; // 10MB



    // if (file) {
    //   if (validImageTypes.includes(file.type) && file.size <= maxImageSize) {
    //     const img = new Image();
    //     img.onload = () => {
    //       if (img.width / img.height === 3 / 1 && img.width === 1440 && img.height === 480) {
    //         reader.onload = () => {
    //           this.previewUrl = reader.result as string;
    //           this.carouselList[this.selectedCardIndex].fileName = this.previewUrl;
    //         };
    //         reader.readAsDataURL(file);
    //       } else {
    //         alert('Image must be 3:1 aspect ratio and 1440x480 resolution.');
    //       }
    //     };
    //     img.src = URL.createObjectURL(file);
    //   } else if (file.type.startsWith('video/') && file.size <= maxVideoSize) {
    //     reader.onload = () => {
    //       this.previewUrl = reader.result as string;
    //       this.carouselList[this.selectedCardIndex].fileName = this.previewUrl;
    //     };
    //     reader.readAsDataURL(file);
    //   } else {
    //     alert('Invalid file type or size. Please upload an image (JPEG, JPG, PNG, GIF) with max size 2MB or a video with max size 10MB.');
    //   }
    // }
  }

  // onFileChange(event: any): void {
  //   const file = event.file.originFileObj;
  //   const reader = new FileReader();
  //   console.log(file)
  //   reader.onload = () => {
  //     this.previewUrl = reader.result as string;
  //     this.carouselList[this.selectedCardIndex].fileName = this.previewUrl;
      
  //   };
  //   console.log(this.previewUrl)
  //   reader.readAsDataURL(file);
  // }
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