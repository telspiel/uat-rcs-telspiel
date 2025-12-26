import { Component, ElementRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
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
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { NzIconService } from 'ng-zorro-antd/icon';
import { AbstractControl, ValidationErrors } from '@angular/forms';

export function noSpaceRegexValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value || '';
  const regex = /^\S+$/; 
  return regex.test(value) ? null : { noSpaces: true };
}

interface Country {
  name: string;
  code: string;
  flag: string;
}


@Component({
  selector: 'app-updatebot',
  templateUrl: './updatebot.component.html',
  styleUrls: ['./updatebot.component.scss']
})
export class UpdatebotComponent {

  nzTabPosition: NzTabPosition = 'top';
  selectedApi: string = '';
  backgroundUrl: any;
  bannerurl: any;
  // operators = [
  //   { name: 'VTL', label: 'VED TECH LABS' },
  //   { name: 'AIRTEL', label: 'AIRTEL' },
  //   { name: 'VODAFONE', label: 'VODAFONE' },
  //   { name: 'RELIANCE_JIO', label: 'RELIANCE_JIO' },
  //   { name: 'BSNL', label: 'BSNL' }
  // ];
  operators : any []=[]
  operatorForm!: FormGroup;
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
  operatorBotId: any;
  operatorTemplateSecret : any;
  operatorTemplateClientId : any;
  operatorBotSecret: any;
  operatorBotStatus: any;
  logColor() {
    console.log(this.selectedColor); // Logs the selected color
  }
  
  // formattedbotSummary: string = 'short description';
  bannerImageUrl: SafeUrl | null = null;
  selectedCountryCode = '+91';
  selectedColor: string = '#000000';
  botName: string = '';
  selectedValue = 'Conversational';
  botSummary: string = '';
  radioValue = '';
  imageUrl = null;
  imageUrl1 : SafeUrl | null = null
  selectedReseller: string | null = null;
  selectedSeller: string | null = null;
  selectedClient: string | null = null;
  selectedadmin: string | null = null;
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
  selectForm: FormGroup;
  Clientlist : any []=[]
  ResllerList : any []=[]
  Adminlist: any;
  loggedInUserName: string = '';
  SellerList :any []=[]
  Reseller="";
  Seller="";
  client="";
  Admin: any;
  brandDataList: any[] = [];
  isVisible = false;
  isConfirmLoading = false;
  err:string="";
  err1:string="";
   fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
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

  imageCropped(event: ImageCroppedEvent) {
    if (event.objectUrl) {
      this.croppedImage = event.objectUrl; 
    }
    console.log("Cropped image:", event);
  }
  
  handleOk(): void {
    this.isConfirmLoading = true;
  
    if (!this.croppedImage) {
      console.error("No cropped image available");
      this.isConfirmLoading = false;
      return;
    }
  
    // Convert the cropped image to a File
    this.convertBlobToFile(this.croppedImage, `${this.getRandomValue()}.png`)
      .then((file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("Type", "logo");
        formData.append("loggedInUserName", sessionStorage.getItem("USER_NAME") || "");
  
        // ✅ Show Local Preview Before Upload
        const objectURL = URL.createObjectURL(file);
        this.logourl = this.sanitizer.bypassSecurityTrustUrl(objectURL); // Show selected image instantly
  
        // ✅ Call API to Upload Image
        this.brandService.botlogo(formData).subscribe(
          (response) => {
            console.log("Upload successful", response);
  
            if (response.uploadFilePath) {
              this.imageUrl = response.uploadFilePath; // ✅ Show final image from API response
            } else {
              console.warn("No valid image path in response");
            }
  
            this.isVisible = false;
            this.isConfirmLoading = false;
          },
          (error) => {
            console.error("Upload failed", error);
            this.isConfirmLoading = false;
          }
        );
      })
      .catch((error) => {
        console.error("Error converting image:", error);
        this.isConfirmLoading = false;
      });
  }
  
  

  convertBlobToFile(blobUrl: string, fileName: string): Promise<File> {
    return fetch(blobUrl)
      .then((res) => res.blob()) 
      .then((blob) => new File([blob], fileName, { type: blob.type })); 
  }


  handleCancel(): void {
    this.isVisible = false;
  }

  handleCancel1(): void {
    this.isVisible1 = false;
  }

  showModal1(): void {
    this.isVisible1 = true;
  }

  

  handleOk1(): void {
    this.isConfirmLoading1 = true;
  
    // Convert blob URL to a File
    this.convertBlobToFile2(this.croppedImage, this.getRandomValue().toString()+".png").then((file) => {
      const formData = new FormData();
      formData.append('file', file); // Correct binary file
      formData.append('Type', 'banner'); // Type changed to 'banner'
      formData.append('loggedInUserName', sessionStorage.getItem('USER_NAME') || ''); // Get username from sessionStorage
  
      // Call API to upload the file
      this.brandService.botlogo(formData).subscribe(
        (response) => {
          console.log('Banner upload successful', response);
          
          // Store the uploaded file path for preview
          this.backgroundUrl = response.uploadFilePath;
          const objectURL = URL.createObjectURL(file);
          this.bannerurl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
  
          this.isVisible1 = false;
          this.isConfirmLoading1 = false;
        },
        (error) => {
          console.error('Banner upload failed', error);
          this.isConfirmLoading1 = false;
        }
      );
    }).catch((error) => {
      console.error('Error converting banner image:', error);
      this.isConfirmLoading1 = false;
    });
  }

  convertBlobToFile2(blobUrl: string, fileName: string): Promise<File> {
    return fetch(blobUrl)
      .then((res) => res.blob()) // Fetch blob data
      .then((blob) => new File([blob], fileName, { type: blob.type })); // Convert to File
  }

  

  constructor(private fb: FormBuilder,
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
    private cdr: ChangeDetectorRef,
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
    this.validateForm= this.fb.group({
      usertype:[this.usertype,[Validators.required]],
      botName: ['', [Validators.required, Validators.maxLength(21)]],
      brandName: ['', [Validators.required]],

      //to: ['', [Validators.required]],
      color: ['', [Validators.required]],
      primaryphone: [
        '+91', 
        [
          Validators.required,
          Validators.pattern(/^\+91\d{10}$/) // Ensures +91 followed by exactly 10 digits
        ]
      ],
      labelphone: ['', [Validators.required]],
      primarywebsite: ['', [Validators.required]],
      labelwebsite: ['', [Validators.required]],
      primaryemail: ['', [Validators.required]],
      emailLabel:['', [Validators.required]],
      region:['', [Validators.required]],
      messageType:[""],
      billingCategory:[this.senderTo],
      bannerimage:[''],
      language:[''],
      botlogo:[''],
      Url:[''],
      privacypolicyurl:[''],
      // chatbotwebhook:[''],
      botSummary: ['', [Validators.required]],
      scheduleMessage: [this.scheduleMessage, [Validators.required]]
    });
  }

  get operatorData(): FormArray {
      return this.operatorForm.get('operatorData') as FormArray;
    }
  
    onOperatorChange(selected: string[]) {
      this.operatorData.clear(); 
      selected.forEach(op => {
       this.operatorData.push(
     this.fb.group({
    operatorName: [op, Validators.required],
    isNewBot: [true, Validators.required], 
    traficVolume: [100, Validators.required],
    operatorBotId: ['', [noSpaceRegexValidator]],
    operatorTemplateSecret : ['', [noSpaceRegexValidator]],
    operatorTemplateClientId : ['', [noSpaceRegexValidator]],
    operatorBotSecret: ['', [noSpaceRegexValidator]],
    operatorBotStatus: ['LAUNCHED']
          })
        )
      });
    }
  ngOnInit(): void {
    this.operator();
    
    this.operatorForm = this.fb.group({
      selectedOperators: [[]], 
      
      operatorData: this.fb.array([]) 
    });
    this.initializeUserDetails();
    this.fetchChildUsers();
    this.setupFormListeners();
    this.handleSelectedBot();
  }

  initializeUserDetails(): void {
    this.userdt = {
      loggedInUsername: sessionStorage.getItem('USER_NAME'),
      userId: sessionStorage.getItem('USER_ID')
    };
  }

  fetchChildUsers(): void {
    this.userCreation.getAllChildForUser(this.userdt).subscribe((res) => {
      if (res.data?.userAllChildMap) {
        this.Adminlist = this.mapUserData(res.data.userAllChildMap.ADMIN);
        this.SellerList = this.mapUserData(res.data.userAllChildMap.SELLER);
        this.Clientlist = this.mapUserData(res.data.userAllChildMap.CLIENT);
        this.ResllerList = this.mapUserData(res.data.userAllChildMap.RESELLER);
      }
    });
  }

  handleSelectedBot(): void {
    let selectedBot = JSON.parse(sessionStorage.getItem('selectedBot') || 'null');
    const newSelectedBot = this.botService.getBotDetails();

    if (newSelectedBot && (!selectedBot || newSelectedBot.botId !== selectedBot.botId)) {
      selectedBot = newSelectedBot;
      sessionStorage.setItem('selectedBot', JSON.stringify(selectedBot));
    }

    if (selectedBot) {
      console.log('Using selectedBot:', selectedBot);
      this.fetchBotDetails(selectedBot.botId);
    } else {
      console.error('No bot details found.');
    }
  }

  fetchBotDetails(botId: string): void {
    const requestPayload = {
      loggedInUserName: sessionStorage.getItem('USER_NAME'),
      botId: botId
    };

    this.templateService.editbotdetail(requestPayload).subscribe(
      (response) => {
        if (response.result === 'Success' && response.data?.botData) {
          const botData = response.data.botData;
          const creationData = botData.creationData.data;

          this.edit = true;

          this.selectedColor = creationData.agentColor || '#000000'; // Default color
          this.applyIconColor(); // Apply color dynamically

          const botSummary = creationData.botDescription?.[0]?.botSummary || '';
          this.imageUrl = creationData.botLogoUrl || '';
          this.backgroundUrl =  creationData.bannerLogoUrl || '';

          // ✅ Prepare form data
          const formData = {
            botName: botData.botName,
            messageType: botData.botType,
            brandName: creationData.brandDetails?.brandName || '',
            color: this.selectedColor,
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

          const operatorData = response.data.botData.operatorData || [];
this.selectedClient = response.data.botData.userName || '';




this.validateForm.patchValue(formData);
this.operatorForm.patchValue({
  selectedOperators: operatorData.map((op: any) => op.operatorName),
  operatorData: operatorData.map((op: any) => ({
    operatorName: op.operatorName || '',
    isNewBot: op.isNewBot ?? false,
    traficVolume: op.trafficVolume || '',
    operatorBotId: op.operatorBotId || '',
    operatorTemplateSecret : op.operatorTemplateSecret || '',
    operatorTemplateClientId : op.operatorTemplateClientId || '',
    operatorBotSecret: op.operatorBotSecret || '',
    operatorBotStatus: op.operatorBotStatus || '',
  }))
});

const formArray = this.operatorForm.get('operatorDetails') as FormArray;
formArray.clear();  
operatorData.forEach((op: any) => {
  formArray.push(
    this.fb.group({
      operatorName: [op.operatorName || '', Validators.required],
      isNewBot: [op.isNewBot ?? false, Validators.required],
      traficVolume: [op.trafficVolume || '', Validators.required],
      operatorBotId: [op.operatorBotId || ''],
      operatorTemplateSecret : [op.operatorTemplateSecret || ''],
      operatorTemplateClientId :[op.operatorTemplateClientId || ''],
      operatorBotSecret: [op.operatorBotSecret || ''],
      operatorBotStatus: [op.operatorBotStatus || ''],
    })
  );
});


this.cdr.detectChanges();
console.log('Form patched successfully:', this.validateForm.value);

          console.log('Form patched successfully:', this.validateForm.value);
        } else {
          console.error('Invalid API response:', response);
        }
      },
      (error) => console.error('Failed to fetch bot details:', error)
    );
  }


  

  setupFormListeners(): void {
    this.validateForm.get('botName')?.valueChanges.subscribe(value => this.botName = value);
    this.validateForm.get('botSummary')?.valueChanges.subscribe(value => this.botSummary = value);
  }

  updateColorCode(event: any): void {
    this.selectedColor = event.target.value;
    this.validateForm.get('color')?.setValue(this.selectedColor);
    this.applyIconColor();
  }
  
  applyIconColor(): void {
    if (!this.selectedColor) return;
    
    // Set CSS variable for component-specific styling
    this.el.nativeElement.style.setProperty('--theme-icon-color', this.selectedColor);
    
    // Directly update only icons within this component using ElementRef
    setTimeout(() => {
      const iconsInComponent = this.el.nativeElement.querySelectorAll('span[nz-icon]');
      iconsInComponent.forEach((icon: HTMLElement) => {
        icon.style.color = this.selectedColor;
      });
      this.cdr.detectChanges();
    }, 0);
  }
  
  /**
   * Function to fetch bot details from API and update form
   */

  
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


  brandName(){

  }

  back(){
    sessionStorage.removeItem('selectedBot'); 
    console.log('selectedBot removed:', sessionStorage.getItem('selectedBot'));
    this.router.navigate(['/createbot']);
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
    const rawOperatorData = this.operatorForm.getRawValue().operatorData;

const transformedOperatorData = rawOperatorData.map((op: any) => ({
  operatorName: op.operatorName || '',
  isNewBot: op.isNewBot ?? false,
  trafficVolume: op.traficVolume || 100,  // 👈 remap from form field
  operatorBotId: op.operatorBotId || '',
  operatorTemplateSecret: op.operatorTemplateSecret || '',
  operatorTemplateClientId: op.operatorTemplateClientId || '',
  operatorBotSecret: op.operatorBotSecret || '',
  operatorBotStatus: op.operatorBotStatus || 'LAUNCHED'
}));
    const dt3=
      {
        loggedInUserName:sessionStorage.getItem('USER_NAME'),
          operatorData: transformedOperatorData,
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
            },
            
          },
          region: this.region,
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

  submitForm(): void {
  

  const totalTrafficVolume = this.operatorForm.value.operatorData.reduce((sum: number, operator: any) => {
      return sum + (parseInt(operator.trafficVolume, 10) || 0);
    }, 0);

     if (totalTrafficVolume ) {
      // this.ngxLoader.stop();  
      // this.isDisabled = false;
      // this.notifyService.publishNotification('Error', 'Traffic volume should sum up to 100%', 'error');
      return;
    }

    if (!this.selectedClient) {
      // this.toastService.error('Error', 'Please select the client first !!!', { nzDuration: 3000 });
      this.notifyService.publishNotification('Error', 'Please select the client first !!!', 'error');
      return;
    }
    const dt1 = this.validateForm.value; // Get all form field values
    console.log(this.edit)
    if (this.edit === true){
      this.editBot()
    }
    else{
        const operatorData = this.operatorForm.getRawValue().operatorData;

    // Transform form data into the required format
    const transformedData = {
      loggedInUserName:sessionStorage.getItem('USER_NAME'),
      // customerType: this.validateForm.value.usertype,
      creationData: {
        data: {
          bot: {
            privacyUrl: dt1.privacypolicyurl,
            termsAndConditionsUrl: dt1.Url,
            platform: "Google API",
            phoneList: [
              { value: dt1.primaryphone, label: dt1.labelphone },
            ],
            emailList: [
              { value: dt1.primaryemail, label: dt1.emailLabel },
            ],
            websiteList: [
              { value: dt1.primarywebsite, label: dt1.labelwebsite },
            ]
          },
          rcsBot: {
            languageSupported: dt1.language || "en", // Default to "en" if not provided
            agentMessageType: dt1.messageType || "text", // Default to "text" if not provided
            // webhookUrl: dt1.chatbotwebhook
          },
          botDescription: [
            {
              botName: dt1.botName,
              botSummary: dt1.botSummary
            },
          ],
          // botLogoUrl:this.botLogoUrl || '',
          // bannerLogoUrl: this.backgroundUrl || '',
          botLogoUrl:this.imageUrl,
          bannerLogoUrl: this.backgroundUrl,
          agentColor: dt1.color,
         brandDetails: {
          brandName: dt1.brandName
        },
        carrierDetails: {
          carrierList: [1, 2, 3], 
          globalReach: true 
        },
      },
        region: dt1.region || "India" 
      },
      botName: dt1.botName,
      botType:dt1.messageType,
      resellerName: this.selectedReseller,
      sellerName: this.selectedSeller,
      clientName: this.selectedClient,
      adminName: this.selectedadmin,
      // operatorData: this.operatorForm
    operatorData: this.operatorForm.value.operatorData
    };
  


    this.templateService.submitBot(transformedData as unknown as FormData).subscribe(
      (data: { message: string }) => {
        console.log('Bot created successfully:', data);
        this.notifyService.publishNotification('Success', data.message);
        console.log('Bot created successfully:', data);
      },
      (err: { meta?: { developer_message: string }; message?: string }) => {
        const error = err.meta?.developer_message || err.message || 'An error occurred';
        this.notifyService.publishNotification('Failed', error, 'error');
      }
    );
  }}

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
  operator(){
this.botService.viewtps(this.operator).subscribe(
  (res: any) => {
    const selectedOperators = res.data[0]?.selectedOperators || [];
   const operatorBotId = res.data[0]?.operatorBotId || '';
   const operatorTemplateSecret = res.data[0]?.operatorTemplateSecret || '';
   const operatorTemplateClientId = res.data[0]?.operatorTemplateClientId || '';
   const operatorBotSecret = res.data[0]?.operatorBotSecret || '';
   const operatorBotStatus = res.data[0]?.operatorBotStatus || '';
   console.log("Selected operators:", selectedOperators);

   const apiOperators = selectedOperators.map((op: string) => ({
    name: op,
    label: op,
    
  }));


    console.log("API operator list:", apiOperators);
    this.operators = [...apiOperators];

    console.log("Complete operator list:", this.operators);
  },
  (err) => {
    console.error("Error in viewtps:", err);
  }
);
  }


}





