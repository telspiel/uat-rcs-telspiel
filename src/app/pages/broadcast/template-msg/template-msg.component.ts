import { Component, OnInit, ElementRef, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { SEND_TEMPLATE_MODEL, TEMPLATES, TEMPLATE_RESPONSE } from 'src/app/models/templateModel';
import { EditorToHtmlPipe } from 'src/app/pipes/editor-to-html.pipe';
import { TemplateMessageService } from 'src/app/service/template-message.service';
import { TemplateService } from 'src/app/service/template-service.service';
import { ToastService } from 'src/app/shared/toast-service.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NzTabPosition } from 'ng-zorro-antd/tabs';
import { BotServiceService } from 'src/app/service/bot-service.service';
import { Router } from '@angular/router';
import { UserCreationService } from 'src/app/service/user-creation.service';
import { BrandService } from 'src/app/service/brand.service';
import { ImageCroppedEvent, ImageCropperComponent, ImageTransform } from 'ngx-image-cropper';
import { NzIconService } from 'ng-zorro-antd/icon';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AbstractControl, ValidationErrors } from '@angular/forms';

export function noSpaceRegexValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value || '';
  const regex = /^\S+$/; // matches any non-space-only input
  return regex.test(value) ? null : { noSpaces: true };
}

interface Country {
  name: string;
  code: string;
  flag: string;
}


@Component({
  selector: 'app-template-msg',
  templateUrl: './template-msg.component.html',
  styleUrls: ['./template-msg.component.scss']
})
export class TemplateMsgComponent implements OnInit {
  nzTabPosition: NzTabPosition = 'top';
  selectedOperators: string[] = [];
  selectedApi: string = '';
  vtsBotTypes='new';  
  airtelTypes='new';
  vodafoneTypes='new';
  jioTypes='new';
  BSNLTypes='new';
  backgroundUrl: any;
  bannerurl: any;
  operatorlist: any;
  botLogoUrl: any;
  logourl: any;
  userdt:any;
  form: any;
  region: any;
  type: any;
  usertype="";
  userType:string |null
  role: string =sessionStorage.getItem('ROLE')||"";
  isVisible1 =false;
  isConfirmLoading1 = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  existingBots: any;
  originalImageWidth: any;
  file!: File;
  filename!: string; // Non-null assertion operator
  logColor() {
    console.log(this.selectedColor); // Logs the selected color
  }
  
  // formattedbotSummary: string = 'short description';

  bannerImageUrl: SafeUrl | null = null;
  selectedCountryCode = '+91';
  botName: string = '';
  selectedValue = 'Conversational';
  botSummary: string = '';
  radioValue = '';
  imageUrl: string | null = null;
  imageUrl1 : SafeUrl | null = null
  selectedReseller: string | null = null;
  selectedSeller: string | null = null;
  selectedClient: string | null = null;
  selectedadmin: string | null = null;
  isdisabled=false;
  // operators = [
  //   { name: 'VTL', label: 'VTL' },
  //   { name: 'AIRTEL', label: 'AIRTEL' },
  //   { name: 'VODAFONE', label: 'VODAFONE' },
  //   { name: 'RELIANCE_JIO', label: 'RELIANCE JIO' },
  //   { name: 'BSNL', label: 'BSNL' }
  // ];
  
  operators : any []=[]
  operatorForm!: FormGroup;
  botExist:boolean=false;
  // backgroundUrl: SafeUrl | null = null;
  scheduleMessage: string = 'no';
  transformedData: any;
  validateForm: FormGroup 
  senderTo = 'Conversational';
  listTemplates: TEMPLATES[] = []; // Initialize an empty array to store the fetched templates.
  selectedTemplateData: TEMPLATE_RESPONSE | undefined;
  language:string =""
  body: any;
  newMessagePreviewTemplate: { template?: TEMPLATE_RESPONSE, data?: any } = {};
  previewVisibility = false;
  filterPipe = new EditorToHtmlPipe();
  edit:boolean=false;
  operator:any
  selectForm: FormGroup;
  Clientlist : any []=[]
  ResllerList : any []=[]
  Adminlist: any;
  loggedInUserName: string = '';
  SellerList :any []=[]
  Reseller="";
  botCondition='new'
  selectedColor: string = '#000000';
  Seller="";
  apiData: any[] = [];
  client="";
  Admin: any;
  botType='new';
  brandDataList: any[] = [];
  isVisible = false;
  isDisabled=false
  isConfirmLoading = false;
  err:string="";
  err1:string="";
  originalImageHeight=0
  operatorsList = [
    { value: 'VTL', label: 'VED TECH LABS' },
    { value: 'AIRTEL', label: 'AIRTEL' },
    { value: 'VODAFONE', label: 'VODAFONE' },
    { value: 'RELIANCE_JIO', label: 'RELIANCE JIO' },
    { value: 'BSNL', label: 'BSNL' }
  ];
  transform: ImageTransform = {
    scale: 1.2, 
    rotate: 0, // rotate 90 degrees
    flipH: false,
    flipV: false
  };
  imagewidth=0
  imageheight=0
  fileType: string = '';
  imageBase64: string = '';
@ViewChild(ImageCropperComponent) cropper!: ImageCropperComponent;
selectedFile1: File | null = null;

onFileupload(event: NzUploadChangeParam, type:string): void {
  const file = event.file.originFileObj;

  if (type === 'logo') {
    if (!file || file.size > 90 * 1024) {
      this.err = '*Only files under 90KB are allowed.';
      return;
    }
  }
  if (type === 'banner') {
    if (!file || file.size > 360 * 1024) {
      this.err = '*Only files under 360KB are allowed.';
      return;
    }
  }

  if (file) {
    this.err = '';
    this.selectedFile1 = file;
    console.log(this.selectedFile1);
    this.fileType = file.type.split('/')[1] || "";
  }
}
onImageCropped(base64: string) {
  
  this.imageBase64 = base64;
}


base64ToBlob(base64: string, contentType:any): Blob {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}
forceCrop() {
  if (this.cropper) {
    this.cropper.crop(); // Forces a crop and triggers `imageCropped`
  }
}
beforeUpload = (file: NzUploadFile): boolean => {
  if (!file) return false;

 
  // Convert file into an event-like structure for ngx-image-cropper
  const event = { target: { files: [file] } };
  this.imageChangedEvent = event; // Pass event to the cropper

  return false; // Prevent default upload behavior
};

imageLoaded() {

 
    // show cropper
}
cropperReady() {
  this.zone.runOutsideAngular(() => {
    setTimeout(() => {
      this.zone.run(() => {
        this.cdr.detectChanges();
        this.forceCrop();
      });
    }, 200); // Try increasing delay if still inaccurate
  });
    // cropper ready
}
loadImageFailed() {
    // show message
}

  showModal(): void {
    this.isVisible = true;
  }

  imageCropped(event: ImageCroppedEvent) {
    console.log(event)
    if (event.objectUrl) {
      this.croppedImage = event.objectUrl; 
    }
    this.imagewidth= event.width
    this.imageheight= event.height

    console.log("Cropped image:", event);
  }
  

  generateRandomFilename(): string {
    const randomNum = Math.floor(Math.random() * 1000000); // Generate a random number
    return `file_${randomNum}.${this.fileType}`; // Return the filename with the random number
  }
  
  handleOk(){
    this.isConfirmLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isConfirmLoading = false;
    
    //this.onFileChange()
    this.file = new File(
      [this.base64ToBlob(this.imageBase64 as string, this.fileType)], 
      this.filename, 
      { type: this.fileType, lastModified: Date.now() }
    );

    if(this.file){
    const formData = new FormData();
    formData.append('file', this.file! as Blob, this.generateRandomFilename());
    const userName = sessionStorage.getItem('USER_NAME');
    if (userName) {
      formData.append('userName', userName);
    }
    

    this.templateService.uploadFile(formData).subscribe(
      (res)=>{
        //console.log(res)
        this.imageUrl=res.fileUploadLocation
       
        this.selectedFile1= null
      }
    )
    this.isVisible = false;
  }}, 1000);
  
 
  }
  convertBlobToFile(blobUrl: string, fileName: string): Promise<File> {
    return fetch(blobUrl)
      .then((res) => res.blob()) 
      .then((blob) => new File([blob], fileName, { type: blob.type })); 
  }


  handleCancel(): void {
    this.isVisible = false;
    this.imageChangedEvent=""
    this.selectedFile1= null
    this.err=""
  }

  handleCancel1(): void {
    this.isVisible1 = false;
    this.imageChangedEvent=""
    this.selectedFile1= null
    this.err=""
  }

  showModal1(): void {
    this.isVisible1 = true;
  }


  

  handleOk1(): void {
    this.isConfirmLoading = true;
    setTimeout(() => {
      this.isVisible1 = false;
      this.isConfirmLoading = false;
    
    //this.onFileChange()
    this.file = new File(
      [this.base64ToBlob(this.imageBase64 as string, this.fileType)], 
      this.filename, 
      { type: this.fileType, lastModified: Date.now() }
    );

    if(this.file){
    const formData = new FormData();
    formData.append('file', this.file! as Blob, this.generateRandomFilename());
    const userName = sessionStorage.getItem('USER_NAME');
    if (userName) {
      formData.append('userName', userName);
    }
    

    this.templateService.uploadFile(formData).subscribe(
      (res)=>{
        //console.log(res)
        this.backgroundUrl=res.fileUploadLocation
       
        this.selectedFile1= null
      }
    )
    
  }}, 1000);
  
 
  }

  convertBlobToFile2(blobUrl: string, fileName: string): Promise<File> {
    return fetch(blobUrl)
      .then((res) => res.blob()) // Fetch blob data
      .then((blob) => new File([blob], fileName, { type: blob.type })); // Convert to File
  }

  isBotExisting(event:any){
    const value =  this.validateForm.get('botName')?.value;
    console.log(value)
        const obj= {
      loggedInUserName:sessionStorage.getItem('USER_NAME'),
      botName: value,
      
    }
    this.templateService.getApprovedBotByBotName(obj).subscribe((res:any)=>{
      if (res.message==='Bot Name Available' && res.result==='Success'){
        //console.log(res)
        this.botExist=false
        // this.notifyService.publishNotification('Failed', 'Bot name already exists', 'error');
      
      }
      else{
       this.botExist=true 
       this.validateForm.get('botName')?.setErrors({ 'existingBot': true });

      }
      
    })
    


  }
  change(){
    console.log(this.operator)
  }
  constructor(private fb: FormBuilder,
    private ngxLoader: NgxUiLoaderService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private templateMessageService: TemplateMessageService,
    private toastService: ToastService,
    private router: Router,
    private templateService: TemplateService,
    private sanitizer: DomSanitizer,
    private notifyService: ToastService,
    private botService: BotServiceService,
    private userCreation: UserCreationService,
    private brandService: BrandService,
    private el: ElementRef,
    private iconService: NzIconService
  ) {

   
    this.iconService.addIconLiteral(
      'custom:globals',
      `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-40-82v-78q-33 0-56.5-23.5T360-320v-40L168-552q-3 18-5.5 36t-2.5 36q0 121 79.5 212T440-162Zm276-102q41-45 62.5-100.5T800-480q0-98-54.5-179T600-776v16q0 33-23.5 56.5T520-680h-80v80q0 17-11.5 28.5T400-560h-80v80h240q17 0 28.5 11.5T600-440v120h40q26 0 47 15.5t29 40.5Z"/></svg>`
    );
    this.iconService.addIconLiteral(
      'custom:call',
      `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor"><path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12ZM241-600l66-66-17-94h-89q5 41 14 81t26 79Zm358 358q39 17 79.5 27t81.5 13v-88l-94-19-67 67ZM241-600Zm358 358Z"/></svg>`
    );
    this.iconService.addIconLiteral(
      'custom:mail',
      `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/></svg>`
    );
    this.selectForm = this.fb.group({
      Reseller: [this.Reseller,],
      Seller: [this.Seller,],
      Client: [this.client,]
    })
    this.userType=(sessionStorage.getItem('ROLE'))
    const pattern = new RegExp(
          '^(https?:\\/\\/)?' + // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IP (v4) address
          '(\\:\\d+)?' + // port
          '(\\/[-a-z\\d%@_.~+&:]*)*' + // path
          '(\\?[;&a-z\\d%@_.,~+&:=-]*)?' + // query string
          '(\\#[-a-z\\d_]*)?$', 'i' // fragment locator
            );
    this.validateForm = this.fb.group({
      usertype: [this.usertype],
      botName: ['', [Validators.required]],
      brandName: ['', [Validators.required]],
      color: ['', [Validators.required]],
      primaryphone: [
      '', 
      [
        Validators.required,
        Validators.pattern(/^\d{10}$/) // Ensures exactly 10 digits
      ]
      ],
      labelphone: ['', [Validators.required]],
      primarywebsite: ['', [Validators.required,Validators.pattern(pattern)]],
      labelwebsite: ['', [Validators.required]],
      primaryemail: [
      '', 
      [
        Validators.required,
        Validators.email // Ensures the value is a valid email address
      ]
      ],
      emailLabel: ['', [Validators.required]],
      region: ["India" , [Validators.required]],
      messageType: ["Promotional", [Validators.required]],
      billingCategory: [this.senderTo],
      bannerimage: [''],
      language: [''],
      botlogo: [''],
      Url: ['', [Validators.required,Validators.pattern(pattern)]],
      privacypolicyurl: ['', [Validators.required,Validators.pattern(pattern)]],
      botSummary: ['', [Validators.required]],
      scheduleMessage: [this.scheduleMessage]
    });
  }

  get operatorData(): FormArray {
    return this.operatorForm.get('operatorData') as FormArray;
  }
  

 onOperatorChange(selectedOperators: string[]): void {
    const operatorDataArray = this.operatorForm.get('operatorData') as FormArray;

    // Clear existing operatorData form array
    while (operatorDataArray.length) {
      operatorDataArray.removeAt(0);
    }

    // Add form groups for each selected operator
    selectedOperators.forEach(operatorName => {
      // Find operator data from API response
      let operatorTemplateSecret: string | null = null;
      let operatorTemplateClientId: string | null = null;
      // let tps: number = 1;

      // Search API data for matching operator
      const operatorDataFromApi = this.apiData
        .flatMap(item => item.operatorData)
        .find(op => op.operatorName === operatorName);

      if (operatorDataFromApi) {
        operatorTemplateSecret = operatorDataFromApi.operatorTemplateSecret || null;
        operatorTemplateClientId = operatorDataFromApi.operatorTemplateClientId || null;
        // tps = operatorDataFromApi.tps || 1;
      }

      const isVodafone = operatorName === 'VODAFONE' || operatorName === 'Vi';
      const formGroup = this.fb.group({
        operatorName: [operatorName],
        // tps: [tps],
        isNewBot: [!isVodafone || (!operatorTemplateSecret && !operatorTemplateClientId)], // Set isNewBot to false for Vodafone with API data
        trafficVolume: [100],
        operatorBotId: [null],
        operatorBotSecret: [null],
        operatorBotStatus: ['PENDING'],
        operatorTemplateSecret: [operatorTemplateSecret],
        operatorTemplateClientId: [operatorTemplateClientId]
      });
      operatorDataArray.push(formGroup);
    });
  }


 ngOnInit(): void {

// Initialize form
    this.operatorForm = this.fb.group({
      selectedOperators: [[]],
      operatorData: this.fb.array([])
    });

    // Fetch and store API data for dropdown and operator details
    this.botService.viewtps(this.operator).subscribe(
      (res: any) => {
        this.apiData = res.data; // Store API response
        const selectedOperators = res.data[0]?.selectedOperators || [];
        const apiOperators = selectedOperators.map((op: string) => ({
          name: op,
          label: op
        }));

        console.log("API operator list:", apiOperators);
        this.operators = [...apiOperators]; // Populate dropdown options
        console.log("Complete operator list:", this.operators);
        // Do NOT pre-populate selectedOperators or operatorData
      },
      (err) => {
        console.error("Error in viewtps:", err);
      }
    );


    this.operatorForm = this.fb.group({
      selectedOperators: [[]], 
      
      operatorData: this.fb.array([]) // Holds form fields for selected operators
    });
    // ✅ Retrieve user details
    this.userdt = {
      loggedInUsername: sessionStorage.getItem('USER_NAME'),
      userId: sessionStorage.getItem('USER_ID')
    };
  
    // ✅ Fetch child users list
    this.userCreation.getAllChildForUser(this.userdt).subscribe((res) => {
      this.Adminlist = this.mapUserData(res.data.userAllChildMap.ADMIN);
      this.SellerList = this.mapUserData(res.data.userAllChildMap.SELLER);
      this.Clientlist = this.mapUserData(res.data.userAllChildMap.CLIENT);
      this.ResllerList = this.mapUserData(res.data.userAllChildMap.RESELLER);
    });

    this.loggedInUserName = sessionStorage.getItem('USER_NAME') || 'User';
    let dt = {
      loggedInUserName: sessionStorage.getItem('USER_NAME') || 'Guest',
    }
    this.templateService.getallbotdetail(dt).subscribe(
      (response: any) => {
        if (response.data && response.data.bots) {
          this.existingBots = response.data.bots; // Assign the bots array from the API response
        } else {
          console.error('Invalid API response:', response);
        }
      },
      (error) => {
        console.error('Failed to fetch bot data:', error);
      }
    );
  
    this.validateForm.get('botName')?.valueChanges.subscribe(value => this.botName = value);
    this.validateForm.get('botSummary')?.valueChanges.subscribe(value => this.botSummary = value);
    this.updateIconColors();
  }

  
  

  
  updateColorCode(event: any): void {
    this.selectedColor = event.target.value;
    this.updateIconColors();
  }
  updateColorFromText(event:any) {
    const hexPattern = /^#([0-9A-Fa-f]{6})$/;
    const colorValue = event.target.value;

    if (hexPattern.test(colorValue)) {
      this.selectedColor=colorValue ; // Update only if valid
    }
  }
  updateIconColors(): void {
    // Create a style element for this component only
    const componentElement = this.el.nativeElement;
    
    // Set the CSS variable on the component's host element
    componentElement.style.setProperty('--theme-icon-color', this.selectedColor);
    
    // Directly update all icons within this component only
    // const iconsInComponent = componentElement.getElementsbyClassName('icon-col');
    // iconsInComponent.forEach((icon: HTMLElement) => {
    //   icon.style.color = this.selectedColor;
    // });
  }
  
  /**
   * Function to fetch bot details from API and update form
   */
  fetchBotDetails(botId: string) {
    const dt = {
      loggedInUserName: sessionStorage.getItem('USER_NAME'),
      botId: botId
    };
  
    this.templateService.editbotdetail(dt).subscribe(
      (response) => {
        if (response.result === 'Success' && response.data?.botData) {
          const botData = response.data.botData;
          const creationData = botData.creationData.data;
          this.edit = true;
  
          const botSummary = creationData.botDescription[0]?.botSummary || '';
  
          // ✅ Prepare form data
          const formData = {
            botName: botData.botName,
            messageType: botData.botType,
            brandName: creationData.brandDetails?.brandName || '',
            color: creationData.agentColor || '',
            primaryphone: creationData.bot?.phoneList?.[0]?.value || '',
            labelphone: creationData.bot?.phoneList?.[0]?.label || '',
            primarywebsite: creationData.bot?.websiteList?.[0]?.value || '',
            labelwebsite: creationData.bot?.websiteList?.[0]?.label || '',
            primaryemail: creationData.bot?.emailList?.[0]?.value || '',
            emailLabel: creationData.bot?.emailList?.[0]?.label || '',
            region: botData.creationData.region || '',
            privacypolicyurl: creationData.bot?.privacyUrl || '',
            Url: creationData.bot?.termsAndConditionsUrl || '',
            botSummary: botSummary,
            language: creationData.rcsBot.languageSupported || ''
          };
  
          // ✅ Patch form with data
          this.validateForm.patchValue(formData);
          console.log('Form patched successfully:', this.validateForm.value);
        } else {
          console.error('Invalid API response:', response);
        }
      },
      (error) => console.error('Failed to fetch bot details:', error)
    );
  }
  
  /**
   * Function to map user data into label-value format
   */
  mapUserData(userData: any): any[] {
    return [userData].flatMap((obj: any) => 
      Object.entries(obj).map(([key, value]) => ({ label: key, value: value }))
    );
  }
  

  





  onResellerChange(selectedReseller: string) {
    this.selectedReseller = selectedReseller;
    this.selectedSeller = null;  // Reset Seller
    this.selectedClient = null;  // Reset Client
    this.fetchBrandData();
  }
  
  onSellerChange(selectedSeller: string) {
    this.selectedSeller = selectedSeller;
    this.selectedClient = null; 
    this.selectedReseller = null;
    this.fetchBrandData();
  }
  
  onClientChange(selectedClient: string) {
    this.selectedClient = selectedClient;
    this.selectedReseller = null;
    this.selectedSeller = null;

    this.fetchBrandData();
  }

  fetchBrandData() {
    let dt1 = {
    loggedInUserName: sessionStorage.getItem('USER_NAME'),
    resellerName: this.selectedReseller ?? "",
    sellerName: this.selectedSeller ?? "",
    clientName: this.selectedClient ?? "",

  };
  
    this.brandService.getAllbrandname(dt1).subscribe((res: any) => {
      console.log(res);
      if (res.data && res.data.dataList) {
        this.brandDataList = res.data.dataList; // Assign brand data to array
      }
    });
  }
  getRandomValue(): number {
    return Math.floor(Math.random() * 1000000);
  }
  getUserData(Value:string, type:string) {

    if(type=='reseller')
    {
      this.Admin=""
      this.Seller = ""
      this.client = ""
    }
    else if(type=='seller'){
      this.Reseller = ""
      this.client = ""
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
      this.client = ""
    }
  }


 


  onFileSelected(event: NzUploadChangeParam): void {
    const file = event.file.originFileObj;
    if (file) {
      // Validate image size (e.g., max 90KB)
      const maxSize = 90 * 1024; // 90KB
      if (file.size > maxSize) {
        this.err1 = 'Image size exceeds 90KB';
        return;
      }

      // Validate image dimensions (e.g., 224x224)
      const img = new Image();
      img.onload = () => {
        const requiredWidth = 224;
        const requiredHeight = 224;
        if (img.width !== requiredWidth || img.height !== requiredHeight) {
           this.err1 =`Image dimensions should be exactly ${requiredWidth}x${requiredHeight}`
          return;
        }

        const formData = new FormData();
        formData.append('file', file, file.name);
  
        const loggedInUserName = sessionStorage.getItem('USER_NAME');
        if (!loggedInUserName) {
          console.error('loggedInUserName is not available in sessionStorage');
          this.notifyService.publishNotification('Failed', 'User not logged in', 'error');
          return;
        }
  
        formData.append('type', 'logo');
        formData.append('loggedInUserName', loggedInUserName);
        console.log(file);
        //**Preview Image**
        const objectURL = URL.createObjectURL(file);
        //this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        this.botLogoUrl = objectURL;  // ✅ Store preview URL
        console.log('Bot Logo Preview URL:', objectURL);
  
        // **Call API to Upload**
        this.templateService.uploadbot(formData).subscribe(
          (response: { message: string, botlogo: string }) => {
            this.notifyService.publishNotification('Success', response.message);
            this.botLogoUrl = response.botlogo;  // ✅ Update botLogoUrl from API response
          },
          (err: { meta?: { developer_message: string }; message?: string }) => {
            const error = err.meta?.developer_message || err.message || 'An error occurred';
            console.error('Upload Error:', error);
            this.notifyService.publishNotification('Failed', error, 'error');
          }
        );
      };
      img.onerror = () => {
        this.notifyService.publishNotification('Failed', 'Invalid image file', 'error');
      };
      img.src = URL.createObjectURL(file);
    }
  }
  
  getStatus(controlName: string): 'error' | 'success'|  null {
    const control = this.validateForm.get(controlName);
    if (control?.touched && control?.invalid) {
      return 'error';
    }
    if (control?.valid) {
      return 'success';
    }
    return null;
  }


  onFileSelectedBackground(event: NzUploadChangeParam): void {
    const file = event.file.originFileObj;
    if (file) {
      // Validate image size (e.g., max 5MB)
      const maxSize = 360* 1024; // 90KB
      if (file.size > maxSize) {
        this.err='Image size exceeds 360kb';
        return;
      }

      // Validate image dimensions (e.g., min 1440x448)
      const img = new Image();
      img.onload = () => {
        const minWidth = 1440;
        const minHeight = 448;
        if (img.width < minWidth || img.height < minHeight) {
          this.err=`Image dimensions should be at least ${minWidth}x${minHeight}`
          return;
        }

        const formData = new FormData();
        formData.append('file', file, file.name);
  
        const loggedInUserName = sessionStorage.getItem('USER_NAME');
        if (!loggedInUserName) {
          console.error('loggedInUserName is not available in sessionStorage');
          this.notifyService.publishNotification('Failed', 'User not logged in', 'error');
          return;
        }
  
        formData.append('type', 'banner');
        formData.append('loggedInUserName', loggedInUserName);
  
        // **Preview Banner Image**
        const objectURL = URL.createObjectURL(file);
        this.bannerImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        this.backgroundUrl = objectURL;  // ✅ Store preview URL
        console.log('Banner Preview URL:', objectURL);
  
        // **Call API to Upload**
        this.templateService.uploadbot(formData).subscribe(
          (response: { message: string, bannerimage: string }) => {
            this.notifyService.publishNotification('Success', response.message);
            this.backgroundUrl = response.bannerimage;  // ✅ Update backgroundUrl from API response
          },
          (err: { meta?: { developer_message: string }; message?: string }) => {
            const error = err.meta?.developer_message || err.message || 'An error occurred';
            console.error('Banner Upload Error:', error);
            this.notifyService.publishNotification('Failed', error, 'error');
          }
        );
      };
      img.onerror = () => {
        this.notifyService.publishNotification('Failed', 'Invalid image file', 'error');
      };
      img.src = URL.createObjectURL(file);
    }
  }
  
  editBot(){
    const dt3=
      {
        loggedInUserName:sessionStorage.getItem('USER_NAME'),
        //customerType: this.validateForm.value.usertype,
        botName:this.validateForm.value.botName,
        creationData: {
          data: {
            bot: {
              privacyUrl: this.validateForm.value.privacypolicyurl,
              termsAndConditionsUrl: this.validateForm.value.Url,
              platform: "Android",
              phoneList: [
                {
                  value: this.validateForm.value.primaryphone,
                  label: this.validateForm.value.labelphone
                }
              ],
              emailList: [
                {
                  value:this.validateForm.value.primaryemail,
                  label:this.validateForm.value.emailLabel
                }
              ],
              websiteList: [
                {
                  value: this.validateForm.value.primarywebsite,
                  label: this.validateForm.value.labelwebsite
                }
              ]
            },
            rcsBot: {
              languageSupported: this.validateForm.value.language,
              agentMessageType: this.radioValue,
              // webhookUrl: this.validateForm.value.chatbotwebhook
            },
            botDescription: [
              {
                botName: this.validateForm.value.botName ,
                botSummary: this.validateForm.value.botSummary
              }
            ],
            botLogoUrl: this.imageUrl,
            // bannerLogoUrl: this.bannerImageUrl,
            bannerLogoUrl: '',
            agentColor: this.validateForm.value.color,
            brandDetails: {
              brandName: this.validateForm.value.brandName
            },
            carrierDetails: {
              carrierList: [1, 2, 3],
              globalReach: true
            }
          },
          region: this.region
        },
        //botName: "TestBotName"
        botType:this.validateForm.value.messageType
    }

    console.log(dt3)

    this.templateService.editBot(dt3).subscribe(
      (data: { message: string }) => {
        this.notifyService.publishNotification('Success', data.message);
        this.router.navigate(['/createbot'])
      },
      (err: { meta?: { developer_message: string }; message?: string }) => {
        const error = err.meta?.developer_message || err.message || 'An error occurred';
        this.notifyService.publishNotification('Failed', error, 'error');
      }
    );
  }


  onUserSelect(userType: string, value: string) {
    if (userType === 'admin') {
      this.selectedadmin = value;
      this.selectedReseller = null;
      this.selectedSeller = null;
      this.selectedClient = null;
    }
    else if (userType === 'reseller') {
      this.selectedReseller = value;
      this.selectedSeller = null;
      this.selectedClient = null;
      this.selectedadmin = null;
    } else if (userType === 'seller') {
      this.selectedSeller = value;
      this.selectedReseller = null;
      this.selectedClient = null;
      this.selectedadmin = null;
    } else if (userType === 'client') {
      this.selectedClient = value;
      this.selectedReseller = null;
      this.selectedSeller = null;
      this.selectedadmin = null;
    }
  }
   handleSelection(event: any): void {
  console.log('User selection:', event);
  this.selectedClient=event.client
  this.selectedReseller=event.reseller
  this.selectedSeller=event.seller
  console.log('Selected Client:', this.selectedClient);
  console.log('Selected Reseller:', this.selectedReseller); 
  this.fetchBrandData();
}
  submitForm(): void {
    this.isDisabled = true;
    
    if (this.validateForm.invalid) {
      this.ngxLoader.stop();
      this.isDisabled = false;
      this.notifyService.publishNotification('Error', 'Please fill all the required fields.', 'error');
      return;
    }
  
    const totalTrafficVolume = this.operatorForm.value.operatorData.reduce((sum: number, operator: any) => {
      return sum + (parseInt(operator.trafficVolume, 10) || 0);
    }, 0);
  
    if (totalTrafficVolume !== 100 && this.role ==='admin') {
      this.ngxLoader.stop();  
      this.isDisabled = false;
      this.notifyService.publishNotification('Error', 'Traffic volume should sum up to 100%', 'error');
      return;
    }
  
    if (!this.selectedClient) {
      this.ngxLoader.stop();
      this.isDisabled = false;
      this.notifyService.publishNotification('Error', 'Please select the client first !!!', 'error');
      return;
    }
  
    
  
    const dt1 = this.validateForm.value;
  
    if (this.edit === true) {
      this.ngxLoader.stop();
      this.editBot();
      return;
    }
  
    if (!dt1.primaryphone.startsWith('+91')) {
      dt1.primaryphone = '+91' + dt1.primaryphone;
    }
  
    if (!dt1.primarywebsite.startsWith('https')) {
      dt1.primarywebsite = 'https://' + dt1.primarywebsite;
    }
  
    if (!dt1.privacypolicyurl.startsWith('https')) {
      dt1.privacypolicyurl = 'https://' + dt1.privacypolicyurl;
    }
  
    if (!dt1.Url.startsWith('https')) {
      dt1.Url = 'https://' + dt1.Url;
    }
  
    const transformedData = {
      loggedInUserName: sessionStorage.getItem('USER_NAME'),
      creationData: {
        data: {
          bot: {
            privacyUrl: dt1.privacypolicyurl,
            termsAndConditionsUrl: dt1.Url,
            platform: "Google API",
            phoneList: [{ value: dt1.primaryphone, label: dt1.labelphone }],
            emailList: [{ value: dt1.primaryemail, label: dt1.emailLabel }],
            websiteList: [{ value: dt1.primarywebsite, label: dt1.labelwebsite }]
          },
          rcsBot: {
            languageSupported: dt1.language || "en",
            agentMessageType: dt1.messageType || "text"
          },
          botDescription: [{ botName: dt1.botName, botSummary: dt1.botSummary }],
          botLogoUrl: this.imageUrl,
          bannerLogoUrl: this.backgroundUrl,
          agentColor: dt1.color,
          brandDetails: { brandName: dt1.brandName },
          carrierDetails: { carrierList: [1, 2, 3], globalReach: true }
        },
        region: dt1.region || "India"
      },
      botName: dt1.botName,
      botType: dt1.messageType,
      resellerName: this.selectedReseller,
      sellerName: this.selectedSeller,
      clientName: this.selectedClient,
      adminName: this.selectedadmin,
      operatorData: this.operatorForm.value.operatorData
    };
    this.ngxLoader.start(); 
    this.templateService.submitBot(transformedData as unknown as FormData).subscribe({
      next: (res) => {
        this.ngxLoader.stop(); 
        if (res.result === "Success" || res.message === "Bot added successfully") {
          this.notifyService.publishNotification('Success', res.message);
          this.isDisabled = false;
          this.router.navigate(['/createbot']);
        } else if (res.message) {
          this.notifyService.publishNotification('Failed', res.message, 'error');
          this.isDisabled = false;
        } else {
          this.notifyService.publishNotification('Failed', 'An unexpected error occurred. Please try again.', 'error');
          this.isDisabled = false;
        }
      },
      error: (err) => {
        this.ngxLoader.stop(); 
        const error = err.message || 'An error occurred';
        this.notifyService.publishNotification('Failed', error, 'error');
        this.isDisabled = false;
      }
    });
  }
  


  


  // updateColorCode(event: Event): void {
  //   const inputElement = event.target as HTMLInputElement;
  //   this.selectedColor = inputElement.value;
  // }
  
  onNotification() {
    console.log('Notification clicked');
    // Add logic for notifications
  }
  
  onBlockAndReport() {
    console.log('Block & Report Spam clicked');
    // Add logic for blocking/reporting
  }
  
  onViewPrivacyPolicy() {
    console.log('View Privacy Policy clicked');
    // Add logic for viewing privacy policy
  }
  
  onViewTermsOfService() {
    console.log('View Terms of Services clicked');
    // Add logic for viewing terms of service
  }
  
  onLearnMore() {
    console.log('Learn More clicked');
    // Add logic for learning more
  }
  
  resetForm() {
    this.validateForm.reset({
      scheduleMessage:'no'
    })
    this.selectedTemplateData = undefined;
  }

  updatedMsgBody($event: any) {
    console.log($event)
  }

  addNewlines(text: string, maxLength: number): string {
    return text.replace(new RegExp(`(.{${maxLength}})`, 'g'), '$1\n');
  }

  onCountrySelect(code: string): void {
    this.selectedCountryCode = code; // Update the country code when a new country is selected
  }

  onTemplateSelect(templateId: string) {
    templateId && this.templateService.getTemplateById(templateId).subscribe(data => {
      this.selectedTemplateData = { ...data };
    })
  }

  submitDataToSendTemplate() {
    console.log("submitDataToSendTemplate")
    const form = this.validateForm.value;
    const template = this.templateMessageService.templateMessage.template
    let params = this.templateMessageService.templateMessage.data;
    console.log(params)

    const header = template?.components.find(item => item.type === 'HEADER');
    console.log(header)
    const compHeader = params.headerURL && {
      type: 'header',
      parameters: [
        {
          type: header?.format?.toLowerCase() || "image",
          image: {
            link: params.headerURL
          }
        }
      ]
    }

    const body = template?.components.find(item => item.type === 'BODY');
    const bodyParams = params.variables.map((item: any) => {
      return { "type": "text", "text": item.value }
    })
    const compBody = {
      "text": body?.text,
      "type": "body",
      "parameters": bodyParams
    }

    let comp = [];

    if (compHeader) {
      comp.push(compHeader)
    }

    if (compBody) {
      comp.push(compBody)
    }

    const senderNumbers = form.to.map((to: string) => {
      return `91${to}`
    })

    console.log(template)

    const reqBody: SEND_TEMPLATE_MODEL = {
      "name": template?.name || '',
      "from": "0123456789",
      "to": senderNumbers,
      "id": '8qTZWz54yQdq3qyNpcwgWT',
      "type": "template",
      components: comp,
      "language": {
        "policy": "deterministic",
        "code": template?.language || "en_US"
      }
    }
    console.log(reqBody)
  }


}




